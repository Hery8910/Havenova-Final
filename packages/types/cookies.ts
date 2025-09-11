// types/cookies.ts
export type CookieCategory = 'necessary' | 'statistics';

export interface CookieConsent {
  /** Técnicamente siempre true, no se puede desactivar */
  necessary: boolean;
  /** Para analítica (p. ej., Google Analytics en el futuro) */
  statistics: boolean;
}

export interface CookiePrefs {
  /** Versión de tu política de cookies/categorías */
  v: number;
  /** Timestamp ISO cuando el usuario guardó/cambió su elección */
  ts: string;
  /** Estado de consentimiento por categoría */
  consent: CookieConsent;
}

export const COOKIE_NAME = 'hn_cprefs';
/** Incrementa cuando cambies textos/categorías para re-preguntar */
export const COOKIE_POLICY_VERSION = 1;
