import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workerServiceSource = fs.readFileSync('packages/services/worker.ts', 'utf8');
const sameOriginApiSource = fs.readFileSync('packages/services/api/sameOriginApi.ts', 'utf8');
const dashboardWorkerRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/home-services/worker/route.ts',
  'utf8'
);
const dashboardWorkerListRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/home-services/worker/list/route.ts',
  'utf8'
);
const dashboardWorkerItemRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/home-services/worker/[workerId]/route.ts',
  'utf8'
);
const dashboardSetPasswordSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(auth)/user/set-password/page.tsx',
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

test('dashboard mounts worker BFF routes for worker profile, list, and detail endpoints', () => {
  assert.match(dashboardWorkerRouteSource, /proxyBackendRoute/);
  assert.match(dashboardWorkerRouteSource, /upstreamPath: '\/api\/home-services\/worker'/);
  assert.match(dashboardWorkerListRouteSource, /upstreamPath: '\/api\/home-services\/worker\/list'/);
  assert.match(
    dashboardWorkerItemRouteSource,
    /upstreamPath: `\/api\/home-services\/worker\/\$\{encodeURIComponent\(workerId\)\}`/
  );
});

test('dashboard set-password distinguishes reset and invitation tokens', () => {
  assert.match(dashboardSetPasswordSource, /const resetToken = searchParams\.get\('token'\);/);
  assert.match(dashboardSetPasswordSource, /const inviteToken = searchParams\.get\('inviteToken'\);/);
  assert.match(
    dashboardSetPasswordSource,
    /\.\.\.\(inviteToken \? \{ inviteToken \} : \{ token: resetToken as string \}\)/
  );
});
