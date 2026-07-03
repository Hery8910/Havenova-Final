'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

interface UseAuthAutoRedirectOptions {
  redirectTo: string;
  closeAlert: () => void;
  delayMs?: number;
}

export function useAuthAutoRedirect({
  redirectTo,
  closeAlert,
  delayMs = 4000,
}: UseAuthAutoRedirectOptions) {
  const router = useRouter();
  const redirectTimeoutRef = useRef<number | null>(null);

  const clearRedirectTimeout = useCallback(() => {
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
  }, []);

  const getAutoRedirectDescription = useCallback(
    (baseDescription: string, redirectCopy?: string) =>
      `${baseDescription} ${redirectCopy ?? ''}`.trim(),
    []
  );

  const scheduleRedirect = useCallback(() => {
    clearRedirectTimeout();
    redirectTimeoutRef.current = window.setTimeout(() => {
      closeAlert();
      router.push(redirectTo);
    }, delayMs);
  }, [clearRedirectTimeout, closeAlert, delayMs, redirectTo, router]);

  useEffect(() => {
    return () => {
      clearRedirectTimeout();
    };
  }, [clearRedirectTimeout]);

  return {
    getAutoRedirectDescription,
    scheduleRedirect,
  };
}
