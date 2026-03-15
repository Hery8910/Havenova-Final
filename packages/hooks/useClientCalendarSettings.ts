'use client';

import { useMemo } from 'react';
import { useClient } from '../contexts/client';
import type { ClientCalendarSettings } from '../types/calendar';

export function useClientCalendarSettings(): ClientCalendarSettings | null {
  const { client } = useClient();

  return useMemo(
    () =>
      client
        ? {
            clientId: client._id,
            schedule: client.schedule,
            slotDurationMinutes: client.slotDurationMinutes,
          }
        : null,
    [client]
  );
}
