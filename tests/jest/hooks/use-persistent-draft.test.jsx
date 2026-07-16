import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';

import { usePersistentDraft } from '../../../packages/hooks/usePersistentDraft';

describe('usePersistentDraft', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('hydrates a valid persisted draft for the current user and version', async () => {
    window.localStorage.setItem(
      'cleaning-draft',
      JSON.stringify({
        ownerKey: 'user-1',
        version: 2,
        updatedAt: '2026-06-04T10:00:00.000Z',
        payload: { step: 4, values: { details: 'Bring products' } },
      })
    );

    const { result } = renderHook(() =>
      usePersistentDraft({
        ownerKey: 'user-1',
        storageKey: 'cleaning-draft',
        version: 2,
      })
    );

    await waitFor(() => {
      expect(result.current.storedDraft).toEqual({
        step: 4,
        values: { details: 'Bring products' },
      });
    });
  });

  it('invalidates persisted drafts from another user or version', async () => {
    window.localStorage.setItem(
      'cleaning-draft',
      JSON.stringify({
        ownerKey: 'user-2',
        version: 1,
        updatedAt: '2026-06-04T10:00:00.000Z',
        payload: { step: 1 },
      })
    );

    const { result } = renderHook(() =>
      usePersistentDraft({
        ownerKey: 'user-1',
        storageKey: 'cleaning-draft',
        version: 2,
      })
    );

    await waitFor(() => {
      expect(result.current.storedDraft).toBeNull();
    });

    expect(window.localStorage.getItem('cleaning-draft')).toBeNull();
  });

  it('persists and clears drafts through the returned API', () => {
    const { result } = renderHook(() =>
      usePersistentDraft({
        ownerKey: 'user-1',
        storageKey: 'cleaning-draft',
        version: 2,
      })
    );

    act(() => {
      result.current.persistDraft({ step: 3, values: { roomsCount: '2' } });
    });

    expect(JSON.parse(window.localStorage.getItem('cleaning-draft'))).toMatchObject({
      ownerKey: 'user-1',
      version: 2,
      payload: { step: 3, values: { roomsCount: '2' } },
    });

    act(() => {
      result.current.clearDraft();
    });

    expect(window.localStorage.getItem('cleaning-draft')).toBeNull();
    expect(result.current.storedDraft).toBeNull();
  });
});
