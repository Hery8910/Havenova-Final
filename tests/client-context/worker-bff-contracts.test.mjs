import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workerServiceSource = fs.readFileSync('packages/services/worker.ts', 'utf8');
const sameOriginApiSource = fs.readFileSync('packages/services/api/sameOriginApi.ts', 'utf8');
const dashboardWorkersPageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/team/workers/page.tsx',
  'utf8'
);
const dashboardResetBaselineDocSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/docs/DASHBOARD_RESET_BASELINE_2026-07-04.md',
  'utf8'
);
const dashboardSetPasswordSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx',
  'utf8'
);
const sharedInvitationSetPasswordSource = fs.readFileSync(
  'packages/components/client/user/auth/invitationSetPassword/InvitationSetPasswordPage.tsx',
  'utf8'
);

test('worker services now use the same-origin client instead of the browser-direct API client', () => {
  assert.match(workerServiceSource, /import sameOriginApi from '\.\/api\/sameOriginApi';/);
  assert.doesNotMatch(workerServiceSource, /import api from '\.\/api\/api';/);
  assert.match(workerServiceSource, /sameOriginApi\.get<ApiResponse<WorkerRecord>>\(WORKER_PROFILE_BASE_PATH/);
  assert.match(
    workerServiceSource,
    /sameOriginApi\.get<ApiResponse<WorkerListItem\[]>>\(\s*`\$\{WORKER_PROFILE_BASE_PATH\}\/list`/s
  );
  assert.match(sameOriginApiSource, /withCredentials: true/);
});

test('dashboard no longer mounts worker BFF routes after the admin-only reset', () => {
  assert.equal(fs.existsSync('apps/dashboard/app/api/home-services/worker/route.ts'), false);
  assert.equal(fs.existsSync('apps/dashboard/app/api/home-services/worker/list/route.ts'), false);
  assert.equal(fs.existsSync('apps/dashboard/app/api/home-services/worker/[workerId]/route.ts'), false);
  assert.match(dashboardWorkersPageSource, /DashboardRoutePlaceholder/);
  assert.match(dashboardResetBaselineDocSource, /- `worker`/);
});

test('shared invitation set-password distinguishes reset and invitation tokens while dashboard stays a thin wrapper', () => {
  assert.match(dashboardSetPasswordSource, /InvitationSetPasswordPage/);
  assert.match(sharedInvitationSetPasswordSource, /const resetToken = searchParams\.get\('token'\);/);
  assert.match(sharedInvitationSetPasswordSource, /const inviteToken = searchParams\.get\('inviteToken'\);/);
  assert.match(
    sharedInvitationSetPasswordSource,
    /\.\.\.\(inviteToken \? \{ inviteToken \} : \{ token: resetToken as string \}\)/
  );
});
