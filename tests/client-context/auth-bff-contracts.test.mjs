import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const authServiceSource = fs.readFileSync('packages/services/auth/authService.ts', 'utf8');
const authApiSource = fs.readFileSync('packages/services/api/authApi.ts', 'utf8');
const apiSource = fs.readFileSync('packages/services/api/api.ts', 'utf8');
const sameOriginApiSource = fs.readFileSync('packages/services/api/sameOriginApi.ts', 'utf8');
const authContextSource = fs.readFileSync('packages/contexts/auth/authContext.tsx', 'utf8');
const bffStrategySource = fs.readFileSync('docs/FRONTEND_BFF_STRATEGY.md', 'utf8');
const authRouteSource = fs.readFileSync('packages/services/bff/authBffRoute.ts', 'utf8');
const backendProxyRouteSource = fs.readFileSync(
  'packages/services/bff/backendProxyRoute.ts',
  'utf8'
);
const clientAuthRouteSource = fs.readFileSync(
  'apps/client/app/api/auth/[...auth]/route.ts',
  'utf8'
);
const dashboardAuthRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/auth/[...auth]/route.ts',
  'utf8'
);
const dashboardMiddlewareSource = fs.readFileSync('apps/dashboard/middleware.ts', 'utf8');
const dashboardLoginPageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(auth)/user/login/page.tsx',
  'utf8'
);
const adminContextSource = fs.readFileSync('packages/contexts/admin/AdminContext.tsx', 'utf8');

test('auth services now use the same-origin authApi client', () => {
  assert.match(authServiceSource, /import authApi from '\.\.\/api\/authApi';/);
  assert.doesNotMatch(authServiceSource, /import api from '\.\.\/api\/api';/);
  assert.match(authApiSource, /import sameOriginApi from '\.\/sameOriginApi';/);
  assert.match(authApiSource, /const authApi = sameOriginApi;/);
  assert.match(sameOriginApiSource, /const sameOriginApi = axios\.create\(\{\s*withCredentials: true,/s);
  assert.doesNotMatch(authApiSource, /NEXT_PUBLIC_API_URL/);
});

test('generic browser API client remains configured for direct backend transitional domains', () => {
  assert.match(apiSource, /const baseURL = process\.env\.NEXT_PUBLIC_API_URL/);
});

test('workspace strategy closes the BFF decision as browser to frontend to backend', () => {
  assert.match(bffStrategySource, /browser -> frontend BFF -> central backend/);
  assert.match(bffStrategySource, /auth is the first migrated domain/);
});

test('shared auth BFF route exists and both apps mount it', () => {
  assert.match(authRouteSource, /AUTH_ROUTE_CONFIG/);
  assert.match(authRouteSource, /proxyBackendRoute/);
  assert.match(authRouteSource, /applyAuthCookiesFromBackend/);
  assert.match(backendProxyRouteSource, /performBackendRequest/);
  assert.match(backendProxyRouteSource, /createProxyBrowserResponse/);
  assert.match(clientAuthRouteSource, /handleAuthBffRoute/);
  assert.match(dashboardAuthRouteSource, /handleAuthBffRoute/);
});

test('auth refresh still attempts refresh-token when in-memory CSRF is missing because the BFF can bridge csrfToken cookie state', () => {
  assert.match(authContextSource, /const csrfToken = getCsrfToken\(\);/);
  assert.match(authContextSource, /csrfTokenSource: csrfToken \? 'memory' : 'bff-cookie-fallback'/);
  assert.match(backendProxyRouteSource, /const CSRF_COOKIE = 'csrfToken';/);
  assert.match(backendProxyRouteSource, /request\.cookies\.get\(CSRF_COOKIE\)\?\.value\?\.trim\(\)/);
  assert.doesNotMatch(authContextSource, /refreshAuth\.skip-refresh-token-missing-csrf/);
});

test('disableUnauthenticatedBootstrap now keeps stored auth without forcing immediate server revalidation on mount', () => {
  assert.match(authContextSource, /if \(disableUnauthenticatedBootstrap\) \{\s*setLoading\(false\);\s*return;\s*\}/s);
});

test('dashboard middleware restores protected sessions before SSR redirects', () => {
  assert.match(dashboardMiddlewareSource, /const isProtectedDashboardPath =/);
  assert.match(dashboardMiddlewareSource, /fetch\(buildBackendUrl\('\/api\/auth\/me'\)/);
  assert.match(dashboardMiddlewareSource, /fetch\(buildBackendUrl\('\/api\/auth\/refresh-token'\)/);
  assert.match(dashboardMiddlewareSource, /applyAuthCookiesFromBackend\(refreshResponse, response\)/);
  assert.match(dashboardMiddlewareSource, /NextResponse\.next\(\{\s*request:\s*\{\s*headers: forwardedHeaders/s);
});

test('dashboard login auto-redirect requires server-confirmed auth rather than storage-only auth', () => {
  assert.match(dashboardLoginPageSource, /const \{ auth, loading: authLoading, setAuth, source \} = useAuth\(\);/);
  assert.match(dashboardLoginPageSource, /const canAutoRedirectToDashboard =\s*!authLoading && source === 'server' && hasDashboardAccess/s);
  assert.match(dashboardLoginPageSource, /if \(!canAutoRedirectToDashboard\) return;/);
});

test('admin local defaults reuse stored theme and language to avoid hydration flash after reload', () => {
  assert.match(adminContextSource, /const getStoredTheme = \(\): ThemeMode \| null =>/);
  assert.match(adminContextSource, /const getStoredLanguage = \(\): 'de' \| 'en' \| 'es' \| null =>/);
  assert.match(adminContextSource, /language: previous\?\.language \?\? getStoredLanguage\(\) \?\? 'de'/);
  assert.match(adminContextSource, /theme: previous\?\.theme \?\? getStoredTheme\(\) \?\? 'light'/);
});
