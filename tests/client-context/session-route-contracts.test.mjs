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
const sharedInvitationLoginSource = fs.readFileSync(
  'packages/components/client/user/auth/invitationLogin/InvitationLoginPage.tsx',
  'utf8'
);
const dashboardSetPasswordPageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx',
  'utf8'
);
const sharedInvitationSetPasswordSource = fs.readFileSync(
  'packages/components/client/user/auth/invitationSetPassword/InvitationSetPasswordPage.tsx',
  'utf8'
);
const sharedLoginLayoutSource = fs.readFileSync(
  'packages/components/client/user/auth/sharedLayouts/LoginPageLayout.tsx',
  'utf8'
);
const sharedForgotPasswordLayoutSource = fs.readFileSync(
  'packages/components/client/user/auth/sharedLayouts/ForgotPasswordPageLayout.tsx',
  'utf8'
);
const sharedSetPasswordLayoutSource = fs.readFileSync(
  'packages/components/client/user/auth/sharedLayouts/SetPasswordPageLayout.tsx',
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

const dashboardAccountRoutes = [
  'apps/dashboard/app/[lang]/(app)/account/page.tsx',
  'apps/dashboard/app/[lang]/(app)/account/profile/page.tsx',
  'apps/dashboard/app/[lang]/(app)/account/preferences/page.tsx',
  'apps/dashboard/app/[lang]/(app)/account/security/page.tsx',
  'apps/dashboard/app/[lang]/(app)/account/notifications/page.tsx',
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

test('client profile namespace and dashboard account namespace keep their expected complement routes', () => {
  for (const routePath of clientProfileRoutes) {
    assert.equal(fs.existsSync(routePath), true, `missing client profile route ${routePath}`);
  }

  for (const routePath of dashboardAccountRoutes) {
    assert.equal(fs.existsSync(routePath), true, `missing dashboard account route ${routePath}`);
  }

  assert.equal(
    fs.existsSync('apps/dashboard/app/[lang]/(app)/profile/page.tsx'),
    false,
    'dashboard should no longer expose legacy profile namespace'
  );
});

test('dashboard route wiring uses the shared auth route helpers for login recovery', () => {
  assert.match(dashboardAppLayoutSource, /userAuthRoutes\.login/);
  assert.match(dashboardAppLayoutSource, /redirect\(href\(params\.lang, userAuthRoutes\.login\)\)/);
  assert.match(dashboardLoginPageSource, /InvitationLoginPage app="dashboard"/);
  assert.match(sharedInvitationLoginSource, /userAuthRoutes\.forgotPassword/);
  assert.match(dashboardSetPasswordPageSource, /InvitationSetPasswordPage/);
  assert.match(sharedInvitationSetPasswordSource, /userAuthRoutes\.login/);
});

test('dashboard and worker invitation auth metadata layouts re-export shared layout modules', () => {
  const layoutPairs = [
    [
      'apps/dashboard/app/[lang]/(auth)/user/login/layout.tsx',
      /sharedLayouts\/LoginPageLayout/,
    ],
    [
      'apps/dashboard/app/[lang]/(auth)/user/forgot-password/layout.tsx',
      /sharedLayouts\/ForgotPasswordPageLayout/,
    ],
    [
      'apps/dashboard/app/[lang]/(auth)/user/set-password/layout.tsx',
      /sharedLayouts\/SetPasswordPageLayout/,
    ],
    [
      'apps/worker/app/[lang]/(auth)/user/login/layout.tsx',
      /sharedLayouts\/LoginPageLayout/,
    ],
    [
      'apps/worker/app/[lang]/(auth)/user/forgot-password/layout.tsx',
      /sharedLayouts\/ForgotPasswordPageLayout/,
    ],
    [
      'apps/worker/app/[lang]/(auth)/user/set-password/layout.tsx',
      /sharedLayouts\/SetPasswordPageLayout/,
    ],
  ];

  for (const [path, pattern] of layoutPairs) {
    const source = fs.readFileSync(path, 'utf8');
    assert.match(source, pattern, `Expected ${path} to re-export a shared auth layout.`);
  }

  assert.match(sharedLoginLayoutSource, /getPageMetadata\(params\.lang, 'login'\)/);
  assert.match(sharedForgotPasswordLayoutSource, /getPageMetadata\(params\.lang, 'forgotPassword'\)/);
  assert.match(sharedSetPasswordLayoutSource, /getPageMetadata\(params\.lang, 'setPassword'\)/);
});
