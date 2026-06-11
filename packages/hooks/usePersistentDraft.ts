'use client';

import { useCallback, useEffect, useState } from 'react';

interface PersistentDraftEnvelope<T> {
  ownerKey: string;
  payload: T;
  updatedAt: string;
  version: number;
}

interface UsePersistentDraftOptions<T> {
  ownerKey: string;
  storageKey?: string;
  version: number;
}

export function usePersistentDraft<T>({
  ownerKey,
  storageKey,
  version,
}: UsePersistentDraftOptions<T>) {
  const [storedDraft, setStoredDraft] = useState<T | null>(null);

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;

    const rawDraft = window.localStorage.getItem(storageKey);
    if (!rawDraft) return;

    try {
      const parsed = JSON.parse(rawDraft) as Partial<PersistentDraftEnvelope<T>>;

      if (parsed.version !== version || parsed.ownerKey !== ownerKey || !('payload' in parsed)) {
        window.localStorage.removeItem(storageKey);
        return;
      }

      setStoredDraft(parsed.payload as T);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [ownerKey, storageKey, version]);

  const persistDraft = useCallback(
    (payload: T) => {
      if (!storageKey || typeof window === 'undefined') return;

      const envelope: PersistentDraftEnvelope<T> = {
        ownerKey,
        payload,
        updatedAt: new Date().toISOString(),
        version,
      };

      window.localStorage.setItem(storageKey, JSON.stringify(envelope));
    },
    [ownerKey, storageKey, version]
  );

  const clearDraft = useCallback(() => {
    if (!storageKey || typeof window === 'undefined') return;

    window.localStorage.removeItem(storageKey);
    setStoredDraft(null);
  }, [storageKey]);

  return {
    clearDraft,
    persistDraft,
    storedDraft,
  };
}
