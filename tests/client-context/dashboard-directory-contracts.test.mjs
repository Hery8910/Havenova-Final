import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const controller = read('apps/dashboard/app/[lang]/(app)/people/users/page.controller.tsx');
const copy = read('apps/dashboard/app/[lang]/(app)/people/users/page.copy.ts');
const service = read('packages/services/tenantUsers.ts');
const row = read(
  'apps/dashboard/app/[lang]/(app)/components/people/users/TenantUserDirectoryItem.tsx'
);
const detail = read(
  'apps/dashboard/app/[lang]/(app)/components/people/users/detail/TenantUserDetailPanel.tsx'
);
const list = read('apps/dashboard/app/[lang]/(app)/components/directory/DirectoryList.tsx');
const view = read('apps/dashboard/app/[lang]/(app)/people/users/components/UsersPageView.tsx');

test('Users Slice A uses only the read directory endpoints through the same-origin service', () => {
  assert.match(service, /getTenantUsersDirectorySummary/);
  assert.match(service, /getTenantUsersDirectoryPage/);
  assert.match(service, /getTenantUserDirectoryDetail/);
  assert.match(service, /\/summary/);
  assert.match(service, /\/directory/);
  assert.match(service, /\/entries\//);
  assert.doesNotMatch(
    controller,
    /inviteTenantUser|resendTenantUserInvitation|revokeTenantUserInvitation/
  );
});

test('Users Slice A restricts filters and summary to All and Invitations', () => {
  assert.match(copy, /value: 'all', label: 'All people'/);
  assert.match(copy, /value: 'invitations', label: 'Invitations'/);
  assert.doesNotMatch(copy, /value: 'attention'/);
  assert.doesNotMatch(copy, /value: 'active'/);
  assert.match(copy, /pendingInvites/);
  assert.doesNotMatch(copy, /labels\.needsAttention/);
  assert.match(controller, /option\.value === 'all' \|\| option\.value === 'invitations'/);
});

test('Users Slice A protects cursor results from stale queries and restores row focus after mobile return', () => {
  assert.match(controller, /directoryQueryKeyRef\.current === requestedDirectoryQueryKey/);
  assert.match(controller, /directoryCacheRef/);
  assert.match(controller, /isLoadingMoreRef/);
  assert.match(controller, /pendingEntryRestoreRef\.current = routeSelectedEntryId/);
  assert.match(controller, /focus\(\{ preventScroll: true \}\)/);
  assert.match(row, /forwardRef<HTMLButtonElement/);
});

test('Users Slice A exposes honest inline directory states and only minimal row and overview data', () => {
  assert.match(list, /aria-live="polite"/);
  assert.match(list, /role="alert"/);
  assert.match(copy, /searchMinimumLabel/);
  assert.match(controller, /normalizedDebouncedSearch\.length >= 2/);
  assert.match(row, /item\.email/);
  assert.match(row, /item\.phone/);
  assert.doesNotMatch(row, /relationshipSummary|attentionReasons|accountStatus/);
  assert.match(detail, /detail\.identity\.email/);
  assert.match(detail, /invitation\.expiresAt/);
  assert.doesNotMatch(
    detail,
    /availableActions|relationshipSummary|resendInvitation|revokeInvitation/
  );
  assert.doesNotMatch(view, /onOpenInvite|primaryActionLabel/);
});
