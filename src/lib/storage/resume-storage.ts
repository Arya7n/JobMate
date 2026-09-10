import {
  deleteResumeBlob,
  getResumeBlob,
  putResumeBlob,
} from '@/lib/resume/idb';
import { STORAGE_KEYS, type StorageResult } from '@/lib/storage/keys';
import {
  readStorageItem,
  subscribeStorageKey,
  writeStorageItem,
} from '@/lib/storage/local-store';
import { toError } from '@/lib/storage/errors';
import {
  createEmptyResumeStore,
  normalizeResumeStore,
} from '@/lib/resume/normalize';
import {
  ACCEPTED_RESUME_TYPES,
  MAX_RESUME_BYTES,
  type ResumeRecord,
  type ResumeStore,
} from '@/lib/resume/types';

async function readStore(): Promise<StorageResult<ResumeStore>> {
  const result = await readStorageItem(STORAGE_KEYS.resumes);
  if (!result.ok) {
    return result;
  }

  return { ok: true, data: normalizeResumeStore(result.data) };
}

async function writeStore(
  store: ResumeStore,
): Promise<StorageResult<ResumeStore>> {
  const next = normalizeResumeStore(store);
  const result = await writeStorageItem(STORAGE_KEYS.resumes, next);
  if (!result.ok) {
    return result;
  }

  return { ok: true, data: next };
}

export async function getResumes(): Promise<StorageResult<ResumeRecord[]>> {
  const result = await readStore();
  if (!result.ok) {
    return result;
  }

  return { ok: true, data: result.data.resumes };
}

export async function saveResumeFromFile(
  file: File,
  name?: string,
): Promise<StorageResult<ResumeRecord>> {
  try {
    if (file.size <= 0) {
      return { ok: false, error: new Error('The selected file is empty.') };
    }

    if (file.size > MAX_RESUME_BYTES) {
      return {
        ok: false,
        error: new Error('Resumes must be 5 MB or smaller.'),
      };
    }

    const mimeType = file.type || 'application/octet-stream';
    const accepted = (ACCEPTED_RESUME_TYPES as readonly string[]).includes(
      mimeType,
    );
    const extensionOk = /\.(pdf|docx?)$/i.test(file.name);
    if (!accepted && !extensionOk) {
      return {
        ok: false,
        error: new Error('Upload a PDF or Word document.'),
      };
    }

    const storeResult = await readStore();
    if (!storeResult.ok) {
      return storeResult;
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const displayName =
      (name?.trim() || file.name.replace(/\.[^.]+$/, '') || 'Resume').trim();

    const record: ResumeRecord = {
      id,
      name: displayName,
      mimeType,
      sizeBytes: file.size,
      isDefault: storeResult.data.resumes.length === 0,
      createdAt: now,
      updatedAt: now,
    };

    await putResumeBlob(id, file);

    const next: ResumeStore = {
      ...storeResult.data,
      resumes: [...storeResult.data.resumes, record],
    };

    const writeResult = await writeStore(next);
    if (!writeResult.ok) {
      await deleteResumeBlob(id);
      return writeResult;
    }

    return { ok: true, data: record };
  } catch (error) {
    return { ok: false, error: toError(error) };
  }
}

export async function renameResume(
  id: string,
  name: string,
): Promise<StorageResult<ResumeRecord>> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { ok: false, error: new Error('Resume name is required.') };
  }

  const storeResult = await readStore();
  if (!storeResult.ok) {
    return storeResult;
  }

  const index = storeResult.data.resumes.findIndex((item) => item.id === id);
  if (index < 0) {
    return { ok: false, error: new Error('Resume not found.') };
  }

  const existing = storeResult.data.resumes[index]!;
  const updated: ResumeRecord = {
    ...existing,
    name: trimmed,
    updatedAt: new Date().toISOString(),
  };

  const resumes = [...storeResult.data.resumes];
  resumes[index] = updated;

  const writeResult = await writeStore({
    ...storeResult.data,
    resumes,
  });
  if (!writeResult.ok) {
    return writeResult;
  }

  return { ok: true, data: updated };
}

export async function setDefaultResume(
  id: string,
): Promise<StorageResult<ResumeRecord[]>> {
  const storeResult = await readStore();
  if (!storeResult.ok) {
    return storeResult;
  }

  if (!storeResult.data.resumes.some((item) => item.id === id)) {
    return { ok: false, error: new Error('Resume not found.') };
  }

  const resumes = storeResult.data.resumes.map((item) => ({
    ...item,
    isDefault: item.id === id,
    updatedAt: item.id === id ? new Date().toISOString() : item.updatedAt,
  }));

  const writeResult = await writeStore({
    ...storeResult.data,
    resumes,
  });
  if (!writeResult.ok) {
    return writeResult;
  }

  return { ok: true, data: writeResult.data.resumes };
}

export async function deleteResume(
  id: string,
): Promise<StorageResult<ResumeRecord[]>> {
  const storeResult = await readStore();
  if (!storeResult.ok) {
    return storeResult;
  }

  const remaining = storeResult.data.resumes.filter((item) => item.id !== id);
  if (remaining.length === storeResult.data.resumes.length) {
    return { ok: false, error: new Error('Resume not found.') };
  }

  const hadDefault = storeResult.data.resumes.some(
    (item) => item.id === id && item.isDefault,
  );
  if (hadDefault && remaining.length > 0 && !remaining.some((item) => item.isDefault)) {
    remaining[0] = {
      ...remaining[0]!,
      isDefault: true,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    await deleteResumeBlob(id);
  } catch {
    // Metadata still needs to stay consistent if the blob is already gone.
  }

  const writeResult = await writeStore({
    version: 1,
    resumes: remaining,
  });
  if (!writeResult.ok) {
    return writeResult;
  }

  return { ok: true, data: writeResult.data.resumes };
}

export async function openResume(id: string): Promise<StorageResult<void>> {
  try {
    const storeResult = await readStore();
    if (!storeResult.ok) {
      return storeResult;
    }

    const record = storeResult.data.resumes.find((item) => item.id === id);
    if (!record) {
      return { ok: false, error: new Error('Resume not found.') };
    }

    const blob = await getResumeBlob(id);
    if (!blob) {
      return { ok: false, error: new Error('Resume file is missing.') };
    }

    const typed =
      blob.type === record.mimeType
        ? blob
        : new Blob([blob], { type: record.mimeType });
    const url = URL.createObjectURL(typed);
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return { ok: true, data: undefined };
  } catch (error) {
    return { ok: false, error: toError(error) };
  }
}

export function subscribeResumes(
  listener: (resumes: ResumeRecord[]) => void,
): () => void {
  return subscribeStorageKey(STORAGE_KEYS.resumes, (value) => {
    listener(normalizeResumeStore(value).resumes);
  });
}

export const resumeStorage = {
  get: getResumes,
  saveFromFile: saveResumeFromFile,
  rename: renameResume,
  setDefault: setDefaultResume,
  remove: deleteResume,
  open: openResume,
  subscribe: subscribeResumes,
};

export { createEmptyResumeStore, normalizeResumeStore };
