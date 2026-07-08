import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const usersPageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/people/users/page.tsx',
  'utf8'
);
const usersControllerSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/people/users/page.controller.tsx',
  'utf8'
);
const usersCopySource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/people/users/page.copy.ts',
  'utf8'
);
const usersDeepLinkSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/people/users/[userClientId]/page.tsx',
  'utf8'
);
const usersRequirementsSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/people/users/PAGE_REQUIREMENTS.md',
  'utf8'
);

test('people users route now keeps the route entry server-first and delegates interactivity to a local controller', () => {
  assert.doesNotMatch(usersPageSource, /^'use client';/m);
  assert.match(usersPageSource, /import PeopleUsersPageController from '\.\/page\.controller';/);
  assert.match(usersPageSource, /initialMode/);
  assert.match(usersPageSource, /initialSelectedUserClientId/);
});

test('people users controller syncs selected record and panel mode through query params', () => {
  assert.match(usersCopySource, /selected: 'selected'/);
  assert.match(usersCopySource, /mode: 'mode'/);
  assert.match(usersControllerSource, /updateRouteState/);
  assert.match(usersControllerSource, /router\.replace/);
  assert.match(usersControllerSource, /updateRouteState\('detail', userClientId\)/);
  assert.match(usersControllerSource, /updateRouteState\('invite'\)/);
});

test('people users deep link route redirects into the main surface instead of becoming a separate workflow page', () => {
  assert.match(usersDeepLinkSource, /\?selected=/);
  assert.match(usersDeepLinkSource, /mode=detail/);
});

test('people users requirements document the explicit empty detail invite panel modes', () => {
  assert.match(usersRequirementsSource, /### Modo `empty`/);
  assert.match(usersRequirementsSource, /### Modo `detail`/);
  assert.match(usersRequirementsSource, /### Modo `invite`/);
});
