import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

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
  assert.match(i18nFallbackSource, /language === 'en' \? 'en' : 'de'/);
  assert.match(i18nFallbackSource, /resources\[locale\]/);
  assert.match(i18nFallbackSource, /Legacy default exports remain DE-only/);
});

test('auth service normalizes session payloads to the frontend auth model with compatibility alias', () => {
  assert.match(authTypesSource, /authId: string/);
  assert.match(authTypesSource, /userClientId: string/);
  assert.match(authTypesSource, /compatibilidad transitoria con consumidores que aún esperan `userId`/);
  assert.match(authServiceSource, /const normalizeAuthUser =/);
  assert.match(authServiceSource, /userId: user\.userClientId/);
  assert.match(authServiceSource, /AuthEnvelope<AuthSessionApiUser>/);
  assert.match(authServiceSource, /Auth session payload is missing user data\./);
});

test('profile contract keeps contactEmail explicit across types and service normalization', () => {
  assert.match(profileTypesSource, /contactEmail: string/);
  assert.match(profileServiceSource, /contactEmail: profile\.contactEmail \?\? ''/);
  assert.match(profileServiceSource, /normalizeProfile/);
});
