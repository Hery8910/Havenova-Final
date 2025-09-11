// cookies/utils/cookieStorage.ts
'use client';

import { COOKIE_NAME, COOKIE_POLICY_VERSION, CookiePrefs } from '../../types/cookies';

/** Serializa preferencias en un valor compacto de cookie.
 * Ej: v=1&ts=2025-09-02T10%3A00%3A00.000Z&nec=1&stat=0
 */
export function serializeCookiePrefs(prefs: CookiePrefs): string {
  const nec = prefs.consent.necessary ? 1 : 0;
  const stat = prefs.consent.statistics ? 1 : 0;
  const safeTs = encodeURIComponent(prefs.ts);
  return `v=${prefs.v}&ts=${safeTs}&nec=${nec}&stat=${stat}`;
}

/** Parsea el valor de cookie a objeto */
export function parseCookiePrefs(value?: string | null): CookiePrefs | null {
  if (!value) return null;
  try {
    const parts = value.split('&').reduce((acc: Record<string, string>, pair) => {
      const [k, v] = pair.split('=');
      if (k) acc[k] = decodeURIComponent(v ?? '');
      return acc;
    }, {});
    const v = Number(parts['v']);
    const ts = parts['ts'] ?? new Date().toISOString();
    const nec = parts['nec'] === '1';
    const stat = parts['stat'] === '1';
    if (!v) return null;
    return {
      v,
      ts,
      consent: { necessary: nec, statistics: stat },
    };
  } catch {
    return null;
  }
}

/* ---------------- Browser cookie helpers ---------------- */

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const c of cookies) {
    const [k, ...rest] = c.split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

export function setCookie(name: string, value: string, days = 180) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  // En http://localhost no uses Secure (bloquearía la cookie)
  const isSecure = typeof location !== 'undefined' && location.protocol === 'https:';
  document.cookie = `${name}=${value}; Path=/; SameSite=Lax; Expires=${expires};${
    isSecure ? ' Secure;' : ''
  }`;
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
}

/* ---- Persistencia combinada: cookie + localStorage ---- */

const LS_KEY = 'havenova_cookie_prefs_v1';

export function getPrefsFromLocalStorage(): CookiePrefs | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CookiePrefs;
  } catch {
    return null;
  }
}

export function savePrefsToLocalStorage(prefs: CookiePrefs) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(LS_KEY, JSON.stringify(prefs));
}

export function loadCookiePrefs(): CookiePrefs | null {
  const raw = getCookie(COOKIE_NAME);
  return parseCookiePrefs(raw);
}

export function saveCookiePrefs(prefs: CookiePrefs) {
  setCookie(COOKIE_NAME, serializeCookiePrefs(prefs));
}

/** Re-pregunta si cambia la versión de política */
export function shouldRePrompt(existing: CookiePrefs | null): boolean {
  if (!existing) return true;
  return existing.v !== COOKIE_POLICY_VERSION;
}

/** Estado por defecto: necesarias=true, estadísticas=false */
export function defaultPrefs(): CookiePrefs {
  return {
    v: COOKIE_POLICY_VERSION,
    ts: new Date().toISOString(),
    consent: {
      necessary: true,
      statistics: false,
    },
  };
}

export function eraseCookie(name: string, path = '/', domains?: string[]) {
  if (typeof document === 'undefined') return;
  const base = `${name}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=${path};`;
  const candidates =
    domains && domains.length > 0 ? domains : [location.hostname, `.${location.hostname}`];

  // Borra en ambos dominios (ej. ejemplo.com y .ejemplo.com)
  for (const d of candidates) {
    document.cookie = `${base} Domain=${d}; SameSite=Lax;`;
    // También sin Domain explícito (algunas cookies se fijan sin domain)
    document.cookie = `${base} SameSite=Lax;`;
    // Si estás en https, puedes repetir con Secure (por si se fijó así)
    if (location.protocol === 'https:') {
      document.cookie = `${base} Domain=${d}; SameSite=Lax; Secure;`;
      document.cookie = `${base} SameSite=Lax; Secure;`;
    }
  }
}

export function cleanupAnalyticsCookies() {
  if (typeof document === 'undefined') return;
  const all = document.cookie ? document.cookie.split('; ') : [];
  const gaLike = all
    .map((c) => c.split('=')[0])
    .filter(
      (name) => name === '_ga' || name.startsWith('_ga_') || name === '_gid' || name === '_gat'
    );

  for (const name of gaLike) {
    eraseCookie(name, '/');
  }
}
