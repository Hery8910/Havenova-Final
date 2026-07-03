import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const authServiceSource = fs.readFileSync('packages/services/auth/authService.ts', 'utf8');
const authApiSource = fs.readFileSync('packages/services/api/authApi.ts', 'utf8');
const apiSource = fs.readFileSync('packages/services/api/api.ts', 'utf8');
const sameOriginApiSource = fs.readFileSync('packages/services/api/sameOriginApi.ts', 'utf8');
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
