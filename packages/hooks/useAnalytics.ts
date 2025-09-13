// hooks/useAnalytics.ts
'use client';

import { useCallback, useMemo } from 'react';
import { useCookies } from '../contexts/cookies/CookiesContext';
import { ANALYTICS_EVENTS, AnalyticsEventName, AnalyticsParams } from '../utils/analyticsEvents';

// Pequeño guard para saber si gtag está listo
function isGtagReady(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).gtag === 'function';
}

// Reglas de validación runtime (solo parámetors esenciales)
const REQUIRED_PARAMS: Partial<Record<AnalyticsEventName, string[]>> = {
  [ANALYTICS_EVENTS.LANGUAGE_CHANGE]: ['language'],
  [ANALYTICS_EVENTS.THEME_CHANGE]: ['theme'],

  [ANALYTICS_EVENTS.SERVICE_CATEGORY_SELECTED]: ['category'],
  [ANALYTICS_EVENTS.SERVICE_ITEM_SELECTED]: ['category', 'item'],
  [ANALYTICS_EVENTS.SERVICE_STEP_VIEW]: ['step'],
  [ANALYTICS_EVENTS.SERVICE_FORM_STARTED]: ['service_type'],
  [ANALYTICS_EVENTS.SERVICE_FORM_COMPLETED]: ['service_type'],

  [ANALYTICS_EVENTS.SERVICE_REQUEST_ADDED]: ['service_type'],
  [ANALYTICS_EVENTS.SERVICE_REQUEST_UPDATED]: ['service_type'],
  [ANALYTICS_EVENTS.SERVICE_REQUEST_REMOVED]: ['service_type'],
  [ANALYTICS_EVENTS.CART_VIEWED]: ['items_count'],

  [ANALYTICS_EVENTS.CHECKOUT_STARTED]: ['items_count'],
  [ANALYTICS_EVENTS.CHECKOUT_STEP_VIEW]: ['step'],
  [ANALYTICS_EVENTS.CHECKOUT_ERROR]: ['error'],
  [ANALYTICS_EVENTS.CHECKOUT_COMPLETED]: ['items_count', 'value', 'currency'],

  [ANALYTICS_EVENTS.USER_PROFILE_UPDATED]: ['field'],
  [ANALYTICS_EVENTS.API_ERROR]: ['endpoint'],
};

// Valida en dev: faltantes, tipos básicos
function devValidate(event: AnalyticsEventName, params?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') return;

  const req = REQUIRED_PARAMS[event];
  if (!req || !req.length) return;

  const missing = req.filter((k) => params == null || !(k in params));
  if (missing.length) {
    console.warn(`[analytics] "${event}" missing required params: ${missing.join(', ')}`, {
      params,
    });
  }
}

export function useAnalytics() {
  const { prefs } = useCookies();
  const canTrack = !!prefs?.consent?.statistics;

  // Envoltorio seguro a gtag
  const emit = useCallback((cmd: string, ...args: any[]) => {
    if (!isGtagReady()) return;
    (window as any).gtag(cmd, ...args);
  }, []);

  /**
   * trackEvent tipado:
   *  - Opción 1 (recomendada): usa AnalyticsEventName + objeto libre (validación runtime).
   *  - Opción 2 (estricta): pasa un objeto del tipo unión AnalyticsParams (ts te ayuda).
   */
  const trackEvent = useCallback(
    (eventOrPayload: AnalyticsEventName | AnalyticsParams, paramsMaybe?: Record<string, any>) => {
      if (!canTrack) return; // sin consentimiento → noop
      if (!isGtagReady()) return; // GA no listo → noop

      let eventName: AnalyticsEventName;
      let params: Record<string, any> | undefined;

      if (typeof eventOrPayload === 'string') {
        // Forma (eventName, params)
        eventName = eventOrPayload;
        params = paramsMaybe ?? {};
      } else {
        // Forma (payload tipado): { event, ...params }
        eventName = eventOrPayload.event;
        params = { ...eventOrPayload };
        delete (params as any).event;
      }

      devValidate(eventName, params);
      emit('event', eventName, params || {});
    },
    [canTrack, emit]
  );

  /**
   * trackPageView:
   *  - GAScript ya está enviando pageviews con gtag('config', ...) en cambios de ruta.
   *  - Esto es por si quieres forzar un page_view manual (modal, virtual page, etc.)
   */
  const trackPageView = useCallback(
    (path: string, title?: string) => {
      if (!canTrack) return;
      if (!isGtagReady()) return;
      emit('event', ANALYTICS_EVENTS.PAGE_VIEW, { page_path: path, page_title: title });
    },
    [canTrack, emit]
  );

  const isReady = useMemo(() => canTrack && isGtagReady(), [canTrack]);

  return { canTrack, isReady, trackEvent, trackPageView };
}
