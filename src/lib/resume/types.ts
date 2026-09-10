export interface ResumeRecord {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeStore {
  version: 1;
  resumes: ResumeRecord[];
}

export const RESUME_SCHEMA_VERSION = 1 as const;

export const ACCEPTED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;
