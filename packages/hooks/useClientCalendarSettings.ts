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
            schedule: client.operations.schedule,
            slotDurationMinutes: client.modules.homeServices?.config?.slotDurationMinutes ?? 60,
          }
        : null,
    [client]
  );
}
