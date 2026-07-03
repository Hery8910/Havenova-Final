import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const profileServiceSource = fs.readFileSync('packages/services/profile/profileService.ts', 'utf8');
const sameOriginApiSource = fs.readFileSync('packages/services/api/sameOriginApi.ts', 'utf8');
const proxyRouteSource = fs.readFileSync('packages/services/bff/backendProxyRoute.ts', 'utf8');
const clientProfileRouteSource = fs.readFileSync(
  'apps/client/app/api/home-services/profile/route.ts',
  'utf8'
);
const dashboardProfileRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/home-services/profile/route.ts',
  'utf8'
);

test('profile service now uses the same-origin client instead of the browser-direct API client', () => {
  assert.match(profileServiceSource, /import sameOriginApi from '\.\.\/api\/sameOriginApi';/);
  assert.doesNotMatch(profileServiceSource, /import api from '\.\.\/api\/api';/);
  assert.match(profileServiceSource, /sameOriginApi\.get<ApiResponse<UserClientProfile>>/);
  assert.match(sameOriginApiSource, /const sameOriginApi = axios\.create\(\{\s*withCredentials: true,/s);
});

test('profile BFF route is mounted in both apps and reuses the generic proxy helper', () => {
  assert.match(proxyRouteSource, /export const proxyBackendRoute/);
  assert.match(clientProfileRouteSource, /proxyBackendRoute/);
  assert.match(clientProfileRouteSource, /upstreamPath: '\/api\/home-services\/profile'/);
  assert.match(dashboardProfileRouteSource, /proxyBackendRoute/);
  assert.match(dashboardProfileRouteSource, /upstreamPath: '\/api\/home-services\/profile'/);
});
