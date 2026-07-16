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
    goToHome: string;
    goToLogin: string;
    goToRegister: string;
    openVerification: string;
    resetPassword: string;
    requestNewLink: string;
    tryAgain: string;
    continueBrowsing: string;
    logOut: string;
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
  fallbackForgotPasswordSuccess: PopupFallback;
};

const localeDefaults = {
  de: {
    buttons: {
      accept: 'Akzeptieren',
      continue: 'Weiter',
      close: 'Schließen',
      reload: 'Neu laden',
      goToHome: 'Zur Startseite',
      goToLogin: 'Zum Login',
      goToRegister: 'Zur Registrierung',
      openVerification: 'Verifizierung öffnen',
      resetPassword: 'Passwort zurücksetzen',
      requestNewLink: 'Neuen Link anfordern',
      tryAgain: 'Erneut versuchen',
      continueBrowsing: 'Weiter stöbern',
      logOut: 'Abmelden',
    },
  },
  en: {
    buttons: {
      accept: 'Accept',
      continue: 'Continue',
      close: 'Close',
      reload: 'Reload',
      goToHome: 'Go to home',
      goToLogin: 'Go to login',
      goToRegister: 'Go to register',
      openVerification: 'Open verification',
      resetPassword: 'Reset password',
      requestNewLink: 'Request new link',
      tryAgain: 'Try again',
      continueBrowsing: 'Continue browsing',
      logOut: 'Log out',
    },
  },
  es: {
    buttons: {
      accept: 'Aceptar',
      continue: 'Continuar',
      close: 'Cerrar',
      reload: 'Recargar',
      goToHome: 'Ir al inicio',
      goToLogin: 'Ir al acceso',
      goToRegister: 'Ir al registro',
      openVerification: 'Abrir verificación',
      resetPassword: 'Restablecer contraseña',
      requestNewLink: 'Solicitar enlace nuevo',
      tryAgain: 'Intentar de nuevo',
      continueBrowsing: 'Seguir navegando',
      logOut: 'Cerrar sesión',
    },
  },
} satisfies Record<
  Locale,
  {
    buttons: I18nFallbackBundle['fallbackButtons'];
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
    goToHome: popups.button?.goToHome ?? defaultButtons.goToHome,
    goToLogin: popups.button?.goToLogin ?? defaultButtons.goToLogin,
    goToRegister: popups.button?.goToRegister ?? defaultButtons.goToRegister,
    openVerification: popups.button?.openVerification ?? defaultButtons.openVerification,
    resetPassword: popups.button?.resetPassword ?? defaultButtons.resetPassword,
    requestNewLink: popups.button?.requestNewLink ?? defaultButtons.requestNewLink,
    tryAgain: popups.button?.tryAgain ?? defaultButtons.tryAgain,
    continueBrowsing: popups.button?.continueBrowsing ?? defaultButtons.continueBrowsing,
    logOut: popups.button?.logOut ?? defaultButtons.logOut,
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
    fallbackExpiredToken: popupByCode(
      popups,
      'AUTH_VERIFY_EMAIL_TOKEN_EXPIRED',
      fallbackGlobalError
    ),
    fallbackInvalidToken: popupByCode(
      popups,
      'AUTH_VERIFY_EMAIL_TOKEN_INVALID',
      fallbackGlobalError
    ),
    fallbackLoginSuccess: popupByCode(popups, 'USER_LOGIN_SUCCESS', fallbackGlobalError),
    fallbackLogoutSuccess: popupByCode(popups, 'LOGOUT_SUCCESS', fallbackGlobalError),
    fallbackLogoutConfirm: popupByCode(popups, 'LOGOUT_CONFIRM', fallbackGlobalError),
    fallbackLogoutError: popupByCode(popups, 'LOGOUT_FAILED', fallbackGlobalError),
    fallbackLoadingSubmit: popupByCode(popups, 'REGISTER_LOADING_SUBMIT', fallbackGlobalError),
    fallbackGlobalLoading: popupByCode(popups, 'GLOBAL_LOADING', fallbackGlobalError),
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
