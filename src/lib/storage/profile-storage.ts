import { STORAGE_KEYS, type StorageResult } from './keys';
import { readStorageItem, subscribeStorageKey, writeStorageItem } from './local-store';
import { deserializeProfile } from '@/lib/profile/normalize';
import type { Profile } from '@/lib/profile/types';

export async function getProfile(): Promise<StorageResult<Profile>> {
  const result = await readStorageItem(STORAGE_KEYS.profile);
  if (!result.ok) {
    return result;
  }

  return { ok: true, data: deserializeProfile(result.data) };
}

export async function saveProfile(
  profile: Profile,
): Promise<StorageResult<Profile>> {
  const next = deserializeProfile(profile);
  const result = await writeStorageItem(STORAGE_KEYS.profile, next);
  if (!result.ok) {
    return result;
  }

  return { ok: true, data: next };
}

export function subscribeProfile(listener: (profile: Profile) => void): () => void {
  return subscribeStorageKey(STORAGE_KEYS.profile, (value) => {
    listener(deserializeProfile(value));
  });
}

export const profileStorage = {
  get: getProfile,
  save: saveProfile,
  subscribe: subscribeProfile,
};
