import type { ConfidenceLevel, FieldType } from '@/lib/autofill/types';

export interface FieldSignals {
  name: string;
  id: string;
  placeholder: string;
  ariaLabel: string;
  label: string;
  autocomplete: string;
  type: string;
  surroundingText: string;
}

export interface DetectedField {
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  type: FieldType;
  confidence: ConfidenceLevel;
  score: number;
  signals: FieldSignals;
  label: string;
}

export interface FieldMatch {
  type: FieldType;
  confidence: ConfidenceLevel;
  score: number;
}

type Pattern = {
  type: FieldType;
  confidence: ConfidenceLevel;
  weight: number;
  patterns: RegExp[];
};

const HIGH = 'high' as const;
const MEDIUM = 'medium' as const;
const LOW = 'low' as const;

const PATTERNS: Pattern[] = [
  {
    type: 'email',
    confidence: HIGH,
    weight: 100,
    patterns: [
      /\be-?mail\b/,
      /emailaddress/,
      /candidate.?email/,
      /user.?email/,
      /work.?email/,
      /contact.?email/,
    ],
  },
  {
    type: 'phone',
    confidence: HIGH,
    weight: 95,
    patterns: [
      /\bphone\b/,
      /phonenumber/,
      /\bmobile\b/,
      /mobilenumber/,
      /\btelephone\b/,
      /\btel\b/,
      /cell.?phone/,
    ],
  },
  {
    type: 'linkedin',
    confidence: HIGH,
    weight: 95,
    patterns: [/\blinkedin\b/, /linkedin.?url/, /linkedin.?profile/],
  },
  {
    type: 'github',
    confidence: HIGH,
    weight: 95,
    patterns: [/\bgithub\b/, /github.?url/, /github.?profile/],
  },
  {
    type: 'portfolio',
    confidence: HIGH,
    weight: 90,
    patterns: [/\bportfolio\b/, /portfolio.?url/, /portfolio.?website/],
  },
  {
    type: 'website',
    confidence: MEDIUM,
    weight: 70,
    patterns: [
      /\bwebsite\b/,
      /personal.?website/,
      /personal.?url/,
      /homepage/,
      /web.?site/,
    ],
  },
  {
    type: 'firstName',
    confidence: HIGH,
    weight: 92,
    patterns: [
      /first.?name/,
      /given.?name/,
      /\bfname\b/,
      /forename/,
      /candidate.?first/,
    ],
  },
  {
    type: 'middleName',
    confidence: HIGH,
    weight: 88,
    patterns: [/middle.?name/, /\bmname\b/, /middle.?initial/],
  },
  {
    type: 'lastName',
    confidence: HIGH,
    weight: 92,
    patterns: [
      /last.?name/,
      /family.?name/,
      /surname/,
      /\blname\b/,
      /candidate.?last/,
    ],
  },
  {
    type: 'preferredName',
    confidence: MEDIUM,
    weight: 75,
    patterns: [/preferred.?name/, /preferred.?first/, /nickname/, /goes.?by/],
  },
  {
    type: 'fullName',
    confidence: MEDIUM,
    weight: 72,
    patterns: [
      /\bfull.?name\b/,
      /\byour.?name\b/,
      /\blegal.?name\b/,
      /\bcandidate.?name\b/,
      /^name$/,
      /\bname\b/,
    ],
  },
  {
    type: 'city',
    confidence: HIGH,
    weight: 85,
    patterns: [/\bcity\b/, /town/, /locality/],
  },
  {
    type: 'state',
    confidence: HIGH,
    weight: 85,
    patterns: [/\bstate\b/, /province/, /region/, /county/],
  },
  {
    type: 'country',
    confidence: HIGH,
    weight: 85,
    patterns: [/\bcountry\b/, /nation/, /country.?code/],
  },
  {
    type: 'postalCode',
    confidence: HIGH,
    weight: 88,
    patterns: [
      /zip.?code/,
      /postal.?code/,
      /\bzip\b/,
      /post.?code/,
      /postcode/,
    ],
  },
  {
    type: 'school',
    confidence: MEDIUM,
    weight: 70,
    patterns: [
      /\bschool\b/,
      /university/,
      /college/,
      /institution/,
      /alma.?mater/,
    ],
  },
  {
    type: 'degree',
    confidence: MEDIUM,
    weight: 68,
    patterns: [/\bdegree\b/, /qualification/, /education.?level/],
  },
  {
    type: 'fieldOfStudy',
    confidence: MEDIUM,
    weight: 68,
    patterns: [/field.?of.?study/, /major/, /concentration/, /discipline/],
  },
  {
    type: 'company',
    confidence: MEDIUM,
    weight: 65,
    patterns: [
      /\bcompany\b/,
      /employer/,
      /organization/,
      /organisation/,
      /current.?company/,
    ],
  },
  {
    type: 'jobTitle',
    confidence: MEDIUM,
    weight: 65,
    patterns: [
      /job.?title/,
      /current.?title/,
      /position.?title/,
      /\btitle\b/,
      /role/,
    ],
  },
];

const LOW_SIGNAL = [
  /summary/,
  /cover.?letter/,
  /why.*(join|company|role)/,
  /tell.?us/,
  /additional.?info/,
  /message/,
  /comment/,
  /password/,
  /ssn/,
  /social.?security/,
  /credit.?card/,
];

function normalizeSignal(value: string): string {
  return value
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-./]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compact(value: string): string {
  return normalizeSignal(value).replace(/\s+/g, '');
}

export function collectFieldSignals(
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
): FieldSignals {
  const labelledBy = element.getAttribute('aria-labelledby');
  let labelledByText = '';
  if (labelledBy) {
    labelledByText = labelledBy
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? '')
      .join(' ');
  }

  let labelText = '';
  if (element.id) {
    const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
    labelText = label?.textContent ?? '';
  }
  if (!labelText) {
    const parentLabel = element.closest('label');
    labelText = parentLabel?.textContent ?? '';
  }

  const surrounding =
    element.parentElement?.textContent?.slice(0, 180) ??
    element.closest('div, fieldset, section, form')?.textContent?.slice(0, 180) ??
    '';

  return {
    name: element.getAttribute('name') ?? '',
    id: element.id ?? '',
    placeholder: element.getAttribute('placeholder') ?? '',
    ariaLabel: element.getAttribute('aria-label') ?? '',
    label: [labelText, labelledByText].filter(Boolean).join(' '),
    autocomplete: element.getAttribute('autocomplete') ?? '',
    type:
      element instanceof HTMLInputElement
        ? element.type
        : element.tagName.toLowerCase(),
    surroundingText: surrounding,
  };
}

function scoreAgainstCorpus(corpus: string, compacted: string): FieldMatch | null {
  let best: FieldMatch | null = null;

  for (const pattern of PATTERNS) {
    for (const regex of pattern.patterns) {
      if (regex.test(corpus) || regex.test(compacted)) {
        const next: FieldMatch = {
          type: pattern.type,
          confidence: pattern.confidence,
          score: pattern.weight,
        };
        if (!best || next.score > best.score) {
          best = next;
        }
      }
    }
  }

  return best;
}

function fromAutocomplete(autocomplete: string): FieldMatch | null {
  const value = normalizeSignal(autocomplete);
  const map: Record<string, FieldType> = {
    email: 'email',
    tel: 'phone',
    'tel-national': 'phone',
    'given-name': 'firstName',
    'additional-name': 'middleName',
    'family-name': 'lastName',
    name: 'fullName',
    'nickname': 'preferredName',
    'address-level2': 'city',
    'address-level1': 'state',
    country: 'country',
    'country-name': 'country',
    'postal-code': 'postalCode',
    organization: 'company',
    'organization-title': 'jobTitle',
    url: 'website',
  };

  const type = map[value];
  if (!type) {
    return null;
  }

  return { type, confidence: HIGH, score: 98 };
}

function fromInputType(type: string): FieldMatch | null {
  if (type === 'email') {
    return { type: 'email', confidence: HIGH, score: 99 };
  }
  if (type === 'tel') {
    return { type: 'phone', confidence: HIGH, score: 99 };
  }
  if (type === 'url') {
    return { type: 'website', confidence: MEDIUM, score: 60 };
  }
  return null;
}

export function classifyFieldSignals(signals: FieldSignals): FieldMatch {
  if (
    signals.type === 'password' ||
    /password|passwd|ssn|social.?security|credit.?card/.test(
      normalizeSignal(
        [signals.name, signals.id, signals.label, signals.ariaLabel].join(' '),
      ),
    )
  ) {
    return { type: 'unknown', confidence: LOW, score: 0 };
  }

  const parts = [
    signals.autocomplete,
    signals.name,
    signals.id,
    signals.placeholder,
    signals.ariaLabel,
    signals.label,
  ]
    .map(normalizeSignal)
    .filter(Boolean);

  const corpus = parts.join(' ');
  const compacted = parts.map(compact).join(' ');

  if (LOW_SIGNAL.some((regex) => regex.test(corpus))) {
    const soft = scoreAgainstCorpus(corpus, compacted);
    if (!soft || soft.confidence !== HIGH) {
      return { type: 'unknown', confidence: LOW, score: 15 };
    }
  }

  const candidates = [
    fromAutocomplete(signals.autocomplete),
    fromInputType(signals.type),
    scoreAgainstCorpus(corpus, compacted),
  ].filter((item): item is FieldMatch => item !== null);

  if (candidates.length === 0) {
    const surrounding = normalizeSignal(signals.surroundingText);
    const surroundingMatch = scoreAgainstCorpus(
      surrounding,
      compact(surrounding),
    );
    if (surroundingMatch && surroundingMatch.confidence === HIGH) {
      return {
        ...surroundingMatch,
        confidence: MEDIUM,
        score: Math.max(40, surroundingMatch.score - 25),
      };
    }
    return { type: 'unknown', confidence: LOW, score: 0 };
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]!;
}

export function isFillableElement(
  element: Element,
): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement {
  if (!(element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement)) {
    return false;
  }

  if (element.disabled) {
    return false;
  }

  if (
    (element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement) &&
    element.readOnly
  ) {
    return false;
  }

  if (element instanceof HTMLInputElement) {
    const type = element.type.toLowerCase();
    if (
      type === 'hidden' ||
      type === 'password' ||
      type === 'file' ||
      type === 'submit' ||
      type === 'button' ||
      type === 'reset' ||
      type === 'image' ||
      type === 'checkbox' ||
      type === 'radio' ||
      type === 'color' ||
      type === 'range'
    ) {
      return false;
    }
  }

  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false;
  }

  return true;
}

export function displayLabelForField(field: DetectedField): string {
  const labels: Record<FieldType, string> = {
    firstName: 'First name',
    middleName: 'Middle name',
    lastName: 'Last name',
    fullName: 'Full name',
    preferredName: 'Preferred name',
    email: 'Email',
    phone: 'Phone',
    city: 'City',
    state: 'State',
    country: 'Country',
    postalCode: 'Postal code',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    portfolio: 'Portfolio',
    website: 'Website',
    school: 'School',
    degree: 'Degree',
    fieldOfStudy: 'Field of study',
    company: 'Company',
    jobTitle: 'Job title',
    unknown: 'Unknown',
  };

  return labels[field.type];
}
