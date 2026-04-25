import { Locale, resources } from '@havenova/i18n';
import { PopupsTexts, PopupText, PopupCode } from '../alert/alert.types';

type PopupFallback = PopupText;
type PopupFallbackMap = { [K in PopupCode]-?: PopupFallback } & {
  button?: PopupsTexts['button'];
  a11y?: PopupsTexts['a11y'];
};

type LoadingMessagesFallback = typeof resources.de.loadings.message;

type I18nFallbackBundle = {
  fallbackButtons: {
    accept: string;
    continue: string;
    close: string;
    reload: string;
  };
  fallbackPopups: PopupFallbackMap;
  fallbackLoadingMessages: LoadingMessagesFallback;
  fallbackGlobalError: PopupFallback;
  fallbackRegisterSuccess: PopupFallback;
  fallbackTosNotAccepted: PopupFallback;
  fallbackEmailEmpty: PopupFallback;
  fallbackPasswordEmpty: PopupFallback;
  fallbackVerifyEmailSuccess: PopupFallback;
  fallbackVerifyEmailResent: PopupFallback;
  fallbackExpiredToken: PopupFallback;
  fallbackInvalidToken: PopupFallback;
  fallbackLoginSuccess: PopupFallback;
  fallbackLogoutSuccess: PopupFallback;
  fallbackLogoutConfirm: PopupFallback;
  fallbackLogoutError: PopupFallback;
  fallbackLoadingSubmit: PopupFallback;
  fallbackGlobalLoading: PopupFallback;
  fallbackForgotPasswordLoading: PopupFallback;
  fallbackForgotPasswordSuccess: PopupFallback;
};

const localeDefaults = {
  de: {
    buttons: {
      accept: 'Akzeptieren',
      continue: 'Weiter',
      close: 'Schließen',
      reload: 'Neu laden',
    },
    forgotPasswordLoading: {
      title: 'Passwort-Reset wird vorbereitet…',
      description: 'Bitte warten Sie einen Moment.',
      close: 'Schließen',
    },
  },
  en: {
    buttons: {
      accept: 'Accept',
      continue: 'Continue',
      close: 'Close',
      reload: 'Reload',
    },
    forgotPasswordLoading: {
      title: 'Preparing password reset…',
      description: 'Please wait a moment.',
      close: 'Close',
    },
  },
  es: {
    buttons: {
      accept: 'Aceptar',
      continue: 'Continuar',
      close: 'Cerrar',
      reload: 'Recargar',
    },
    forgotPasswordLoading: {
      title: 'Preparando el restablecimiento de la contrasena…',
      description: 'Espera un momento, por favor.',
      close: 'Cerrar',
    },
  },
} satisfies Record<
  Locale,
  {
    buttons: I18nFallbackBundle['fallbackButtons'];
    forgotPasswordLoading: PopupFallback;
  }
>;

const popupByCode = (
  popups: PopupFallbackMap,
  code: PopupCode | string,
  fallback: PopupFallback
): PopupFallback => {
  const value = (popups as unknown as Partial<Record<string, PopupFallback>>)[code];
  if (value && typeof value === 'object' && 'title' in value && 'description' in value) {
    return value as PopupFallback;
  }
  return fallback;
};

const resolveLocale = (language?: string): Locale =>
  language === 'en' || language === 'es' ? language : 'de';

const buildFallbackBundle = (locale: Locale): I18nFallbackBundle => {
  const texts = resources[locale] ?? resources.de;
  const popups = texts.popups as unknown as PopupFallbackMap;
  const defaultButtons = localeDefaults[locale].buttons;

  const fallbackButtons = {
    accept: popups.button?.accept ?? defaultButtons.accept,
    continue: popups.button?.continue ?? defaultButtons.continue,
    close: popups.button?.close ?? defaultButtons.close,
    reload: popups.button?.reload ?? defaultButtons.reload,
  };

  const fallbackGlobalError = popupByCode(popups, 'GLOBAL_INTERNAL_ERROR', {
    title:
      locale === 'en'
        ? 'Unexpected error'
        : locale === 'es'
          ? 'Error inesperado'
          : 'Unerwarteter Fehler',
    description:
      locale === 'en'
        ? 'An unexpected error occurred. Please try again later or contact support.'
        : locale === 'es'
          ? 'Ocurrio un error inesperado. Intentalo de nuevo mas tarde o contacta con soporte.'
          : 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.',
    close: fallbackButtons.close,
    confirm: fallbackButtons.reload,
  });

  return {
    fallbackButtons,
    fallbackPopups: popups,
    fallbackLoadingMessages: texts.loadings?.message ?? resources.de.loadings.message,
    fallbackGlobalError,
    fallbackRegisterSuccess: popupByCode(popups, 'USER_REGISTER_SUCCESS', fallbackGlobalError),
    fallbackTosNotAccepted: popupByCode(popups, 'USER_TOS_NOT_ACCEPTED', fallbackGlobalError),
    fallbackEmailEmpty: popupByCode(popups, 'USER_LOGIN_MISSING_EMAIL', fallbackGlobalError),
    fallbackPasswordEmpty: popupByCode(popups, 'USER_LOGIN_MISSING_PASSWORD', fallbackGlobalError),
    fallbackVerifyEmailSuccess: popupByCode(
      popups,
      'USER_VERIFY_EMAIL_SUCCESS',
      fallbackGlobalError
    ),
    fallbackVerifyEmailResent: popupByCode(
      popups,
      'USER_VERIFY_EMAIL_RESENT',
      fallbackGlobalError
    ),
    fallbackExpiredToken: popupByCode(popups, 'USER_VERIFY_EXPIRED_TOKEN', fallbackGlobalError),
    fallbackInvalidToken: popupByCode(popups, 'USER_VERIFY_INVALID_TOKEN', fallbackGlobalError),
    fallbackLoginSuccess: popupByCode(popups, 'USER_LOGIN_SUCCESS', fallbackGlobalError),
    fallbackLogoutSuccess: popupByCode(popups, 'LOGOUT_SUCCESS', fallbackGlobalError),
    fallbackLogoutConfirm: popupByCode(popups, 'LOGOUT_CONFIRM', fallbackGlobalError),
    fallbackLogoutError: popupByCode(popups, 'LOGOUT_FAILED', fallbackGlobalError),
    fallbackLoadingSubmit: popupByCode(popups, 'REGISTER_LOADING_SUBMIT', fallbackGlobalError),
    fallbackGlobalLoading: popupByCode(popups, 'GLOBAL_LOADING', fallbackGlobalError),
    fallbackForgotPasswordLoading: localeDefaults[locale].forgotPasswordLoading,
    fallbackForgotPasswordSuccess: popupByCode(
      popups,
      'USER_FORGOT_PASSWORD_EMAIL_SENT',
      fallbackGlobalError
    ),
  };
};

const fallbackBundles = {
  de: buildFallbackBundle('de'),
  en: buildFallbackBundle('en'),
  es: buildFallbackBundle('es'),
} satisfies Record<Locale, I18nFallbackBundle>;

export const getI18nFallbacks = (language?: string): I18nFallbackBundle =>
  fallbackBundles[resolveLocale(language)];

// Legacy default exports remain DE-only for consumers that have not yet been migrated.
export const fallbackButtons = fallbackBundles.de.fallbackButtons;
export const fallbackPopups = fallbackBundles.de.fallbackPopups;
export const fallbackLoadingMessages = fallbackBundles.de.fallbackLoadingMessages;
export const fallbackGlobalError = fallbackBundles.de.fallbackGlobalError;
export const fallbackRegisterSuccess = fallbackBundles.de.fallbackRegisterSuccess;
export const fallbackTosNotAccepted = fallbackBundles.de.fallbackTosNotAccepted;
export const fallbackEmailEmpty = fallbackBundles.de.fallbackEmailEmpty;
export const fallbackPasswordEmpty = fallbackBundles.de.fallbackPasswordEmpty;
export const fallbackVerifyEmailSuccess = fallbackBundles.de.fallbackVerifyEmailSuccess;
export const fallbackVerifyEmailResent = fallbackBundles.de.fallbackVerifyEmailResent;
export const fallbackExpiredToken = fallbackBundles.de.fallbackExpiredToken;
export const fallbackInvalidToken = fallbackBundles.de.fallbackInvalidToken;
export const fallbackLoginSuccess = fallbackBundles.de.fallbackLoginSuccess;
export const fallbackLogoutSuccess = fallbackBundles.de.fallbackLogoutSuccess;
export const fallbackLogoutConfirm = fallbackBundles.de.fallbackLogoutConfirm;
export const fallbackLogoutError = fallbackBundles.de.fallbackLogoutError;
export const fallbackLoadingSubmit = fallbackBundles.de.fallbackLoadingSubmit;
export const fallbackGlobalLoading = fallbackBundles.de.fallbackGlobalLoading;
export const fallbackForgotPasswordLoading = fallbackBundles.de.fallbackForgotPasswordLoading;
export const fallbackForgotPasswordSuccess = fallbackBundles.de.fallbackForgotPasswordSuccess;
