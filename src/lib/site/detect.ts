import { scanDocument, summarizeScan } from '@/lib/detection';

const APPLICATION_HINTS = [
  /apply/,
  /application/,
  /careers/,
  /job.?application/,
  /candidate/,
  /resume/,
  /cv\b/,
];

export function looksLikeApplicationPage(
  url = location.href,
  title = document.title,
  bodyText = document.body?.innerText?.slice(0, 4000) ?? '',
): boolean {
  const corpus = `${url} ${title} ${bodyText}`.toLowerCase();
  return APPLICATION_HINTS.some((regex) => regex.test(corpus));
}

export function getPageScanSummary() {
  const fields = scanDocument();
  const summary = summarizeScan(fields);
  return {
    url: location.href,
    title: document.title,
    detected: summary.total > 0,
    likelyApplication: looksLikeApplicationPage() || summary.high >= 2,
    ...summary,
    labels: fields
      .filter((field) => field.confidence === 'high')
      .slice(0, 12)
      .map((field) => field.label),
  };
}

export type PageScanSummary = ReturnType<typeof getPageScanSummary>;
