import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const enPopups = JSON.parse(fs.readFileSync('packages/i18n/en/popups.json', 'utf8'));
const esPopups = JSON.parse(fs.readFileSync('packages/i18n/es/popups.json', 'utf8'));
const dePopups = JSON.parse(fs.readFileSync('packages/i18n/de/popups.json', 'utf8'));
const enLoadings = JSON.parse(fs.readFileSync('packages/i18n/en/loadings.json', 'utf8'));
const esLoadings = JSON.parse(fs.readFileSync('packages/i18n/es/loadings.json', 'utf8'));
const deLoadings = JSON.parse(fs.readFileSync('packages/i18n/de/loadings.json', 'utf8'));
const enPages = JSON.parse(fs.readFileSync('packages/i18n/en/pages.json', 'utf8'));
const esPages = JSON.parse(fs.readFileSync('packages/i18n/es/pages.json', 'utf8'));
const dePages = JSON.parse(fs.readFileSync('packages/i18n/de/pages.json', 'utf8'));

const requiredDualCtaCodes = [
  'GLOBAL_INTERNAL_ERROR',
  'CLIENT_NOT_FOUND',
  'AUTH_FORBIDDEN',
  'USER_NEED_TO_LOGIN',
  'USER_SESSION_EXPIRED',
  'LOGOUT_CONFIRM',
  'PROFILE_ADDRESS_DELETE_CONFIRM',
];

test('popup key sets stay aligned between EN and DE', () => {
  const enKeys = Object.keys(enPopups).sort();
  const esKeys = Object.keys(esPopups).sort();
  const deKeys = Object.keys(dePopups).sort();
  assert.deepEqual(enKeys, esKeys);
  assert.deepEqual(enKeys, deKeys);
});

test('codes requiring dual CTA define confirm and close in both locales', () => {
  for (const code of requiredDualCtaCodes) {
    assert.ok(enPopups[code], `Missing EN popup for ${code}`);
    assert.ok(dePopups[code], `Missing DE popup for ${code}`);
    assert.equal(typeof enPopups[code].confirm, 'string', `EN confirm missing for ${code}`);
    assert.equal(typeof enPopups[code].close, 'string', `EN close missing for ${code}`);
    assert.equal(typeof dePopups[code].confirm, 'string', `DE confirm missing for ${code}`);
    assert.equal(typeof dePopups[code].close, 'string', `DE close missing for ${code}`);
  }
});

test('legacy popup aliases retained for gradual migration still exist in both locales', () => {
  const legacyCodes = [
    'ACCESS_TOKEN_EXPIRED',
    'NO_ACCESS_TOKEN',
    'CLIENT_CREATE_SUCCESS',
    'CLIENT_FETCH_FAILED',
    'CLIENT_UPDATE_SUCCESS',
  ];

  for (const code of legacyCodes) {
    assert.ok(enPopups[code], `Missing legacy EN popup for ${code}`);
    assert.ok(dePopups[code], `Missing legacy DE popup for ${code}`);
  }
});

test('auth popup copy stays localized across EN, ES, and DE for the main auth surface', () => {
  const authPopupCodes = [
    'AUTH_NOT_LOGGED_IN',
    'AUTH_REQUIRED',
    'AUTH_FORBIDDEN',
    'USER_NEED_TO_LOGIN',
    'USER_SESSION_EXPIRED',
    'AUTH_BLOCKED',
    'USER_REGISTER_SUCCESS',
    'USER_REGISTER_ALREADY_REGISTERED',
    'USER_REGISTER_NEEDS_CORRECT_PASSWORD',
    'USER_LOGIN_MISSING_EMAIL',
    'USER_LOGIN_MISSING_PASSWORD',
    'USER_VERIFY_EMAIL_SUCCESS',
    'USER_VERIFY_EMAIL_VERIFIED',
    'USER_RESET_PASSWORD_INVALID_TOKEN',
    'USER_RESET_PASSWORD_TOKEN_EXPIRED',
    'VALIDATION_ERROR',
    'USER_NOT_FOUND',
    'USER_CLIENT_NOT_FOUND',
    'USER_CLIENT_BLOCKED',
    'USER_CLIENT_COOKIES_UPDATE_SUCCESS',
    'USER_CLIENT_PROFILE_UPDATED',
    'REFRESH_TOKEN_MISSING',
    'REFRESH_TOKEN_INVALIDATED',
    'REFRESH_TOKEN_EXPIRED',
    'ACCESS_TOKEN_REFRESHED',
    'CSRF_TOKEN_INVALID',
    'LOGOUT_SUCCESS',
    'LOGOUT_FAILED',
    'LOGOUT_CONFIRM',
    'USER_LOGOUT_SUCCESS',
    'USER_LOGOUT_ALL_SUCCESS',
    'AUTH_GET_SUCCESS',
    'MAGIC_TOKEN_EXPIRED',
    'MAGIC_TOKEN_INVALID',
    'MAGIC_LOGIN_SUCCESS',
    'USER_FORGOT_PASSWORD_EMAIL_SENT',
    'USER_LOGIN_EMAIL_NOT_VERIFIED',
    'USER_LOGIN_SUCCESS',
    'USER_RESET_PASSWORD_SUCCESS',
    'USER_CHANGE_EMAIL_REQUESTED',
    'USER_CHANGE_EMAIL_CONFIRMED',
    'USER_CHANGE_EMAIL_SAME_EMAIL',
    'USER_EMAIL_ALREADY_IN_USE',
    'PERMISSION_DENIED',
    'WORKER_LOAD_FAILED',
    'WORKER_UPDATED',
  ];

  for (const code of authPopupCodes) {
    assert.ok(enPopups[code], `Missing EN popup for ${code}`);
    assert.ok(esPopups[code], `Missing ES popup for ${code}`);
    assert.ok(dePopups[code], `Missing DE popup for ${code}`);

    assert.equal(typeof enPopups[code].title, 'string', `EN title missing for ${code}`);
    assert.equal(typeof esPopups[code].title, 'string', `ES title missing for ${code}`);
    assert.equal(typeof dePopups[code].title, 'string', `DE title missing for ${code}`);
    assert.equal(typeof enPopups[code].description, 'string', `EN description missing for ${code}`);
    assert.equal(typeof esPopups[code].description, 'string', `ES description missing for ${code}`);
    assert.equal(typeof dePopups[code].description, 'string', `DE description missing for ${code}`);

    assert.notEqual(
      `${esPopups[code].title} ${esPopups[code].description}`,
      `${enPopups[code].title} ${enPopups[code].description}`,
      `ES popup should not remain identical to EN for ${code}`
    );
    assert.notEqual(
      `${dePopups[code].title} ${dePopups[code].description}`,
      `${enPopups[code].title} ${enPopups[code].description}`,
      `DE popup should not remain identical to EN for ${code}`
    );
  }
});

test('security-sensitive auth success copy keeps recovery responses intentionally ambiguous', () => {
  assert.match(enPopups.USER_FORGOT_PASSWORD_EMAIL_SENT.description, /If an account matches this email/i);
  assert.match(esPopups.USER_FORGOT_PASSWORD_EMAIL_SENT.description, /Si existe una cuenta con ese correo/i);
  assert.match(dePopups.USER_FORGOT_PASSWORD_EMAIL_SENT.description, /Wenn zu dieser E-Mail ein Konto gehört/i);
  assert.match(enPopups.USER_VERIFY_EMAIL_RESENT.description, /If this account can be verified/i);
  assert.match(esPopups.USER_VERIFY_EMAIL_RESENT.description, /Si esta cuenta puede verificarse/i);
  assert.match(
    dePopups.USER_VERIFY_EMAIL_RESENT.description,
    /Wenn dieses Konto bestätigt werden kann/i
  );
});

test('registration success copy requires verification before access across locales', () => {
  assert.match(enPopups.USER_REGISTER_SUCCESS.description, /Verify your email before signing in/i);
  assert.match(esPopups.USER_REGISTER_SUCCESS.description, /Confirma tu correo antes de iniciar sesión/i);
  assert.match(
    dePopups.USER_REGISTER_SUCCESS.description,
    /Bestätigen Sie Ihre E-Mail, bevor Sie sich anmelden/i
  );
});

test('auth page helper copy keeps recovery ambiguity and flow-specific next steps across locales', () => {
  assert.match(
    enPages.client.user.forgotPasswordText.info,
    /if the account can be recovered/i
  );
  assert.match(
    esPages.client.user.forgotPasswordText.info,
    /si la cuenta puede recuperarse/i
  );
  assert.match(
    dePages.client.user.forgotPasswordText.info,
    /wenn das Konto wiederhergestellt werden kann/i
  );

  assert.match(
    enPages.client.user.resetPasswordText.linkErrors.invalidOrExpired,
    /Request a new one to continue/i
  );
  assert.match(
    esPages.client.user.resetPasswordText.linkErrors.invalidOrExpired,
    /Solicita uno nuevo para continuar/i
  );
  assert.match(
    dePages.client.user.resetPasswordText.linkErrors.invalidOrExpired,
    /Fordern Sie einen neuen an, um fortzufahren/i
  );
});

test('verify-email page overrides distinguish manual login fallback from session sync failure', () => {
  assert.match(
    enPages.client.user.verifyEmail.manualLoginFallback.description,
    /Sign in manually to continue/i
  );
  assert.match(
    enPages.client.user.verifyEmail.sessionSyncError.description,
    /Reload the page or sign in again/i
  );
  assert.match(
    esPages.client.user.verifyEmail.manualLoginFallback.description,
    /Inicia sesión manualmente para continuar/i
  );
  assert.match(
    esPages.client.user.verifyEmail.sessionSyncError.description,
    /Recarga la página o inicia sesión de nuevo/i
  );
  assert.match(
    dePages.client.user.verifyEmail.manualLoginFallback.description,
    /Bitte melden Sie sich manuell an/i
  );
  assert.match(
    dePages.client.user.verifyEmail.sessionSyncError.description,
    /Laden Sie die Seite neu oder melden Sie sich erneut an/i
  );
});

test('german auth helper copy keeps a consistent formal register', () => {
  assert.equal(dePages.client.user.login.cta.label, 'Konto erstellen');
  assert.equal(dePages.client.user.forgotPasswordText.title, 'Passwort zurücksetzen');
  assert.match(dePages.client.user.forgotPasswordText.info, /Geben Sie Ihre E-Mail-Adresse ein/i);
  assert.match(
    dePages.client.user.verifyEmail.input.info,
    /zum Erstellen Ihres Kontos verwendet haben/i
  );
  assert.doesNotMatch(dePages.client.user.forgotPasswordText.title, /Setze dein/i);
  assert.doesNotMatch(dePages.client.user.forgotPasswordText.info, /Gib deine/i);
});

test('session and permission CTAs stay localized in every locale', () => {
  assert.equal(esPopups.PERMISSION_DENIED.close, 'Ir al acceso');
  assert.equal(dePopups.PERMISSION_DENIED.close, 'Zum Login');
  assert.equal(enPopups.PERMISSION_DENIED.close, 'Go to login');
  assert.equal(esPopups.LOGOUT_CONFIRM.confirm, 'Cerrar sesión');
  assert.equal(dePopups.LOGOUT_CONFIRM.confirm, 'Abmelden');
  assert.equal(enPopups.LOGOUT_CONFIRM.confirm, 'Log out');
});

test('profile and worker success copy stays localized and user-facing', () => {
  assert.equal(enPopups.USER_CLIENT_PROFILE_UPDATED.title, 'Profile updated');
  assert.equal(esPopups.USER_CLIENT_PROFILE_UPDATED.title, 'Perfil actualizado');
  assert.equal(dePopups.USER_CLIENT_PROFILE_UPDATED.title, 'Profil aktualisiert');
  assert.equal(enPopups.WORKER_UPDATED.title, 'Details saved');
  assert.equal(esPopups.WORKER_UPDATED.title, 'Datos guardados');
  assert.equal(dePopups.WORKER_UPDATED.title, 'Angaben gespeichert');
  assert.doesNotMatch(esPopups.USER_UPDATE_PASSWORD_SUCCESS.title, /Password updated/);
  assert.doesNotMatch(esPopups.USER_CHANGE_EMAIL_INVALID_TOKEN.title, /Invalid confirmation link/);
  assert.doesNotMatch(esPopups.USER_VERIFY_EMAIL_RESENT.title, /Verification email resent/);
});

test('operational spanish popup copy is localized for worker admin and notification flows', () => {
  const localizedEsCodes = [
    'WORKER_CREATED',
    'WORKER_FOUND',
    'WORKER_NOT_FOUND',
    'OBJECT_CREATED',
    'OBJECT_FOUND',
    'PROPERTY_MANAGER_CREATED',
    'PROPERTY_MANAGER_UPDATED',
    'AUTH_CLIENT_ADMIN_REQUIRED',
    'AUTH_SUPERADMIN_REQUIRED',
    'CONTACT_MESSAGE_CREATED',
    'CONTACT_MESSAGE_DELETED',
    'NOTIFICATION_CREATED',
    'NOTIFICATION_LIST',
    'NOTIFICATION_MARKED_READ',
    'CLIENT_CREATE_SUCCESS',
    'CLIENT_NOT_FOUND',
  ];

  for (const code of localizedEsCodes) {
    assert.notEqual(
      `${esPopups[code].title} ${esPopups[code].description}`,
      `${enPopups[code].title} ${enPopups[code].description}`,
      `ES operational popup should not remain identical to EN for ${code}`
    );
  }
});

test('operational english and german popup copy avoids CRUD-heavy wording on visible flows', () => {
  assert.equal(enPopups.CLIENT_CREATE_SUCCESS.title, 'Workspace created');
  assert.equal(dePopups.CLIENT_CREATE_SUCCESS.title, 'Workspace erstellt');
  assert.equal(enPopups.WORKER_LOAD_FAILED.title, "We couldn't load the details");
  assert.equal(dePopups.WORKER_LOAD_FAILED.title, 'Details konnten nicht geladen werden');
  assert.equal(enPopups.AUTH_CLIENT_ADMIN_REQUIRED.title, 'Admin access required');
  assert.equal(dePopups.AUTH_CLIENT_ADMIN_REQUIRED.title, 'Admin-Zugriff erforderlich');
  assert.equal(enPopups.NOTIFICATION_UNREAD_COUNT.title, 'Unread count ready');
  assert.equal(
    dePopups.NOTIFICATION_UNREAD_COUNT.title,
    'Anzahl ungelesener Benachrichtigungen bereit'
  );
});

test('auth loading keys stay aligned across locales and cover the public auth surface', () => {
  const authLoadingKeys = [
    'verifyEmail',
    'resendVerification',
    'login',
    'dashboardLogin',
    'forgotPassword',
    'resetPassword',
  ];

  for (const key of authLoadingKeys) {
    assert.ok(enLoadings.message[key], `Missing EN loading key ${key}`);
    assert.ok(esLoadings.message[key], `Missing ES loading key ${key}`);
    assert.ok(deLoadings.message[key], `Missing DE loading key ${key}`);
    assert.equal(typeof enLoadings.message[key].title, 'string');
    assert.equal(typeof esLoadings.message[key].title, 'string');
    assert.equal(typeof deLoadings.message[key].title, 'string');
    assert.equal(typeof enLoadings.message[key].description, 'string');
    assert.equal(typeof esLoadings.message[key].description, 'string');
    assert.equal(typeof deLoadings.message[key].description, 'string');
  }
});
