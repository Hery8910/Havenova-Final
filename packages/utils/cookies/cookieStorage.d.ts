import { CookiePrefs } from '../../types/cookies';
/** Serializa preferencias en un valor compacto de cookie.
 * Ej: v=1&ts=2025-09-02T10%3A00%3A00.000Z&nec=1&stat=0
 */
export declare function serializeCookiePrefs(prefs: CookiePrefs): string;
/** Parsea el valor de cookie a objeto */
export declare function parseCookiePrefs(value?: string | null): CookiePrefs | null;
export declare function getCookie(name: string): string | null;
export declare function setCookie(name: string, value: string, days?: number): void;
export declare function deleteCookie(name: string): void;
export declare function getPrefsFromLocalStorage(): CookiePrefs | null;
export declare function savePrefsToLocalStorage(prefs: CookiePrefs): void;
export declare function loadCookiePrefs(): CookiePrefs | null;
export declare function saveCookiePrefs(prefs: CookiePrefs): void;
/** Re-pregunta si cambia la versión de política */
export declare function shouldRePrompt(existing: CookiePrefs | null): boolean;
/** Estado por defecto: necesarias=true, estadísticas=false */
export declare function defaultPrefs(): CookiePrefs;
export declare function eraseCookie(name: string, path?: string, domains?: string[]): void;
export declare function cleanupAnalyticsCookies(): void;
//# sourceMappingURL=cookieStorage.d.ts.map