import React from 'react';
import { CookiePrefs } from '../types/cookies';
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
export declare const CookiesProvider: React.FC<React.PropsWithChildren>;
export declare function useCookies(): CookiesContextValue;
export {};
//# sourceMappingURL=CookiesContext.d.ts.map