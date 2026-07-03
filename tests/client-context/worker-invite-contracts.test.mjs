import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workerTypesSource = fs.readFileSync('packages/types/worker/workerTypes.ts', 'utf8');
const workerServiceSource = fs.readFileSync('packages/services/worker.ts', 'utf8');
const authTypesSource = fs.readFileSync('packages/types/auth/authTypes.ts', 'utf8');
const authServiceSource = fs.readFileSync('packages/services/auth/authService.ts', 'utf8');
const authBffRouteSource = fs.readFileSync('packages/services/bff/authBffRoute.ts', 'utf8');
const dashboardResendInviteRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/home-services/worker/resend-invite/route.ts',
  'utf8'
);
const dashboardEmployeesPageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/employees/page.tsx',
  'utf8'
);
const dashboardSetPasswordSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx',
  'utf8'
);

test('worker types align with backend contract additions for roles and resend-invite', () => {
  assert.match(workerTypesSource, /export type WorkerRole =/);
  assert.match(workerTypesSource, /roles\?: WorkerRole\[];/);
  assert.match(workerTypesSource, /export interface ResendWorkerInvitePayload/);
  assert.match(workerTypesSource, /export interface ResendWorkerInviteResponse/);
});

test('worker service exposes resend-invite over the same-origin worker BFF route', () => {
  assert.match(workerServiceSource, /export const resendWorkerInvite = async/);
  assert.match(workerServiceSource, /`\$\{WORKER_PROFILE_BASE_PATH\}\/resend-invite`/);
  assert.match(dashboardResendInviteRouteSource, /upstreamPath: '\/api\/home-services\/worker\/resend-invite'/);
  assert.match(dashboardEmployeesPageSource, /resendWorkerInvite/);
  assert.match(dashboardEmployeesPageSource, /onResendInvite=\{handleResendInvite\}/);
});

test('auth layer exposes invite-resolve for invitation preflight', () => {
  assert.match(authTypesSource, /export interface ResolveInvitePayload/);
  assert.match(authTypesSource, /export interface ResolveInviteResponse/);
  assert.match(authServiceSource, /export const resolveInvite = async/);
  assert.match(authServiceSource, /'\/api\/auth\/invite\/resolve'/);
  assert.match(authBffRouteSource, /'invite\/resolve': \{/);
});

test('dashboard set-password resolves invite tokens before final password submission', () => {
  assert.match(dashboardSetPasswordSource, /resolveInvite\(\{ inviteToken \}\)/);
  assert.match(dashboardSetPasswordSource, /const \[inviteResolved, setInviteResolved\] = useState\(false\);/);
  assert.match(dashboardSetPasswordSource, /loading \|\| Boolean\(inviteToken && !inviteResolved\)/);
});
