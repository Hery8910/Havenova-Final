import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const adminServiceSource = fs.readFileSync('packages/services/admin.ts', 'utf8');
const sameOriginApiSource = fs.readFileSync('packages/services/api/sameOriginApi.ts', 'utf8');
const dashboardAdminRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/home-services/admin/route.ts',
  'utf8'
);
const dashboardAdminResendInviteRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/home-services/admin/resend-invite/route.ts',
  'utf8'
);
const dashboardProfilePageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/profile/page.tsx',
  'utf8'
);
const dashboardProfileEditPageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/profile/edit/page.tsx',
  'utf8'
);
const dashboardAppLayoutSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/layout.tsx',
  'utf8'
);
const dashboardAuthLayoutSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(auth)/user/layout.tsx',
  'utf8'
);

test('admin services now use the same-origin client instead of the browser-direct API client', () => {
  assert.match(adminServiceSource, /import sameOriginApi from '\.\/api\/sameOriginApi';/);
  assert.doesNotMatch(adminServiceSource, /import api from '\.\/api\/api';/);
  assert.match(adminServiceSource, /sameOriginApi\.get<ApiResponse<AdminRecord>>\(ADMIN_PROFILE_BASE_PATH/);
  assert.match(sameOriginApiSource, /withCredentials: true/);
});

test('dashboard mounts admin BFF routes for admin profile endpoints', () => {
  assert.match(dashboardAdminRouteSource, /proxyBackendRoute/);
  assert.match(dashboardAdminRouteSource, /upstreamPath: '\/api\/home-services\/admin'/);
  assert.match(
    dashboardAdminResendInviteRouteSource,
    /upstreamPath: '\/api\/home-services\/admin\/resend-invite'/
  );
});

test('dashboard account pages use admin as the auth complement', () => {
  assert.match(dashboardProfilePageSource, /useAdmin\(\)/);
  assert.doesNotMatch(dashboardProfilePageSource, /useProfile\(\)/);
  assert.doesNotMatch(dashboardProfilePageSource, /useWorker\(\)/);
  assert.match(dashboardProfileEditPageSource, /useAdmin\(\)/);
  assert.doesNotMatch(dashboardProfileEditPageSource, /useProfile\(\)/);
  assert.doesNotMatch(dashboardProfileEditPageSource, /useWorker\(\)/);
});

test('dashboard mounts AdminProvider only in the authenticated app tree', () => {
  assert.match(dashboardAppLayoutSource, /<AdminProvider>/);
  assert.match(dashboardAuthLayoutSource, /<AuthProvider>\{children\}<\/AuthProvider>/);
  assert.doesNotMatch(dashboardAuthLayoutSource, /<AdminProvider>/);
});
