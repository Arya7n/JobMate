import type { ResumeRecord, ResumeStore } from './types';
import { RESUME_SCHEMA_VERSION } from './types';

export function createEmptyResumeStore(): ResumeStore {
  return {
    version: RESUME_SCHEMA_VERSION,
    resumes: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function readResume(value: unknown): ResumeRecord | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = asString(value.id);
  const name = asString(value.name).trim();
  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    mimeType: asString(value.mimeType) || 'application/octet-stream',
    sizeBytes: Math.max(0, Math.floor(asNumber(value.sizeBytes))),
    isDefault: asBoolean(value.isDefault),
    createdAt: asString(value.createdAt) || new Date().toISOString(),
    updatedAt: asString(value.updatedAt) || new Date().toISOString(),
  };
}

export function normalizeResumeStore(value: unknown): ResumeStore {
  if (!isRecord(value)) {
    return createEmptyResumeStore();
  }

  const resumes = Array.isArray(value.resumes)
    ? value.resumes.map(readResume).filter((item): item is ResumeRecord => item !== null)
    : [];

  const defaultCount = resumes.filter((item) => item.isDefault).length;
  if (defaultCount > 1) {
    let kept = false;
    for (const resume of resumes) {
      if (resume.isDefault) {
        if (kept) {
          resume.isDefault = false;
        } else {
          kept = true;
        }
      }
    }
  }

  return {
    version: RESUME_SCHEMA_VERSION,
    resumes,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileTypeLabel(mimeType: string): string {
  if (mimeType.includes('pdf')) {
    return 'PDF';
  }
  if (mimeType.includes('wordprocessingml') || mimeType.includes('msword')) {
    return 'DOCX';
  }
  return 'File';
}

export function extensionForMime(mimeType: string): string {
  if (mimeType.includes('pdf')) {
    return '.pdf';
  }
  if (mimeType.includes('wordprocessingml')) {
    return '.docx';
  }
  if (mimeType.includes('msword')) {
    return '.doc';
  }
  return '';
}

export function resumeDownloadName(
  record: Pick<ResumeRecord, 'name' | 'mimeType'>,
): string {
  const ext = extensionForMime(record.mimeType);
  const base = record.name.trim() || 'Resume';
  if (ext && !base.toLowerCase().endsWith(ext)) {
    return `${base}${ext}`;
  }
  return base;
}
