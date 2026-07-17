import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workerAppLayoutSource = fs.readFileSync('apps/worker/app/[lang]/(app)/layout.tsx', 'utf8');
const workerHomeSource = fs.readFileSync('apps/worker/app/[lang]/(app)/page.tsx', 'utf8');
const workerLoginSource = fs.readFileSync(
  'apps/worker/app/[lang]/(auth)/user/login/page.tsx',
  'utf8'
);
const workerAuthLayoutSource = fs.readFileSync(
  'apps/worker/app/[lang]/(auth)/user/layout.tsx',
  'utf8'
);
const sharedInvitationLoginSource = fs.readFileSync(
  'packages/components/client/user/auth/invitationLogin/InvitationLoginPage.tsx',
  'utf8'
);
const workerAuthContractSource = fs.readFileSync(
  'apps/worker/app/[lang]/(auth)/AUTH_FLOW_CONTRACT.md',
  'utf8'
);
const workerContextSource = fs.readFileSync('packages/contexts/worker/WorkerContext.tsx', 'utf8');
const workerProfileSource = fs.readFileSync(
  'apps/worker/app/[lang]/(app)/profile/page.tsx',
  'utf8'
);
const rootPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));

test('worker app mounts WorkerProvider behind worker-only access control', () => {
  assert.match(workerAppLayoutSource, /hasWorkerAccess/);
  assert.match(workerAppLayoutSource, /getServerAuthUser/);
  assert.match(workerAppLayoutSource, /initialAuth=\{auth\}/);
  assert.match(workerAppLayoutSource, /disableUnauthenticatedBootstrap/);
  assert.match(workerAppLayoutSource, /<WorkerProvider>/);
  assert.doesNotMatch(workerAppLayoutSource, /<AdminProvider>/);
  assert.doesNotMatch(workerAppLayoutSource, /hasDashboardAccess/);
});

test('worker auth login only auto-enters the app for worker sessions', () => {
  assert.match(workerLoginSource, /InvitationLoginPage app="worker"/);
  assert.match(workerAuthLayoutSource, /getServerAuthUser/);
  assert.match(workerAuthLayoutSource, /initialAuth=\{auth\}/);
  assert.match(workerAuthLayoutSource, /disableUnauthenticatedBootstrap/);
  assert.match(sharedInvitationLoginSource, /return auth\.role === 'worker';/);
  assert.doesNotMatch(workerLoginSource, /hasDashboardAccess/);
});

test('worker app documents the invitation-only auth model and protected home intent', () => {
  assert.match(workerAuthContractSource, /invitation-only activation variant/);
  assert.match(workerAuthContractSource, /AuthProvider \+ WorkerProvider/);
  assert.match(workerHomeSource, /Worker authentication is now isolated in its own app boundary/);
});

test('worker app exposes a protected profile surface on top of WorkerContext', () => {
  assert.match(workerProfileSource, /useWorker/);
  assert.match(workerProfileSource, /updateWorker/);
  assert.match(workerProfileSource, /LanguageSwitcher/);
  assert.match(workerProfileSource, /ThemeToggler/);
});

test('worker context keeps the same local continuity model as admin for complement bootstrap', () => {
  assert.match(workerContextSource, /readStoredTheme/);
  assert.match(workerContextSource, /getStoredLanguage/);
  assert.match(workerContextSource, /worker \?\? createLocalDefault\(null\)/);
  assert.doesNotMatch(workerContextSource, /if \(loading \|\| !worker\) return null/);
});

test('root workspace scripts include the worker app for dev and build', () => {
  assert.equal(rootPackage.scripts['dev:worker'], 'pnpm --filter @havenova/worker dev');
  assert.equal(rootPackage.scripts['build:worker'], 'pnpm --filter @havenova/worker build');
  assert.match(rootPackage.scripts.build, /@havenova\/worker build/);
});
