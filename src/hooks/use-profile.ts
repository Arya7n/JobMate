import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createEmptyProfile, profilesEqual, type Profile } from '@/lib/profile';
import { getProfile, saveProfile, subscribeProfile } from '@/lib/storage';

export function useProfileSnapshot(): {
  profile: Profile;
  status: 'loading' | 'ready' | 'error';
} {
  const [profile, setProfile] = useState<Profile>(createEmptyProfile);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    void getProfile().then((result) => {
      if (cancelled) {
        return;
      }

      if (!result.ok) {
        setStatus('error');
        return;
      }

      setProfile(result.data);
      setStatus('ready');
    });

    const unsubscribe = subscribeProfile((next) => {
      setProfile(next);
      setStatus('ready');
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return { profile, status };
}

export function useProfileEditor() {
  const [draft, setDraft] = useState<Profile>(createEmptyProfile);
  const [saved, setSaved] = useState<Profile>(createEmptyProfile);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const dirtyRef = useRef(false);

  const dirty = useMemo(() => !profilesEqual(draft, saved), [draft, saved]);
  dirtyRef.current = dirty;

  const reload = useCallback(async () => {
    const result = await getProfile();
    if (!result.ok) {
      setStatus('error');
      setErrorMessage(result.error.message);
      return;
    }

    setDraft(result.data);
    setSaved(result.data);
    setStatus('ready');
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    return subscribeProfile((next) => {
      setSaved(next);
      if (!dirtyRef.current) {
        setDraft(next);
      }
    });
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    setSaving(true);
    const result = await saveProfile(draft);
    setSaving(false);

    if (!result.ok) {
      setErrorMessage(result.error.message);
      return false;
    }

    setDraft(result.data);
    setSaved(result.data);
    setErrorMessage(null);
    return true;
  }, [draft]);

  const discard = useCallback(() => {
    setDraft(saved);
    setErrorMessage(null);
  }, [saved]);

  return {
    profile: draft,
    setProfile: setDraft,
    status,
    errorMessage,
    saving,
    dirty,
    save,
    discard,
    reload,
  };
}
