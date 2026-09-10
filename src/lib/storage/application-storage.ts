import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type JobApplication,
} from '@/lib/applications/types';
import { STORAGE_KEYS, type StorageResult } from '@/lib/storage/keys';
import {
  readStorageItem,
  subscribeStorageKey,
  writeStorageItem,
} from '@/lib/storage/local-store';

export interface ApplicationStore {
  version: 1;
  applications: JobApplication[];
}

export function createEmptyApplicationStore(): ApplicationStore {
  return { version: 1, applications: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function asStatus(value: unknown): ApplicationStatus {
  if (
    typeof value === 'string' &&
    (APPLICATION_STATUSES as readonly string[]).includes(value)
  ) {
    return value as ApplicationStatus;
  }
  return 'saved';
}

function readApplication(value: unknown): JobApplication | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = asString(value.id);
  if (!id) {
    return null;
  }

  return {
    id,
    company: asString(value.company),
    position: asString(value.position),
    url: asString(value.url),
    dateApplied: asString(value.dateApplied),
    status: asStatus(value.status),
    resumeId: asString(value.resumeId),
    notes: asString(value.notes),
  };
}

export function normalizeApplicationStore(value: unknown): ApplicationStore {
  if (!isRecord(value)) {
    return createEmptyApplicationStore();
  }

  const applications = Array.isArray(value.applications)
    ? value.applications
        .map(readApplication)
        .filter((item): item is JobApplication => item !== null)
    : [];

  return { version: 1, applications };
}

export function serializeApplicationStore(store: ApplicationStore): string {
  return JSON.stringify(normalizeApplicationStore(store));
}

export function deserializeApplicationStore(raw: unknown): ApplicationStore {
  if (typeof raw === 'string') {
    try {
      return normalizeApplicationStore(JSON.parse(raw) as unknown);
    } catch {
      return createEmptyApplicationStore();
    }
  }

  return normalizeApplicationStore(raw);
}

async function readStore(): Promise<StorageResult<ApplicationStore>> {
  const result = await readStorageItem(STORAGE_KEYS.applications);
  if (!result.ok) {
    return result;
  }

  return { ok: true, data: deserializeApplicationStore(result.data) };
}

async function writeStore(
  store: ApplicationStore,
): Promise<StorageResult<ApplicationStore>> {
  const next = normalizeApplicationStore(store);
  const result = await writeStorageItem(STORAGE_KEYS.applications, next);
  if (!result.ok) {
    return result;
  }

  return { ok: true, data: next };
}

export type ApplicationInput = Omit<JobApplication, 'id'> & { id?: string };

export async function getApplications(): Promise<
  StorageResult<JobApplication[]>
> {
  const result = await readStore();
  if (!result.ok) {
    return result;
  }

  return { ok: true, data: result.data.applications };
}

export async function saveApplication(
  input: ApplicationInput,
): Promise<StorageResult<JobApplication>> {
  const storeResult = await readStore();
  if (!storeResult.ok) {
    return storeResult;
  }

  const id = input.id?.trim() || crypto.randomUUID();
  const application: JobApplication = {
    id,
    company: input.company?.trim() || undefined,
    position: input.position?.trim() || undefined,
    url: input.url?.trim() || undefined,
    dateApplied: input.dateApplied?.trim() || undefined,
    status: input.status,
    resumeId: input.resumeId?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
  };

  const existingIndex = storeResult.data.applications.findIndex(
    (item) => item.id === id,
  );
  const applications = [...storeResult.data.applications];
  if (existingIndex >= 0) {
    applications[existingIndex] = application;
  } else {
    applications.unshift(application);
  }

  const writeResult = await writeStore({ version: 1, applications });
  if (!writeResult.ok) {
    return writeResult;
  }

  return { ok: true, data: application };
}

export async function deleteApplication(
  id: string,
): Promise<StorageResult<JobApplication[]>> {
  const storeResult = await readStore();
  if (!storeResult.ok) {
    return storeResult;
  }

  const applications = storeResult.data.applications.filter(
    (item) => item.id !== id,
  );
  if (applications.length === storeResult.data.applications.length) {
    return { ok: false, error: new Error('Application not found.') };
  }

  const writeResult = await writeStore({ version: 1, applications });
  if (!writeResult.ok) {
    return writeResult;
  }

  return { ok: true, data: writeResult.data.applications };
}

export function subscribeApplications(
  listener: (applications: JobApplication[]) => void,
): () => void {
  return subscribeStorageKey(STORAGE_KEYS.applications, (value) => {
    listener(deserializeApplicationStore(value).applications);
  });
}

export function getApplicationStats(applications: JobApplication[]) {
  return {
    total: applications.length,
    applied: applications.filter((item) => item.status === 'applied').length,
    interviews: applications.filter((item) => item.status === 'interview')
      .length,
    offers: applications.filter((item) => item.status === 'offer').length,
  };
}

export const applicationStorage = {
  get: getApplications,
  save: saveApplication,
  remove: deleteApplication,
  subscribe: subscribeApplications,
};
