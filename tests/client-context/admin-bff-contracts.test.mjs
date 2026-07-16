import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

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
const dashboardAccountPageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/account/page.tsx',
  'utf8'
);
const dashboardAccountProfilePageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/account/profile/page.tsx',
  'utf8'
);
const dashboardResetBaselineDocSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_RESET_BASELINE_2026-07-04.md',
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
const dashboardShellSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/dashboardShell.ts',
  'utf8'
);
const dashboardAppTreeRoot = 'apps/dashboard/app/[lang]/(app)';

const collectDashboardRuntimeSources = (rootDir) => {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  let contents = '';

  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    const normalizedPath = fullPath.replaceAll(path.sep, '/');

    if (normalizedPath.includes('/docs/')) {
      continue;
    }

    if (entry.isDirectory()) {
      contents += collectDashboardRuntimeSources(fullPath);
      continue;
    }

    if (!/\.(ts|tsx)$/.test(entry.name)) {
      continue;
    }

    contents += fs.readFileSync(fullPath, 'utf8');
  }

  return contents;
};

const dashboardAppRuntimeSource = collectDashboardRuntimeSources(dashboardAppTreeRoot);

test('admin services now use the same-origin client instead of the browser-direct API client', () => {
  assert.match(adminServiceSource, /import sameOriginApi from '\.\/api\/sameOriginApi';/);
  assert.doesNotMatch(adminServiceSource, /import api from '\.\/api\/api';/);
  assert.match(
    adminServiceSource,
    /sameOriginApi\.get<ApiResponse<AdminRecord>>\(ADMIN_PROFILE_BASE_PATH/
  );
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

test('dashboard account domain replaced the old profile routes with placeholder-based account surfaces', () => {
  assert.match(dashboardAccountPageSource, /DashboardRoutePlaceholder/);
  assert.match(dashboardAccountPageSource, /routePath="\/account"/);
  assert.match(dashboardAccountProfilePageSource, /DashboardRoutePlaceholder/);
  assert.match(dashboardAccountProfilePageSource, /routePath="\/account\/profile"/);
  assert.match(dashboardResetBaselineDocSource, /`profile\/\*`/);
  assert.match(dashboardResetBaselineDocSource, /`\/account\/\*`/);
});

test('dashboard mounts AdminProvider only in the authenticated app tree', () => {
  assert.match(dashboardAppLayoutSource, /<AdminProvider>/);
  assert.match(dashboardAuthLayoutSource, /<AuthProvider/);
  assert.match(dashboardAuthLayoutSource, /\{children\}/);
  assert.doesNotMatch(dashboardAuthLayoutSource, /<AdminProvider>/);
});

test('dashboard protected app tree centralizes auth entry redirects on the canonical /user/login route', () => {
  assert.match(dashboardAppLayoutSource, /redirect\(href\(params\.lang, userAuthRoutes\.login\)\)/);
  assert.doesNotMatch(dashboardAppRuntimeSource, /['"`]\/login['"`]/);
  assert.doesNotMatch(
    dashboardAppRuntimeSource,
    /redirect\(href\([^)]*['"`]\/user\/login['"`]\)\)/
  );
});

test('dashboard admin complement uses /account as the canonical protected namespace', () => {
  assert.match(dashboardAccountPageSource, /routePath="\/account"/);
  assert.match(dashboardAccountProfilePageSource, /routePath="\/account\/profile"/);
  assert.match(dashboardShellSource, /href: '\/account'/);
  assert.match(dashboardShellSource, /href: '\/account\/profile'/);
  assert.doesNotMatch(dashboardShellSource, /href: '\/profile/);
});
