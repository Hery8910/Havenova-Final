import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workerTypesSource = fs.readFileSync('packages/types/worker/workerTypes.ts', 'utf8');
const workerServiceSource = fs.readFileSync('packages/services/worker.ts', 'utf8');
const tenantUsersServiceSource = fs.readFileSync('packages/services/tenantUsers.ts', 'utf8');
const authTypesSource = fs.readFileSync('packages/types/auth/authTypes.ts', 'utf8');
const authServiceSource = fs.readFileSync('packages/services/auth/authService.ts', 'utf8');
const authBffRouteSource = fs.readFileSync('packages/services/bff/authBffRoute.ts', 'utf8');
const dashboardTenantUsersResendInviteRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/home-services/dashboard/users/invitations/[invitationId]/resend/route.ts',
  'utf8'
);
const dashboardTenantUsersEntryRouteSource = fs.readFileSync(
  'apps/dashboard/app/api/home-services/dashboard/users/entries/[entryId]/route.ts',
  'utf8'
);
const clientTenantUserInvitationResolveRouteSource = fs.readFileSync(
  'apps/client/app/api/home-services/user-invitations/resolve/route.ts',
  'utf8'
);
const clientTenantUserInvitationAcceptRouteSource = fs.readFileSync(
  'apps/client/app/api/home-services/user-invitations/accept/route.ts',
  'utf8'
);
const dashboardUsersControllerSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/people/users/page.controller.tsx',
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

test('worker types align with backend contract additions for roles and resend-invite', () => {
  assert.match(workerTypesSource, /export type WorkerRole =/);
  assert.match(workerTypesSource, /roles\?: WorkerRole\[];/);
  assert.match(workerTypesSource, /export interface ResendWorkerInvitePayload/);
  assert.match(workerTypesSource, /export interface ResendWorkerInviteResponse/);
});

test('resend-invite contracts keep worker legacy flow and tenant users V2 invitation flow separate', () => {
  assert.match(workerServiceSource, /export const resendWorkerInvite = async/);
  assert.match(workerServiceSource, /`\$\{WORKER_PROFILE_BASE_PATH\}\/resend-invite`/);
  assert.match(tenantUsersServiceSource, /export const resendTenantUserInvitation = async/);
  assert.match(tenantUsersServiceSource, /\/invitations\/\$\{safeInvitationId\}\/resend/);
  assert.match(
    dashboardTenantUsersResendInviteRouteSource,
    /\/api\/home-services\/dashboard\/users\/invitations\/\$\{encodeURIComponent\(/
  );
  assert.match(dashboardUsersControllerSource, /getTenantUsersDirectoryPage/);
  assert.match(dashboardUsersControllerSource, /getTenantUserDirectoryDetail/);
  assert.match(dashboardTenantUsersEntryRouteSource, /\/api\/home-services\/dashboard\/users\/entries\//);
});

test('auth layer keeps legacy invite-resolve and exposes tenant user invitation V2 endpoints', () => {
  assert.match(authTypesSource, /export interface ResolveInvitePayload/);
  assert.match(authTypesSource, /export interface ResolveInviteResponse/);
  assert.match(authTypesSource, /export interface ResolveTenantUserInvitationPayload/);
  assert.match(authTypesSource, /export interface AcceptTenantUserInvitationPayload/);
  assert.match(authServiceSource, /export const resolveInvite = async/);
  assert.match(authServiceSource, /'\/api\/auth\/invite\/resolve'/);
  assert.match(authServiceSource, /export const resolveTenantUserInvitation = async/);
  assert.match(authServiceSource, /'\/api\/home-services\/user-invitations\/resolve'/);
  assert.match(authServiceSource, /export const acceptTenantUserInvitation = async/);
  assert.match(authServiceSource, /'\/api\/home-services\/user-invitations\/accept'/);
  assert.match(authBffRouteSource, /'invite\/resolve': \{/);
  assert.match(
    clientTenantUserInvitationResolveRouteSource,
    /upstreamPath: '\/api\/home-services\/user-invitations\/resolve'/
  );
  assert.match(
    clientTenantUserInvitationAcceptRouteSource,
    /upstreamPath: '\/api\/home-services\/user-invitations\/accept'/
  );
});

test('shared invitation set-password routes tui tokens to tenant user invitation V2', () => {
  assert.match(dashboardSetPasswordSource, /InvitationSetPasswordPage/);
  assert.match(sharedInvitationSetPasswordSource, /resolveInvite\(\{ inviteToken \}\)/);
  assert.match(sharedInvitationSetPasswordSource, /resolveTenantUserInvitation\(\{ inviteToken \}\)/);
  assert.match(sharedInvitationSetPasswordSource, /acceptTenantUserInvitation\(\{ inviteToken, newPassword: data\.password \}\)/);
  assert.match(sharedInvitationSetPasswordSource, /inviteToken\?\.startsWith\('tui_'\)/);
  assert.match(sharedInvitationSetPasswordSource, /const \[inviteResolved, setInviteResolved\] = useState\(false\);/);
  assert.match(
    sharedInvitationSetPasswordSource,
    /loading \|\| Boolean\(inviteToken && !inviteResolved\)/
  );
});
