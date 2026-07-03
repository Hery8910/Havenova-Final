import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const sessionRoutesSource = fs.readFileSync('packages/utils/navigation/sessionRoutes.ts', 'utf8');
const dashboardAppLayoutSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/layout.tsx',
  'utf8'
);
const dashboardLoginPageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(auth)/user/login/page.tsx',
  'utf8'
);
const dashboardSetPasswordPageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx',
  'utf8'
);

const clientAuthPages = [
  'login',
  'register',
  'forgot-password',
  'verify-email',
  'set-password',
];

const dashboardAuthPages = ['login', 'forgot-password', 'set-password'];

const clientProfileRoutes = [
  'apps/client/app/[lang]/(app)/profile/page.tsx',
  'apps/client/app/[lang]/(app)/profile/settings/page.tsx',
  'apps/client/app/[lang]/(app)/profile/notifications/page.tsx',
  'apps/client/app/[lang]/(app)/profile/orders/page.tsx',
  'apps/client/app/[lang]/(app)/profile/requests/page.tsx',
];

const dashboardProfileRoutes = [
  'apps/dashboard/app/[lang]/(app)/profile/page.tsx',
  'apps/dashboard/app/[lang]/(app)/profile/edit/page.tsx',
  'apps/dashboard/app/[lang]/(app)/profile/notification/page.tsx',
  'apps/dashboard/app/[lang]/(app)/profile/requests/page.tsx',
];

test('shared session route catalog defines canonical auth and complement paths', () => {
  assert.match(sessionRoutesSource, /login: '\/user\/login'/);
  assert.match(sessionRoutesSource, /register: '\/user\/register'/);
  assert.match(sessionRoutesSource, /forgotPassword: '\/user\/forgot-password'/);
  assert.match(sessionRoutesSource, /verifyEmail: '\/user\/verify-email'/);
  assert.match(sessionRoutesSource, /setPassword: '\/user\/set-password'/);
  assert.match(sessionRoutesSource, /clientSessionRoutes = \{/);
  assert.match(sessionRoutesSource, /adminSessionRoutes = \{/);
  assert.match(sessionRoutesSource, /workerSessionRoutes = \{/);
  assert.match(sessionRoutesSource, /sessionRouteCatalog = \{/);
});

test('client auth route tree keeps the full shared auth surface', () => {
  for (const routeSegment of clientAuthPages) {
    assert.equal(
      fs.existsSync(`apps/client/app/[lang]/(auth)/user/${routeSegment}/page.tsx`),
      true,
      `missing client auth page for ${routeSegment}`
    );
    assert.equal(
      fs.existsSync(`apps/client/app/[lang]/(auth)/user/${routeSegment}/layout.tsx`),
      true,
      `missing client auth layout for ${routeSegment}`
    );
  }
});

test('dashboard auth route tree mounts the admin subset with page metadata layouts', () => {
  for (const routeSegment of dashboardAuthPages) {
    assert.equal(
      fs.existsSync(`apps/dashboard/app/[lang]/(auth)/user/${routeSegment}/page.tsx`),
      true,
      `missing dashboard auth page for ${routeSegment}`
    );
    assert.equal(
      fs.existsSync(`apps/dashboard/app/[lang]/(auth)/user/${routeSegment}/layout.tsx`),
      true,
      `missing dashboard auth layout for ${routeSegment}`
    );
  }

  assert.equal(
    fs.existsSync('apps/dashboard/app/[lang]/(auth)/user/register/page.tsx'),
    false,
    'dashboard should not expose public register'
  );
  assert.equal(
    fs.existsSync('apps/dashboard/app/[lang]/(auth)/user/verify-email/page.tsx'),
    false,
    'dashboard should not expose public verify-email'
  );
});

test('client and dashboard profile namespaces keep their expected complement routes', () => {
  for (const routePath of clientProfileRoutes) {
    assert.equal(fs.existsSync(routePath), true, `missing client profile route ${routePath}`);
  }

  for (const routePath of dashboardProfileRoutes) {
    assert.equal(fs.existsSync(routePath), true, `missing dashboard profile route ${routePath}`);
  }
});

test('dashboard route wiring uses the shared auth route helpers for login recovery', () => {
  assert.match(dashboardAppLayoutSource, /userAuthRoutes\.login/);
  assert.match(dashboardAppLayoutSource, /redirect\(href\(params\.lang, userAuthRoutes\.login\)\)/);
  assert.match(dashboardLoginPageSource, /userAuthRoutes\.forgotPassword/);
  assert.match(dashboardSetPasswordPageSource, /userAuthRoutes\.login/);
});
