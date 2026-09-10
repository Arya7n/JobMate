export const STORAGE_KEYS = {
  profile: 'jobmate.profile',
  resumes: 'jobmate.resumes',
  applications: 'jobmate.applications',
  settings: 'jobmate.settings',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export type StorageResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: Error };
