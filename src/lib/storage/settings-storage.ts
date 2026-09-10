import {
  DEFAULT_SETTINGS,
  type AppSettings,
} from '@/lib/settings/types';
import { STORAGE_KEYS, type StorageResult } from '@/lib/storage/keys';
import {
  readStorageItem,
  subscribeStorageKey,
  writeStorageItem,
} from '@/lib/storage/local-store';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeSettings(value: unknown): AppSettings {
  if (!isRecord(value)) {
    return { ...DEFAULT_SETTINGS };
  }

  return {
    fillHighConfidenceOnly:
      typeof value.fillHighConfidenceOnly === 'boolean'
        ? value.fillHighConfidenceOnly
        : DEFAULT_SETTINGS.fillHighConfidenceOnly,
    overwriteExistingValues:
      typeof value.overwriteExistingValues === 'boolean'
        ? value.overwriteExistingValues
        : DEFAULT_SETTINGS.overwriteExistingValues,
  };
}

export async function getSettings(): Promise<StorageResult<AppSettings>> {
  const result = await readStorageItem(STORAGE_KEYS.settings);
  if (!result.ok) {
    return result;
  }

  return { ok: true, data: normalizeSettings(result.data) };
}

export async function saveSettings(
  settings: AppSettings,
): Promise<StorageResult<AppSettings>> {
  const next = normalizeSettings(settings);
  const result = await writeStorageItem(STORAGE_KEYS.settings, next);
  if (!result.ok) {
    return result;
  }

  return { ok: true, data: next };
}

export function subscribeSettings(
  listener: (settings: AppSettings) => void,
): () => void {
  return subscribeStorageKey(STORAGE_KEYS.settings, (value) => {
    listener(normalizeSettings(value));
  });
}

export const settingsStorage = {
  get: getSettings,
  save: saveSettings,
  subscribe: subscribeSettings,
};
