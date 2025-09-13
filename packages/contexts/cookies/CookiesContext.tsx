//contexts/CookiesContext.tsx
'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CookiePrefs, COOKIE_POLICY_VERSION } from '../../types/cookies';
import {
  cleanupAnalyticsCookies,
  defaultPrefs,
  getPrefsFromLocalStorage,
  loadCookiePrefs,
  saveCookiePrefs,
  savePrefsToLocalStorage,
  shouldRePrompt,
} from '../../utils/cookies/cookieStorage';

type CookiesContextValue = {
  /** Preferencias actuales */
  prefs: CookiePrefs;
  /** Mostrar banner */
  showBanner: boolean;
  /** Aceptar todo (necesarias + estadísticas) */
  acceptAll: () => void;
  /** Rechazar todo excepto necesarias */
  rejectAll: () => void;
  /** Guardar selección granular (ahora solo statistics) */
  saveSelection: (next: Partial<CookiePrefs['consent']>) => void;
  /** Reabrir el gestor (p. ej. desde el footer) */
  openManager: () => void;
  /** Cerrar banner sin cambios (solo oculta) */
  closeBanner: () => void;
};

const CookiesContext = createContext<CookiesContextValue | null>(null);

export const CookiesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [prefs, setPrefs] = useState<CookiePrefs>(defaultPrefs());
  const [showBanner, setShowBanner] = useState<boolean>(true);

  // Carga inicial desde cookie/localStorage
  useEffect(() => {
    const cookiePrefs = loadCookiePrefs();
    const lsPrefs = getPrefsFromLocalStorage();
    const stored = cookiePrefs ?? lsPrefs;

    if (stored) {
      // Hay un consentimiento previamente guardado
      setPrefs(stored);
      setShowBanner(shouldRePrompt(stored)); // true si cambiaste la versión
    } else {
      // No hay nada guardado → mostrar banner
      const def = defaultPrefs(); // solo para tener un objeto inicial en estado
      setPrefs(def);
      setShowBanner(true); // 👈 forzar que se muestre
    }
  }, []);

  // Persistencia combinada
  const persist = useCallback((next: CookiePrefs) => {
    setPrefs(next);
    saveCookiePrefs(next);
    savePrefsToLocalStorage(next);
  }, []);

  const acceptAll = useCallback(() => {
    const next: CookiePrefs = {
      v: COOKIE_POLICY_VERSION,
      ts: new Date().toISOString(),
      consent: { necessary: true, statistics: true },
    };
    persist(next);
    setShowBanner(false);
    // Notifica a quien escuche (p. ej., componente que carga GA)
    document.dispatchEvent(new CustomEvent('cookies:consent-changed', { detail: next }));
  }, [persist]);

  const rejectAll = useCallback(() => {
    const next: CookiePrefs = {
      v: COOKIE_POLICY_VERSION,
      ts: new Date().toISOString(),
      consent: { necessary: true, statistics: false },
    };
    persist(next);
    setShowBanner(false);

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', { analytics_storage: 'denied' });
    }

    cleanupAnalyticsCookies();

    document.dispatchEvent(new CustomEvent('cookies:consent-changed', { detail: next }));
  }, [persist]);

  const saveSelection = useCallback(
    (nextConsent: Partial<CookiePrefs['consent']>) => {
      const next: CookiePrefs = {
        v: COOKIE_POLICY_VERSION,
        ts: new Date().toISOString(),
        consent: {
          necessary: true,
          statistics: !!nextConsent.statistics,
        },
      };
      persist(next);
      setShowBanner(false);

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', { analytics_storage: 'denied' });
      }

      cleanupAnalyticsCookies();

      document.dispatchEvent(new CustomEvent('cookies:consent-changed', { detail: next }));
    },
    [persist]
  );

  const openManager = useCallback(() => setShowBanner(true), []);
  const closeBanner = useCallback(() => setShowBanner(false), []);

  const value = useMemo(
    () => ({
      prefs,
      showBanner,
      acceptAll,
      rejectAll,
      saveSelection,
      openManager,
      closeBanner,
    }),
    [prefs, showBanner, acceptAll, rejectAll, saveSelection, openManager, closeBanner]
  );

  return <CookiesContext.Provider value={value}>{children}</CookiesContext.Provider>;
};

export function useCookies() {
  const ctx = useContext(CookiesContext);
  if (!ctx) throw new Error('useCookies must be used within CookiesProvider');
  return ctx;
}
