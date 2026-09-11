export const FIELD_TYPES = [
  'firstName',
  'middleName',
  'lastName',
  'fullName',
  'preferredName',
  'email',
  'phone',
  'city',
  'state',
  'country',
  'postalCode',
  'linkedin',
  'github',
  'portfolio',
  'website',
  'school',
  'degree',
  'fieldOfStudy',
  'company',
  'jobTitle',
  'resume',
  'unknown',
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const CONFIDENCE_LEVELS = ['high', 'medium', 'low'] as const;

export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];
