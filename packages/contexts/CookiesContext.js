//contexts/CookiesContext.tsx
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { COOKIE_POLICY_VERSION } from '../types/cookies';
import { cleanupAnalyticsCookies, defaultPrefs, getPrefsFromLocalStorage, loadCookiePrefs, saveCookiePrefs, savePrefsToLocalStorage, shouldRePrompt, } from '../utils/cookies/cookieStorage';
const CookiesContext = createContext(null);
export const CookiesProvider = ({ children }) => {
    const [prefs, setPrefs] = useState(defaultPrefs());
    const [showBanner, setShowBanner] = useState(true);
    // Carga inicial desde cookie/localStorage
    useEffect(() => {
        const cookiePrefs = loadCookiePrefs();
        const lsPrefs = getPrefsFromLocalStorage();
        const stored = cookiePrefs ?? lsPrefs;
        if (stored) {
            // Hay un consentimiento previamente guardado
            setPrefs(stored);
            setShowBanner(shouldRePrompt(stored)); // true si cambiaste la versión
        }
        else {
            // No hay nada guardado → mostrar banner
            const def = defaultPrefs(); // solo para tener un objeto inicial en estado
            setPrefs(def);
            setShowBanner(true); // 👈 forzar que se muestre
        }
    }, []);
    // Persistencia combinada
    const persist = useCallback((next) => {
        setPrefs(next);
        saveCookiePrefs(next);
        savePrefsToLocalStorage(next);
    }, []);
    const acceptAll = useCallback(() => {
        const next = {
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
        const next = {
            v: COOKIE_POLICY_VERSION,
            ts: new Date().toISOString(),
            consent: { necessary: true, statistics: false },
        };
        persist(next);
        setShowBanner(false);
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', { analytics_storage: 'denied' });
        }
        cleanupAnalyticsCookies();
        document.dispatchEvent(new CustomEvent('cookies:consent-changed', { detail: next }));
    }, [persist]);
    const saveSelection = useCallback((nextConsent) => {
        const next = {
            v: COOKIE_POLICY_VERSION,
            ts: new Date().toISOString(),
            consent: {
                necessary: true,
                statistics: !!nextConsent.statistics,
            },
        };
        persist(next);
        setShowBanner(false);
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', { analytics_storage: 'denied' });
        }
        cleanupAnalyticsCookies();
        document.dispatchEvent(new CustomEvent('cookies:consent-changed', { detail: next }));
    }, [persist]);
    const openManager = useCallback(() => setShowBanner(true), []);
    const closeBanner = useCallback(() => setShowBanner(false), []);
    const value = useMemo(() => ({
        prefs,
        showBanner,
        acceptAll,
        rejectAll,
        saveSelection,
        openManager,
        closeBanner,
    }), [prefs, showBanner, acceptAll, rejectAll, saveSelection, openManager, closeBanner]);
    return _jsx(CookiesContext.Provider, { value: value, children: children });
};
export function useCookies() {
    const ctx = useContext(CookiesContext);
    if (!ctx)
        throw new Error('useCookies must be used within CookiesProvider');
    return ctx;
}
