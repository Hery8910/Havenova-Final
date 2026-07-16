import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const clientServicesSource = fs.readFileSync(
  'packages/services/client/clientServices.ts',
  'utf8'
);
const tenantResolverSource = fs.readFileSync(
  'packages/services/client/tenantResolver.ts',
  'utf8'
);
const hostGuardSource = fs.readFileSync(
  'packages/services/client/hostGuard.ts',
  'utf8'
);
const i18nFallbackSource = fs.readFileSync(
  'packages/contexts/i18n/fallbackText.ts',
  'utf8'
);
const i18nIndexSource = fs.readFileSync(
  'packages/contexts/i18n/index.ts',
  'utf8'
);
const authServiceSource = fs.readFileSync(
  'packages/services/auth/authService.ts',
  'utf8'
);
const authTypesSource = fs.readFileSync(
  'packages/types/auth/authTypes.ts',
  'utf8'
);
const profileTypesSource = fs.readFileSync(
  'packages/types/profile/profileTypes.ts',
  'utf8'
);
const profileServiceSource = fs.readFileSync(
  'packages/services/profile/profileService.ts',
  'utf8'
);
const profileOverviewHelperSource = fs.readFileSync(
  'packages/components/client/user/profile/profileOverview/profileOverview.helpers.ts',
  'utf8'
);
const serviceRequestAddressStepSource = fs.readFileSync(
  'packages/components/client/pages/shared/serviceRequest/ServiceRequestAddressStep/ServiceRequestAddressStep.tsx',
  'utf8'
);
const profileDetailsViewModelSource = fs.readFileSync(
  'packages/components/client/user/profile/profileSettings/details/controller/profileDetails.view-model.ts',
  'utf8'
);
const contactFormSource = fs.readFileSync(
  'packages/components/client/pages/contact/ContactForm/ContactForm.tsx',
  'utf8'
);
const verifyEmailPageSource = fs.readFileSync(
  'apps/client/app/[lang]/(auth)/user/verify-email/page.tsx',
  'utf8'
);
const authTypesVerifySource = fs.readFileSync(
  'packages/types/auth/authTypes.ts',
  'utf8'
);
const verifyEmailPageTextsSource = fs.readFileSync(
  'packages/i18n/en/pages.json',
  'utf8'
);
const registerPageSource = fs.readFileSync(
  'apps/client/app/[lang]/(auth)/user/register/page.tsx',
  'utf8'
);
const forgotPasswordPageSource = fs.readFileSync(
  'apps/client/app/[lang]/(auth)/user/forgot-password/page.tsx',
  'utf8'
);
const setPasswordPageSource = fs.readFileSync(
  'apps/client/app/[lang]/(auth)/user/set-password/page.tsx',
  'utf8'
);
const invitationForgotPasswordPageSource = fs.readFileSync(
  'packages/components/client/user/auth/invitationForgotPassword/InvitationForgotPasswordPage.tsx',
  'utf8'
);
const invitationSetPasswordPageSource = fs.readFileSync(
  'packages/components/client/user/auth/invitationSetPassword/InvitationSetPasswordPage.tsx',
  'utf8'
);
const invitationLoginPageSource = fs.readFileSync(
  'packages/components/client/user/auth/invitationLogin/InvitationLoginPage.tsx',
  'utf8'
);
const authAlertActionsSource = fs.readFileSync(
  'packages/hooks/useAuthAlertActions.ts',
  'utf8'
);
const homeServicePageSource = fs.readFileSync(
  'packages/components/client/pages/home-service/HomeServicePage.client.tsx',
  'utf8'
);
const cleaningServicePageSource = fs.readFileSync(
  'packages/components/client/pages/cleaning-service/CleaningServicePage.client.tsx',
  'utf8'
);
const workerProfilePageSource = fs.readFileSync(
  'apps/worker/app/[lang]/(app)/profile/page.tsx',
  'utf8'
);
const dashboardLoginRouteSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(auth)/user/login/page.tsx',
  'utf8'
);
const workerLoginRouteSource = fs.readFileSync(
  'apps/worker/app/[lang]/(auth)/user/login/page.tsx',
  'utf8'
);
const dashboardForgotPasswordRouteSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(auth)/user/forgot-password/page.tsx',
  'utf8'
);
const workerForgotPasswordRouteSource = fs.readFileSync(
  'apps/worker/app/[lang]/(auth)/user/forgot-password/page.tsx',
  'utf8'
);
const avatarSelectorSource = fs.readFileSync(
  'packages/components/client/user/profile/avatarSelector/AvatarSelector.tsx',
  'utf8'
);
const profileDetailsControllerSource = fs.readFileSync(
  'packages/components/client/user/profile/profileSettings/details/controller/useUserProfileDetailsController.ts',
  'utf8'
);
const embeddedProfileControllerSource = fs.readFileSync(
  'packages/components/client/user/profile/profileSettings/details/controller/useEmbeddedProfileCompletionController.ts',
  'utf8'
);
const verifyEmailActionsSource = fs.readFileSync(
  'packages/utils/user/userHandler.ts',
  'utf8'
);

const runtimeSourceRoots = ['packages', 'apps'];
const runtimeSourceIgnoreSegments = ['/i18n/', '/docs/', '/node_modules/', '/.next/'];
const runtimeSourceExtensions = new Set(['.ts', '.tsx']);

const collectRuntimeSources = (rootDir) => {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  let contents = '';

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    const normalizedPath = fullPath.replaceAll(path.sep, '/');

    if (runtimeSourceIgnoreSegments.some((segment) => normalizedPath.includes(segment))) {
      continue;
    }

    if (entry.isDirectory()) {
      contents += collectRuntimeSources(fullPath);
      continue;
    }

    if (!runtimeSourceExtensions.has(path.extname(entry.name))) {
      continue;
    }

    contents += fs.readFileSync(fullPath, 'utf8');
  }

  return contents;
};

const runtimePopupUsageSource = runtimeSourceRoots.map(collectRuntimeSources).join('\n');

test('tenant resolver keeps the expected fallback chain', () => {
  assert.match(tenantResolverSource, /NEXT_PUBLIC_TENANT_KEY/);
  assert.match(tenantResolverSource, /NEXT_PUBLIC_TENANT_KEY_FALLBACK/);
  assert.match(tenantResolverSource, /tnk_demo_havenova/);
  assert.match(tenantResolverSource, /NODE_ENV !== 'production'/);
  assert.match(
    tenantResolverSource,
    /Tenant key is missing in production/
  );
});

test('host guard restricts hosts and reports AUTH_FORBIDDEN on failure', () => {
  assert.match(hostGuardSource, /NEXT_PUBLIC_ALLOWED_HOSTS/);
  assert.match(hostGuardSource, /AUTH_FORBIDDEN/);
  assert.match(hostGuardSource, /localhost/);
  assert.match(hostGuardSource, /127\.0\.0\.1/);
  assert.match(hostGuardSource, /Host "\$\{requestHost\}" is not allowed/);
});

test('client services use canonical public and dashboard endpoints', () => {
  assert.match(clientServicesSource, /\/api\/clients\/tenant\/\$\{safeTenantKey\}/);
  assert.match(clientServicesSource, /\/api\/clients\/dashboard\/\$\{safeClientId\}/);
  assert.doesNotMatch(clientServicesSource, /\/api\/client\//);
});

test('client services validate tenant and client input before calling the API', () => {
  assert.match(clientServicesSource, /minimum length is 8 characters/);
  assert.match(clientServicesSource, /Invalid clientId: value is required\./);
});

test('dashboard service keeps protected request settings', () => {
  assert.match(clientServicesSource, /withCredentials:\s*true/);
  assert.match(clientServicesSource, /Authorization: `Bearer \$\{accessToken\}`/);
  assert.match(clientServicesSource, /Client dashboard fetch failed/);
});

test('bootstrap service still throws structured errors on invalid backend envelopes', () => {
  assert.match(clientServicesSource, /toClientResponseError/);
  assert.match(clientServicesSource, /Client bootstrap fetch failed/);
  assert.match(clientServicesSource, /status = 500/);
});

test('i18n fallback layer resolves locale-aware resources instead of exporting DE only', () => {
  assert.match(i18nIndexSource, /fallbackText/);
  assert.doesNotMatch(i18nIndexSource, /fallbackText\.de/);
  assert.match(i18nFallbackSource, /getI18nFallbacks/);
  assert.match(i18nFallbackSource, /language === 'en' \|\| language === 'es' \? language : 'de'/);
  assert.match(i18nFallbackSource, /resources\[locale\]/);
  assert.doesNotMatch(i18nFallbackSource, /export const fallbackButtons = fallbackBundles\.de/);
  assert.doesNotMatch(i18nFallbackSource, /Legacy default exports remain DE-only/);
});

test('auth pages and shared auth helpers resolve fallback copy from the active locale bundle', () => {
  for (const source of [
    verifyEmailPageSource,
    registerPageSource,
    forgotPasswordPageSource,
    setPasswordPageSource,
    invitationForgotPasswordPageSource,
    invitationSetPasswordPageSource,
    invitationLoginPageSource,
    authAlertActionsSource,
  ]) {
    assert.match(source, /getI18nFallbacks\(lang\)/);
  }
});

test('adjacent user-facing flows also resolve popup fallbacks from the active locale bundle', () => {
  assert.match(homeServicePageSource, /getI18nFallbacks\(lang\)/);
  assert.match(cleaningServicePageSource, /getI18nFallbacks\(lang\)/);
  assert.match(workerProfilePageSource, /getI18nFallbacks\(language\)/);
  assert.match(workerProfilePageSource, /fallbackPopups\.WORKER_UPDATED/);
});

test('profile-facing success states use profile-specific popup codes instead of session-success copy', () => {
  assert.match(avatarSelectorSource, /USER_CLIENT_PROFILE_UPDATED/);
  assert.match(profileDetailsControllerSource, /USER_CLIENT_PROFILE_UPDATED/);
  assert.match(embeddedProfileControllerSource, /USER_CLIENT_PROFILE_UPDATED/);
  assert.doesNotMatch(avatarSelectorSource, /AUTH_GET_SUCCESS/);
  assert.doesNotMatch(profileDetailsControllerSource, /AUTH_GET_SUCCESS/);
  assert.doesNotMatch(embeddedProfileControllerSource, /AUTH_GET_SUCCESS/);
});

test('catalog-only popup codes remain out of visible runtime flows unless explicitly introduced', () => {
  const internalCatalogCodes = [
    'NO_AUTH_USER',
    'CLIENT_CREATE_SUCCESS',
    'CLIENT_FETCH_FAILED',
    'CLIENT_UPDATE_SUCCESS',
    'COMPANY_CREATED',
    'COMPANY_EMAIL_EXISTS',
    'COMPANY_NAME_EXISTS',
    'CONTACT_CREATE_FAILED',
    'CONTACT_DELETE_FAILED',
    'CONTACT_LIST_FAILED',
    'CONTACT_MESSAGE_NOT_FOUND',
    'CONTACT_NOTIFICATION_FAILED',
    'CONTACT_RESPONSE_FAILED',
    'EMAIL_DELIVERY_FAILED',
    'NOTIFICATION_FORBIDDEN_TARGET',
    'NOTIFICATION_NOT_FOUND',
    'USER_CLIENT_PROFILE_EXISTS',
  ];

  for (const code of internalCatalogCodes) {
    assert.doesNotMatch(
      runtimePopupUsageSource,
      new RegExp(`['"\`]${code}['"\`]`),
      `Runtime flow unexpectedly references internal catalog code ${code}`
    );
  }
});

test('auth session model keeps userClientId as the only supported session identity', () => {
  assert.match(authTypesSource, /authId: string/);
  assert.match(authTypesSource, /userClientId: string/);
  assert.doesNotMatch(authTypesSource, /userId: string/);
  assert.match(authServiceSource, /const normalizeAuthUser =/);
  assert.match(authServiceSource, /AuthEnvelope<AuthSessionApiUser>/);
  assert.match(authServiceSource, /Auth session payload is missing user data\./);
  assert.match(
    fs.readFileSync('packages/utils/auth/authSession.ts', 'utf8'),
    /value\?\.userClientId \|\| fallbacks\?\.userClientId/
  );
});

test('profile contract keeps contactEmail explicit across types and service normalization', () => {
  assert.match(profileTypesSource, /contactEmail: string/);
  assert.match(profileServiceSource, /contactEmail: profile\.contactEmail \?\? ''/);
  assert.match(profileServiceSource, /normalizeProfile/);
});

test('profile presentation consumers prefer profile.contactEmail over auth session email', () => {
  assert.match(profileOverviewHelperSource, /profile\.name\?\.trim\(\) \|\| profile\.contactEmail\?\.trim\(\) \|\| fallbacks\.profileUser/);
  assert.doesNotMatch(profileOverviewHelperSource, /auth\.email/);
  assert.match(serviceRequestAddressStepSource, /profile\?\.contactEmail\?\.trim\(\) \|\| '-'/);
  assert.doesNotMatch(serviceRequestAddressStepSource, /auth\?\.email/);
  assert.match(profileDetailsViewModelSource, /email: profile\?\.contactEmail/);
  assert.doesNotMatch(profileDetailsViewModelSource, /email: auth\?\.email/);
  assert.match(contactFormSource, /email: profileEmail \|\| ''/);
  assert.doesNotMatch(contactFormSource, /sessionEmail/);
});

test('verify-email flow treats missing magicToken as explicit manual-login fallback', () => {
  assert.match(authTypesVerifySource, /requiresManualLogin\?: boolean/);
  assert.match(verifyEmailPageSource, /if \(result\.requiresManualLogin \|\| !result\.magicToken\)/);
  assert.match(verifyEmailPageSource, /manualLoginFallback/);
  assert.match(verifyEmailPageSource, /goToLogin/);
  assert.match(verifyEmailPageTextsSource, /"manualLoginFallback"/);
});

test('register flow no longer depends on ProfileContext before a real session exists', () => {
  assert.doesNotMatch(registerPageSource, /useProfile\(/);
  assert.doesNotMatch(registerPageSource, /updateProfile\(/);
  assert.match(registerPageSource, /createLoggedOutAuthSeed/);
});

test('public auth flows use loadings.json for in-progress messaging instead of GLOBAL_LOADING popups', () => {
  for (const source of [
    forgotPasswordPageSource,
    setPasswordPageSource,
    invitationForgotPasswordPageSource,
    invitationSetPasswordPageSource,
    verifyEmailActionsSource,
  ]) {
    assert.doesNotMatch(source, /GLOBAL_LOADING/);
  }

  assert.match(forgotPasswordPageSource, /loadingText\.forgotPassword/);
  assert.match(setPasswordPageSource, /loadingText\.resetPassword/);
  assert.match(invitationForgotPasswordPageSource, /loadingText\.forgotPassword/);
  assert.match(invitationSetPasswordPageSource, /loadingText\.resetPassword/);
  assert.match(verifyEmailActionsSource, /fallbackLoadingMessages\.resendVerification/);
});

test('dashboard and worker invitation auth routes stay as thin wrappers over shared pages', () => {
  assert.match(dashboardLoginRouteSource, /InvitationLoginPage/);
  assert.match(dashboardLoginRouteSource, /app="dashboard"/);
  assert.match(workerLoginRouteSource, /InvitationLoginPage/);
  assert.match(workerLoginRouteSource, /app="worker"/);
  assert.match(dashboardForgotPasswordRouteSource, /InvitationForgotPasswordPage/);
  assert.match(workerForgotPasswordRouteSource, /InvitationForgotPasswordPage/);

  for (const source of [
    dashboardLoginRouteSource,
    workerLoginRouteSource,
    dashboardForgotPasswordRouteSource,
    workerForgotPasswordRouteSource,
  ]) {
    assert.doesNotMatch(source, /showLoading/);
    assert.doesNotMatch(source, /showSuccess/);
    assert.doesNotMatch(source, /showError/);
    assert.doesNotMatch(source, /loginUser\(/);
    assert.doesNotMatch(source, /forgotPassword\(/);
  }
});
