'use client';

import { useCallback, useEffect, useState } from 'react';
import { getMonthlyAvailability } from '../services/calendar';
import type { MonthlyAvailabilityResponse } from '../types/calendar';

export interface UseMonthlyAvailabilityState {
  availability: MonthlyAvailabilityResponse | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useMonthlyAvailability(
  clientId: string | null | undefined,
  year: number,
  month: number
): UseMonthlyAvailabilityState {
  const [availability, setAvailability] = useState<MonthlyAvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAvailability = useCallback(async () => {
    if (!clientId) {
      setAvailability(null);
      setError('Missing client id for monthly availability.');
      return;
    }

    setLoading(true);
    setError(null);

    const response = await getMonthlyAvailability(clientId, year, month);

    setAvailability(response);
    setError(response.success ? null : response.error || response.message || 'Unable to load availability.');
    setLoading(false);
  }, [clientId, month, year]);

  useEffect(() => {
    void loadAvailability();
  }, [loadAvailability]);

  return {
    availability,
    loading,
    error,
    reload: loadAvailability,
  };
}
