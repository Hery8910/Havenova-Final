// utils/analyticsEvents.ts
// Catálogo centralizado de eventos GA4 para Havenova
// Usa snake_case y mantén consistencia en parámetros.

export const ANALYTICS_EVENTS = {
  /* Navegación / UI */
  PAGE_VIEW: 'page_view', // (lo manda GAScript automáticamente con gtag('config'))

  LANGUAGE_CHANGE: 'language_change',
  THEME_CHANGE: 'theme_change',

  /* Descubrimiento del servicio */
  SERVICE_CATEGORY_SELECTED: 'service_category_selected', // p. ej., bedroom/kitchen
  SERVICE_ITEM_SELECTED: 'service_item_selected', // p. ej., wardrobe/table
  SERVICE_STEP_VIEW: 'service_step_view', // útil para embudos multi-step

  /* Formulario de servicio (p. ej., montaje de muebles) */
  SERVICE_FORM_STARTED: 'service_form_started',
  SERVICE_FORM_FIELD_CHANGED: 'service_form_field_changed', // opcional si quieres granularidad
  SERVICE_FORM_VALIDATION_ERROR: 'form_validation_error', // reutilizable
  SERVICE_FORM_COMPLETED: 'service_form_completed',

  /* Carrito / Requests */
  SERVICE_REQUEST_ADDED: 'service_request_added',
  SERVICE_REQUEST_UPDATED: 'service_request_updated',
  SERVICE_REQUEST_REMOVED: 'service_request_removed',
  CART_VIEWED: 'cart_viewed',

  /* Checkout */
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_STEP_VIEW: 'checkout_step_view', // si tu checkout tiene pasos
  CHECKOUT_ERROR: 'checkout_error',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_CANCELLED: 'checkout_cancelled',

  /* Cuenta de usuario */
  USER_REGISTERED: 'user_registered',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  USER_PROFILE_UPDATED: 'user_profile_updated',

  /* Sistema / App */
  API_ERROR: 'api_error', // útil para monitoreo técnico
} as const;

// Tipo útil para autocompletado en trackEvent()
export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

// Parámetros recomendados por tipo de evento (opcional, ayuda a estandarizar)
export type AnalyticsParams =
  | { event: typeof ANALYTICS_EVENTS.LANGUAGE_CHANGE; language: 'de' | 'en' | 'es' }
  | { event: typeof ANALYTICS_EVENTS.THEME_CHANGE; theme: 'light' | 'dark' }
  | { event: typeof ANALYTICS_EVENTS.SERVICE_CATEGORY_SELECTED; category: string; step?: number }
  | {
      event: typeof ANALYTICS_EVENTS.SERVICE_ITEM_SELECTED;
      category: string;
      item: string;
      step?: number;
    }
  | { event: typeof ANALYTICS_EVENTS.SERVICE_STEP_VIEW; step: number; title?: string }
  | { event: typeof ANALYTICS_EVENTS.SERVICE_FORM_STARTED; service_type: string }
  | {
      event: typeof ANALYTICS_EVENTS.SERVICE_FORM_FIELD_CHANGED;
      form: string;
      field: string;
      value?: string | number;
    }
  | {
      event: typeof ANALYTICS_EVENTS.SERVICE_FORM_VALIDATION_ERROR;
      form: string;
      field?: string;
      error: string;
    }
  | {
      event: typeof ANALYTICS_EVENTS.SERVICE_FORM_COMPLETED;
      service_type: string;
      category?: string;
      item?: string;
      quantity?: number;
      width?: number | string;
      height?: number | string;
      depth?: number | string;
    }
  | {
      event:
        | typeof ANALYTICS_EVENTS.SERVICE_REQUEST_ADDED
        | typeof ANALYTICS_EVENTS.SERVICE_REQUEST_UPDATED
        | typeof ANALYTICS_EVENTS.SERVICE_REQUEST_REMOVED;
      service_type: string;
      category?: string;
      item?: string;
      quantity?: number;
      id?: string;
      value?: number; // si calculas precio
      currency?: 'EUR';
    }
  | {
      event: typeof ANALYTICS_EVENTS.CART_VIEWED;
      items_count: number;
      value?: number;
      currency?: 'EUR';
    }
  | {
      event: typeof ANALYTICS_EVENTS.CHECKOUT_STARTED;
      items_count: number;
      value?: number;
      currency?: 'EUR';
    }
  | { event: typeof ANALYTICS_EVENTS.CHECKOUT_STEP_VIEW; step: number; title?: string }
  | { event: typeof ANALYTICS_EVENTS.CHECKOUT_ERROR; step?: string; error: string }
  | { event: typeof ANALYTICS_EVENTS.CHECKOUT_CANCELLED; reason?: string }
  | {
      event: typeof ANALYTICS_EVENTS.CHECKOUT_COMPLETED;
      items_count: number;
      value: number;
      currency: 'EUR';
    }
  | { event: typeof ANALYTICS_EVENTS.USER_REGISTERED; method?: 'email' | 'google' }
  | { event: typeof ANALYTICS_EVENTS.USER_LOGGED_IN; method?: 'email' | 'google' }
  | { event: typeof ANALYTICS_EVENTS.USER_LOGGED_OUT }
  | { event: typeof ANALYTICS_EVENTS.USER_PROFILE_UPDATED; field: string }
  | {
      event: typeof ANALYTICS_EVENTS.API_ERROR;
      endpoint: string;
      status?: number;
      message?: string;
    };

// Helper opcional: crea el payload con type-safe (si te interesa)
export function makeEvent<T extends AnalyticsParams['event']>(
  event: T,
  params: Omit<Extract<AnalyticsParams, { event: T }>, 'event'>
) {
  return { event, ...params } as Extract<AnalyticsParams, { event: T }>;
}
