import { browser } from 'wxt/browser';
import { toError } from './errors';
import type { StorageKey, StorageResult } from './keys';

export async function readStorageItem(
  key: StorageKey,
): Promise<StorageResult<unknown>> {
  try {
    const record = await browser.storage.local.get(key);
    return { ok: true, data: record[key] };
  } catch (error) {
    return { ok: false, error: toError(error) };
  }
}

export async function writeStorageItem<T>(
  key: StorageKey,
  value: T,
): Promise<StorageResult<T>> {
  try {
    await browser.storage.local.set({ [key]: value });
    return { ok: true, data: value };
  } catch (error) {
    return { ok: false, error: toError(error) };
  }
}

export function subscribeStorageKey(
  key: StorageKey,
  listener: (value: unknown) => void,
): () => void {
  const onChanged = (
    changes: { [key: string]: { newValue?: unknown } | undefined },
    areaName: string,
  ) => {
    if (areaName !== 'local') {
      return;
    }

    const change = changes[key];
    if (!change) {
      return;
    }

    listener(change.newValue);
  };

  browser.storage.onChanged.addListener(onChanged);
  return () => browser.storage.onChanged.removeListener(onChanged);
}
