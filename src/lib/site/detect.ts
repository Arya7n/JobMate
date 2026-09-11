import type { FieldType } from '@/lib/autofill/types';
import { scanDocument, summarizeScan, type DetectedField } from '@/lib/detection';

/** Fields that almost never appear on login, checkout, or contact forms. */
const JOB_SPECIFIC_FIELD_TYPES = new Set<FieldType>([
  'linkedin',
  'github',
  'portfolio',
  'school',
  'degree',
  'fieldOfStudy',
  'resume',
]);

const IDENTITY_FIELD_TYPES = new Set<FieldType>([
  'firstName',
  'lastName',
  'fullName',
  'email',
  'phone',
]);

const ATS_HOST_PATTERNS = [
  /(?:^|\.)greenhouse\.io$/,
  /(?:^|\.)lever\.co$/,
  /(?:^|\.)ashbyhq\.com$/,
  /(?:^|\.)myworkdayjobs\.com$/,
  /(?:^|\.)workday\.com$/,
  /(?:^|\.)smartrecruiters\.com$/,
  /(?:^|\.)icims\.com$/,
  /(?:^|\.)taleo\.net$/,
  /(?:^|\.)jobvite\.com$/,
  /(?:^|\.)bamboohr\.com$/,
  /(?:^|\.)rippling\.com$/,
  /(?:^|\.)wellfound\.com$/,
  /(?:^|\.)workable\.com$/,
  /(?:^|\.)applytojob\.com$/,
  /(?:^|\.)jazzhr\.com$/,
  /(?:^|\.)recruitee\.com$/,
  /(?:^|\.)personio\.(?:de|com)$/,
  /(?:^|\.)successfactors\.com$/,
  /(?:^|\.)oraclecloud\.com$/,
  /(?:^|\.)eightfold\.ai$/,
  /(?:^|\.)dover\.io$/,
  /(?:^|\.)gem\.com$/,
  /(?:^|\.)jobappnetwork\.com$/,
];

const JOB_PATH_PATTERNS = [
  /\/jobs?(?:\/|$|\?|-|_)/,
  /\/careers?(?:\/|$|\?)/,
  /\/apply\b/,
  /\/applications?\b/,
  /[-_/]application\b/,
  /\/positions?(?:\/|$|\?)/,
  /\/vacancies(?:\/|$|\?)/,
  /\/hiring\b/,
  /\/join[-_]?us\b/,
  /\/opportunit/,
  /easy[-_]?apply/,
];

const STRONG_BODY_HINTS = [
  /submit (your )?application/,
  /apply for this (job|role|position)/,
  /job application/,
  /equal opportunity employer/,
  /upload (your )?resume/,
  /attach (your )?resume/,
  /cover letter/,
];

export interface ApplicationPageInput {
  url: string;
  title: string;
  bodyText?: string;
  fieldTypes?: readonly FieldType[];
}

function parseUrl(url: string): { hostname: string; path: string } {
  try {
    const parsed = new URL(url);
    return {
      hostname: parsed.hostname.toLowerCase(),
      path: `${parsed.pathname}${parsed.search}`.toLowerCase(),
    };
  } catch {
    return { hostname: '', path: url.toLowerCase() };
  }
}

function isKnownAtsHost(hostname: string): boolean {
  return ATS_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
}

function titleLooksLikeJob(title: string): boolean {
  const value = title.toLowerCase();
  if (
    /\b(job application|apply now|apply for|apply to|application for)\b/.test(
      value,
    )
  ) {
    return true;
  }
  if (
    /\b(careers?|hiring|open roles?|open positions?|job opening)\b/.test(value)
  ) {
    return true;
  }
  return (
    /\bapplication\b/.test(value) &&
    /\b(job|role|position|candidate|engineer|developer|designer|manager|analyst|intern|fixture)\b/.test(
      value,
    )
  );
}

function urlLooksLikeJob(url: string): boolean {
  const { hostname, path } = parseUrl(url);
  if (isKnownAtsHost(hostname)) {
    return true;
  }

  if (hostname.endsWith('linkedin.com')) {
    return /\/jobs(?:\/|$|\?)/.test(path);
  }

  if (hostname.endsWith('indeed.com') || hostname.endsWith('glassdoor.com')) {
    return /apply|viewjob|job-listing|\/job\//.test(path);
  }

  return JOB_PATH_PATTERNS.some((pattern) => pattern.test(path));
}

function bodyLooksLikeJob(bodyText: string): boolean {
  const corpus = bodyText.toLowerCase();
  return STRONG_BODY_HINTS.some((pattern) => pattern.test(corpus));
}

function countMatching(
  fieldTypes: readonly FieldType[],
  allowed: Set<FieldType>,
): number {
  let count = 0;
  const seen = new Set<FieldType>();
  for (const type of fieldTypes) {
    if (!allowed.has(type) || seen.has(type)) {
      continue;
    }
    seen.add(type);
    count += 1;
  }
  return count;
}

/**
 * Page-level check only (URL, title, known ATS, strong body copy).
 * Generic words like "apply" in a cookie banner or article are ignored.
 */
export function looksLikeApplicationPage(
  url = typeof location === 'undefined' ? '' : location.href,
  title = typeof document === 'undefined' ? '' : document.title,
  bodyText = typeof document === 'undefined'
    ? ''
    : (document.body?.innerText?.slice(0, 4000) ?? ''),
): boolean {
  return (
    urlLooksLikeJob(url) ||
    titleLooksLikeJob(title) ||
    bodyLooksLikeJob(bodyText)
  );
}

/**
 * True only when the page looks like a job application *and* there are
 * application-like fields. Login, contact, and checkout forms stay ignored.
 */
export function isLikelyJobApplication(input: ApplicationPageInput): boolean {
  const fieldTypes = input.fieldTypes ?? [];
  if (fieldTypes.length === 0) {
    return false;
  }

  const jobSpecific = countMatching(fieldTypes, JOB_SPECIFIC_FIELD_TYPES);
  if (jobSpecific >= 2) {
    return true;
  }

  if (
    !looksLikeApplicationPage(input.url, input.title, input.bodyText ?? '')
  ) {
    return false;
  }

  const identity = countMatching(fieldTypes, IDENTITY_FIELD_TYPES);
  return jobSpecific >= 1 || identity >= 2;
}

export function getPageScanSummary(
  fields: DetectedField[] = scanDocument(),
  page?: Pick<ApplicationPageInput, 'url' | 'title' | 'bodyText'>,
) {
  const summary = summarizeScan(fields);
  const url = page?.url ?? location.href;
  const title = page?.title ?? document.title;
  const bodyText =
    page?.bodyText ?? document.body?.innerText?.slice(0, 4000) ?? '';
  const likelyApplication = isLikelyJobApplication({
    url,
    title,
    bodyText,
    fieldTypes: fields.map((field) => field.type),
  });

  return {
    url,
    title,
    detected: likelyApplication,
    likelyApplication,
    ...summary,
    labels: fields
      .filter((field) => field.confidence === 'high')
      .slice(0, 12)
      .map((field) => field.label),
  };
}

export type PageScanSummary = ReturnType<typeof getPageScanSummary>;
