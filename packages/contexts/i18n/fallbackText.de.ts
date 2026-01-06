type PopupFallback = {
  title: string;
  description: string;
  close?: string;
  confirm?: string;
};

export const fallbackButtons = {
  accept: 'Akzeptieren',
  continue: 'Weiter',
  close: 'Schließen',
  reload: 'Neu laden',
};

const withClose = (title: string, description: string): PopupFallback => ({
  title,
  description,
  close: fallbackButtons.close,
});

const withConfirmAndClose = (
  title: string,
  description: string,
  confirm = fallbackButtons.continue,
  close = fallbackButtons.close
): PopupFallback => ({
  title,
  description,
  confirm,
  close,
});

export const fallbackPopups: Record<string, PopupFallback> = {
  GLOBAL_INTERNAL_ERROR: withClose(
    'Unerwarteter Fehler',
    'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.'
  ),
  ACCESS_TOKEN_EXPIRED: withClose(
    'Sitzung abgelaufen',
    'Ihr Zugriffstoken ist abgelaufen. Bitte melden Sie sich erneut an.'
  ),
  NO_ACCESS_TOKEN: withClose(
    'Zugriffstoken fehlt',
    'Es wurde kein gültiges Zugriffstoken gefunden. Bitte melden Sie sich erneut an.'
  ),
  AUTH_NOT_LOGGED_IN: withClose(
    'Anmeldung erforderlich',
    'Sie müssen angemeldet sein, um diese Aktion durchzuführen.'
  ),
  AUTH_BLOCKED: withClose(
    'Konto gesperrt',
    'Ihr Zugriff ist gesperrt. Bitte wenden Sie sich an den Support.'
  ),
  AUTH_CLIENT_NOT_FOUND: withClose(
    'Client nicht gefunden',
    'Ihr Konto konnte keinem Client zugeordnet werden.'
  ),
  AUTH_USER_NOT_FOUND: withClose(
    'Benutzer nicht gefunden',
    'Es konnte kein passender Benutzer gefunden werden.'
  ),

  CLIENT_CREATE_SUCCESS: withClose(
    'Kunde erfolgreich erstellt',
    'Der Kunde wurde erfolgreich im System angelegt.'
  ),
  CLIENT_CREATE_DOMAIN_EXISTS: withClose(
    'Domain bereits vergeben',
    'Ein Kunde mit dieser Domain existiert bereits.'
  ),
  CLIENT_CREATE_FAILED: withClose(
    'Fehler beim Erstellen des Kunden',
    'Beim Erstellen des Kunden ist ein unerwarteter Fehler aufgetreten.'
  ),
  CLIENT_CREATED: withClose(
    'Kunde erfolgreich erstellt',
    'Der Kunde wurde erfolgreich im System angelegt.'
  ),
  CLIENT_FETCH_SUCCESS: withClose(
    'Client erfolgreich geladen',
    'Die Client-Daten wurden erfolgreich abgerufen.'
  ),
  CLIENT_FETCH_NOT_FOUND: withClose(
    'Client nicht gefunden',
    'Der angeforderte Client konnte nicht gefunden werden.'
  ),
  CLIENT_FETCH_FAILED: withClose(
    'Fehler beim Laden des Clients',
    'Beim Abrufen des Clients ist ein unerwarteter Fehler aufgetreten.'
  ),
  CLIENT_FETCH_DASHBOARD_SUCCESS: withClose(
    'Client-Dashboard erfolgreich geladen',
    'Die Dashboard-Daten des Clients wurden erfolgreich abgerufen.'
  ),
  CLIENT_PUBLIC_FETCH_SUCCESS: withClose(
    'Client geladen',
    'Öffentliche Client-Daten wurden erfolgreich abgerufen.'
  ),
  CLIENT_UPDATE_SUCCESS: withClose(
    'Client erfolgreich aktualisiert',
    'Die Client-Daten wurden erfolgreich aktualisiert.'
  ),
  CLIENT_UPDATE_FAILED: withClose(
    'Fehler beim Aktualisieren des Clients',
    'Beim Aktualisieren des Clients ist ein unerwarteter Fehler aufgetreten.'
  ),
  CLIENT_MISSING_CLIENT_ID: withClose(
    'Client-ID fehlt',
    'Für diese Registrierung wird eine gültige Client-ID benötigt.'
  ),
  CLIENT_NOT_FOUND: withClose('Client nicht gefunden', 'Der angegebene Client existiert nicht.'),

  USER_REGISTER_SUCCESS: withClose(
    'Registrierung erfolgreich',
    'Wir haben Ihnen eine E-Mail zur Bestätigung Ihrer Adresse gesendet. Bitte überprüfen Sie Ihren Posteingang.'
  ),
  USER_REGISTER_ALREADY_REGISTERED: withClose(
    'Account bereits aktiv',
    'Sie haben bereits ein aktives Konto. Bitte melden Sie sich an.'
  ),
  USER_REGISTER_NEEDS_CORRECT_PASSWORD: withClose(
    'Passwort erforderlich',
    'Dieser Account existiert bereits. Bitte geben Sie Ihr aktuelles Passwort ein oder setzen Sie es zurück.'
  ),
  USER_BLOCKED: withClose(
    'Zugriff verweigert',
    'Dieser Account ist gesperrt und kann nicht verwendet werden.'
  ),
  USER_TOS_NOT_ACCEPTED: withClose(
    'AGB nicht akzeptiert',
    'Bitte akzeptieren Sie die AGB und die Datenschutzerklärung, um fortzufahren.'
  ),
  USER_LOGIN_MISSING_EMAIL: withClose(
    'E-Mail erforderlich',
    'Bitte geben Sie Ihre E-Mail-Adresse ein, um fortzufahren.'
  ),
  USER_LOGIN_MISSING_PASSWORD: withClose(
    'Passwort erforderlich',
    'Bitte geben Sie Ihr Passwort ein, um fortzufahren.'
  ),
  USER_LOGIN_INVALID_PASSWORD: withClose(
    'Ungültige Anmeldedaten',
    'Das Passwort ist falsch. Bitte versuchen Sie es erneut.'
  ),
  USER_LOGIN_USER_NOT_FOUND: withClose(
    'Benutzer nicht gefunden',
    'Es wurde kein Konto mit diesen Zugangsdaten gefunden.'
  ),
  USER_EMAIL_ALREADY_REGISTERED: withClose(
    'E-Mail bereits registriert',
    'Diese E-Mail ist bereits registriert. Bitte melden Sie sich an, um fortzufahren.'
  ),
  USER_VERIFY_EMAIL_SUCCESS: withClose(
    'E-Mail erfolgreich bestätigt',
    'Ihre E-Mail-Adresse wurde erfolgreich verifiziert.'
  ),
  USER_VERIFY_EMAIL_RESENDED: withClose(
    'Bestätigungs-E-Mail erneut gesendet',
    'Wir haben Ihnen eine neue Bestätigungs-E-Mail gesendet. Bitte überprüfen Sie erneut Ihren Posteingang.'
  ),
  USER_VERIFY_EMAIL_RESENT: withClose(
    'Bestätigungs-E-Mail erneut gesendet',
    'Wir haben Ihnen eine neue Bestätigungs-E-Mail gesendet.'
  ),
  USER_VERIFY_MISSING_TOKEN: withClose(
    'Ungültiger Bestätigungslink',
    'Der Verifizierungslink ist ungültig oder fehlt.'
  ),
  USER_VERIFY_EMAIL_VERIFIED: withClose(
    'E-Mail bereits bestätigt',
    'Ihre E-Mail war bereits verifiziert. Sie können fortfahren.'
  ),
  USER_FORGOT_PASSWORD_EMAIL_SENDED: withClose(
    'Reset-Link gesendet',
    'Wir haben dir einen Link zum Zurücksetzen deines Passworts geschickt. Bitte prüfe dein Postfach.'
  ),
  USER_FORGOT_PASSWORD_EMAIL_SENT: withClose(
    'Reset-Link gesendet',
    'Wir haben dir einen Link zum Zurücksetzen deines Passworts geschickt. Bitte prüfe dein Postfach.'
  ),
  USER_RESET_PASSWORD_INVALID_TOKEN: withClose(
    'Ungültiger Reset-Link',
    'Der Passwort-Reset-Link ist ungültig. Bitte fordern Sie einen neuen an.'
  ),
  USER_RESET_PASSWORD_TOKEN_EXPIRED: withClose(
    'Reset-Link abgelaufen',
    'Ihr Passwort-Reset-Link ist abgelaufen. Bitte fordern Sie einen neuen an.'
  ),
  USER_RESET_PASSWORD_SUCCESS: withClose(
    'Passwort zurückgesetzt',
    'Ihr Passwort wurde aktualisiert. Bitte melden Sie sich mit dem neuen Passwort an.'
  ),
  USER_UPDATE_PASSWORD_SUCCESS: withClose(
    'Passwort aktualisiert',
    'Ihr Passwort wurde erfolgreich aktualisiert.'
  ),
  USER_LOGIN_EMAIL_NOT_VERIFIED: withClose(
    'E-Mail nicht bestätigt',
    'Bitte bestätigen Sie Ihre E-Mail, um fortzufahren. Prüfen Sie Ihr Postfach.'
  ),
  USER_LOGIN_SUCCESS: withClose('Login erfolgreich', 'Sie wurden erfolgreich eingeloggt.'),
  USER_NEED_TO_LOGIN: withConfirmAndClose(
    'Anmeldung erforderlich',
    'Bitte melde dich an, um diese Seite aufzurufen oder Anfragen zu senden. Du kannst weiterstöbern oder direkt zum Login gehen.',
    'Zum Login',
    'Weiter stöbern'
  ),

  USER_NOT_FOUND: withClose(
    'Benutzer nicht gefunden',
    'Der zugehörige Benutzer konnte nicht gefunden werden.'
  ),
  VALIDATION_ERROR: withClose(
    'Validierungsfehler',
    'Bitte prüfen Sie die eingegebenen Daten und versuchen Sie es erneut.'
  ),

  LOGOUT_SUCCESS: withClose('Abmeldung erfolgreich', 'Sie wurden erfolgreich abgemeldet.'),
  LOGOUT_FAILED: withClose(
    'Abmeldung fehlgeschlagen',
    'Die Abmeldung konnte nicht durchgeführt werden. Bitte versuchen Sie es erneut.'
  ),
  USER_LOGOUT_SUCCESS: withClose('Abmeldung erfolgreich', 'Sie wurden erfolgreich abgemeldet.'),
  USER_LOGOUT_ALL_SUCCESS: withClose(
    'Abmeldung auf allen Geräten',
    'Sie wurden auf allen Geräten abgemeldet.'
  ),
  AUTH_GET_SUCCESS: withClose('Sitzung geladen', 'Ihre Sitzungsinformationen wurden geladen.'),

  USER_CLIENT_NOT_FOUND: withClose(
    'Zugehörigkeit nicht gefunden',
    'Der Benutzer ist diesem Client nicht zugeordnet.'
  ),
  USER_CLIENT_BLOCKED: withClose('Zugriff blockiert', 'Ihr Konto ist für diesen Client gesperrt.'),
  USER_CLIENT_COOKIES_UPDATE_SUCCESS: withClose(
    'Cookie-Einstellungen aktualisiert',
    'Ihre Cookie-Einstellungen wurden erfolgreich gespeichert.'
  ),

  USER_SESSION_EXPIRED: withConfirmAndClose(
    'Sitzung abgelaufen',
    'Ihre Sitzung ist abgelaufen. Sie können weiterstöbern oder sich erneut anmelden.',
    'Zum Login',
    'Weiter stöbern'
  ),
  REFRESH_TOKEN_MISSING: withClose(
    'Erneute Anmeldung erforderlich',
    'Ihre Sitzung ist nicht mehr gültig. Bitte melden Sie sich erneut an.'
  ),
  REFRESH_TOKEN_INVALIDATED: withClose(
    'Sitzung ungültig',
    'Ihre Sitzung wurde ungültig. Bitte melden Sie sich erneut an.'
  ),
  REFRESH_TOKEN_EXPIRED: withClose(
    'Sitzung abgelaufen',
    'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
  ),
  ACCESS_TOKEN_REFRESHED: withClose(
    'Sitzung erneuert',
    'Ihr Zugriffstoken wurde erfolgreich erneuert.'
  ),

  MAGIC_TOKEN_EXPIRED: withClose(
    'Login-Link abgelaufen',
    'Der Magic-Login-Link ist abgelaufen. Bitte fordern Sie einen neuen an.'
  ),
  MAGIC_TOKEN_INVALID: withClose(
    'Ungültiger Login-Link',
    'Der Magic-Login-Token ist ungültig oder beschädigt.'
  ),
  MAGIC_LOGIN_SUCCESS: withClose('Login erfolgreich', 'Sie wurden erfolgreich eingeloggt.'),

  USER_VERIFY_EXPIRED_TOKEN: withClose(
    'Bestätigungslink abgelaufen',
    'Ihr Bestätigungslink ist abgelaufen. Bitte fordern Sie einen neuen an.'
  ),
  USER_VERIFY_INVALID_TOKEN: withClose(
    'Ungültiger Bestätigungslink',
    'Der Bestätigungslink ist ungültig oder beschädigt.'
  ),
  OBJECT_ADDRESS_EXISTS: withClose(
    'Adresse bereits vergeben',
    'Ein Objekt mit dieser Adresse existiert bereits.'
  ),
  OBJECT_NUMBER_EXISTS: withClose(
    'Objektnummer bereits vergeben',
    'Ein Objekt mit dieser Nummer existiert bereits.'
  ),
  OBJECT_NOT_FOUND: withClose(
    'Objekt nicht gefunden',
    'Das angeforderte Objekt konnte nicht gefunden werden.'
  ),
  PROPERTY_MANAGER_EMAIL_EXISTS: withClose(
    'E-Mail bereits vergeben',
    'Ein Manager mit dieser E-Mail-Adresse existiert bereits.'
  ),
  PROPERTY_MANAGER_EXISTS: withClose(
    'Manager existiert bereits',
    'Ein Immobilienverwalter mit diesen Angaben existiert bereits.'
  ),
  PROPERTY_MANAGER_NOT_FOUND: withClose(
    'Manager nicht gefunden',
    'Der angeforderte Immobilienverwalter konnte nicht gefunden werden.'
  ),
  WORKER_ALREADY_EXISTS: withClose(
    'Mitarbeiter existiert bereits',
    'Ein Mitarbeiter mit diesen Angaben existiert bereits.'
  ),
  WORKER_NOT_FOUND: withClose(
    'Mitarbeiter nicht gefunden',
    'Der angeforderte Mitarbeiter konnte nicht gefunden werden.'
  ),
  OBJECT_CREATED: withClose('Objekt erstellt', 'Das Objekt wurde erfolgreich erstellt.'),
  OBJECT_FOUND: withClose('Objekt geladen', 'Die Objektdetails wurden erfolgreich geladen.'),
  OBJECT_LIST: withClose('Objekte geladen', 'Die Objektliste wurde erfolgreich geladen.'),
  OBJECT_UPDATED: withClose('Objekt aktualisiert', 'Das Objekt wurde erfolgreich aktualisiert.'),
  PROPERTY_MANAGER_CREATED: withClose(
    'Manager erstellt',
    'Der Immobilienverwalter wurde erfolgreich erstellt.'
  ),
  PROPERTY_MANAGER_FOUND: withClose(
    'Manager geladen',
    'Die Managerdetails wurden erfolgreich geladen.'
  ),
  PROPERTY_MANAGER_LIST: withClose(
    'Manager geladen',
    'Die Managerliste wurde erfolgreich geladen.'
  ),
  PROPERTY_MANAGER_UPDATED: withClose(
    'Manager aktualisiert',
    'Der Immobilienverwalter wurde erfolgreich aktualisiert.'
  ),
  WORKER_CREATED: withClose('Mitarbeiter erstellt', 'Der Mitarbeiter wurde erfolgreich erstellt.'),
  WORKER_DELETED: withClose('Mitarbeiter gelöscht', 'Der Mitarbeiter wurde entfernt.'),
  WORKER_FOUND: withClose('Mitarbeiter geladen', 'Die Mitarbeiterdetails wurden erfolgreich geladen.'),
  WORKER_LIST: withClose('Mitarbeiter geladen', 'Die Mitarbeiterliste wurde erfolgreich geladen.'),
  WORKER_UPDATED: withClose(
    'Mitarbeiter aktualisiert',
    'Der Mitarbeiter wurde erfolgreich aktualisiert.'
  ),

  GLOBAL_LOADING: withClose('Wird geladen…', 'Bitte warten Sie einen Moment.'),
  REGISTER_LOADING_SUBMIT: withClose(
    'Registrierung wird verarbeitet…',
    'Bitte warten Sie einen Moment.'
  ),
};

export const fallbackLoadingMessages = {
  verifyEmail: {
    title: 'E-Mail wird bestätigt…',
    description: 'Bitte warten Sie, während wir Ihren Bestätigungslink prüfen.',
  },
  login: {
    title: 'Sie werden angemeldet…',
    description: 'Wir bereiten Ihre Sitzung vor. Einen Moment bitte.',
  },
  createUser: {
    title: 'Konto wird geladen…',
    description: 'Wir richten Ihr Profil und Ihre Einstellungen ein.',
  },
  accessDenied: {
    title: 'Hoppla, etwas fehlt!',
    description:
      'Der Zugriff auf diese Seite ist eingeschränkt. Sie verfügen nicht über die erforderlichen Berechtigungen.',
  },
  logout: {
    title: 'Abmeldung erfolgreich',
    description: 'Du wurdest erfolgreich von deinem Konto abgemeldet.',
    close: fallbackButtons.close,
    errorTexts: {
      title: 'Abmeldung fehlgeschlagen',
      description: 'Beim Abmelden ist ein Fehler aufgetreten. Bitte versuche es erneut.',
    },
  },
};

export const fallbackGlobalError = fallbackPopups.GLOBAL_INTERNAL_ERROR;
export const fallbackRegisterSuccess = fallbackPopups.USER_REGISTER_SUCCESS;
export const fallbackTosNotAccepted = fallbackPopups.USER_TOS_NOT_ACCEPTED;
export const fallbackEmailEmpty = fallbackPopups.USER_LOGIN_MISSING_EMAIL;
export const fallbackPasswordEmpty = fallbackPopups.USER_LOGIN_MISSING_PASSWORD;
export const fallbackVerifyEmailSuccess = fallbackPopups.USER_VERIFY_EMAIL_SUCCESS;
export const fallbackVerifyEmailResended = fallbackPopups.USER_VERIFY_EMAIL_RESENDED;
export const fallbackExpiredToken = fallbackPopups.USER_VERIFY_EXPIRED_TOKEN;
export const fallbackInvalidToken = fallbackPopups.USER_VERIFY_INVALID_TOKEN;
export const fallbackLoginSuccess = fallbackPopups.USER_LOGIN_SUCCESS;
export const fallbackLogoutSuccess = fallbackPopups.LOGOUT_SUCCESS;
export const fallbackLogoutError = fallbackPopups.LOGOUT_FAILED;
export const fallbackLoadingSubmit = fallbackPopups.REGISTER_LOADING_SUBMIT;
export const fallbackGlobalLoading = fallbackPopups.GLOBAL_LOADING;
export const fallbackForgotPasswordLoading = withClose(
  'Passwort-Reset wird vorbereitet…',
  'Bitte warten Sie einen Moment.'
);
export const fallbackForgotPasswordSuccess = fallbackPopups.USER_FORGOT_PASSWORD_EMAIL_SENDED;
