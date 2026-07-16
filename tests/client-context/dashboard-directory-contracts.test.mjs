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
const tenantUsersServiceSource = fs.readFileSync('packages/services/tenantUsers.ts', 'utf8');
const tenantUserDetailPanelSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/components/people/users/detail/TenantUserDetailPanel.tsx',
  'utf8'
);
const tenantUserDirectoryItemSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/components/people/users/TenantUserDirectoryItem.tsx',
  'utf8'
);
const masterDetailPageSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/components/masterDetail/MasterDetailPage.tsx',
  'utf8'
);
const masterDetailStylesSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/components/masterDetail/MasterDetailPage.module.css',
  'utf8'
);
const directoryListSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/components/directory/DirectoryList.tsx',
  'utf8'
);
const usersPageViewSource = fs.readFileSync(
  'apps/dashboard/app/[lang]/(app)/people/users/components/UsersPageView.tsx',
  'utf8'
);
const usersDirectoryCatalogs = ['en', 'es', 'de'].map((lang) =>
  JSON.parse(fs.readFileSync(`packages/i18n/${lang}/pages.json`, 'utf8')).dashboard.usersDirectory
);

const legacyBffRoutes = [
  'apps/dashboard/app/api/home-services/dashboard/users/route.ts',
  'apps/dashboard/app/api/home-services/dashboard/users/[userClientId]/route.ts',
  'apps/dashboard/app/api/home-services/dashboard/users/resend-invite/route.ts',
];

test('people users route now keeps the route entry server-first and delegates interactivity to a local controller', () => {
  assert.doesNotMatch(usersPageSource, /^'use client';/m);
  assert.match(usersPageSource, /import PeopleUsersPageController from '\.\/page\.controller';/);
  assert.match(usersPageSource, /initialMode/);
  assert.match(usersPageSource, /initialSelectedEntryId/);
});

test('people users controller syncs selected record and panel mode through query params', () => {
  assert.match(usersCopySource, /selected: 'selected'/);
  assert.match(usersCopySource, /mode: 'mode'/);
  assert.match(usersCopySource, /search: 'search'/);
  assert.match(usersCopySource, /status: 'status'/);
  assert.match(usersControllerSource, /updateRouteState/);
  assert.match(usersControllerSource, /router\.replace/);
  assert.match(
    usersControllerSource,
    /const handleSelectEntry = \(entryId: string\) => \{[\s\S]*?updateRouteState\('detail', entryId\);\s*\}/
  );
  assert.match(usersControllerSource, /updateRouteState\('invite'\)/);
});

test('people users consumes the V2 summary, directory and entry contract without V1 BFF fallbacks', () => {
  assert.match(tenantUsersServiceSource, /getTenantUsersDirectorySummary/);
  assert.match(tenantUsersServiceSource, /getTenantUsersDirectoryPage/);
  assert.match(tenantUsersServiceSource, /getTenantUserDirectoryDetail/);
  assert.match(tenantUsersServiceSource, /\/summary/);
  assert.match(tenantUsersServiceSource, /\/directory/);
  assert.match(tenantUsersServiceSource, /\/entries\//);
  assert.doesNotMatch(tenantUsersServiceSource, /getTenantUsers\(/);
  assert.doesNotMatch(tenantUsersServiceSource, /getTenantUserDetail\(/);
  legacyBffRoutes.forEach((route) => assert.equal(fs.existsSync(route), false));
});

test('tenant-user invitation mutations preserve stable success and error codes for the UI', () => {
  assert.match(tenantUsersServiceSource, /getTenantUserDirectoryErrorCode/);
  assert.match(tenantUsersServiceSource, /TENANT_USER_INVITATION_DELIVERY_FAILED/);
  assert.match(tenantUsersServiceSource, /return \{ code: data\.code, data: data\.data \};/);
  assert.match(usersControllerSource, /TENANT_USER_INVITATION_RENEWED/);
  assert.match(usersControllerSource, /TENANT_USER_ALREADY_EXISTS/);
  assert.match(usersControllerSource, /TENANT_USER_INVITATION_ALREADY_PENDING/);
  assert.match(usersControllerSource, /TENANT_USER_INVITATION_DELIVERY_FAILED/);
  assert.match(usersControllerSource, /setDetailFeedback/);
});

test('tenant-user invitation actions prevent duplicate submits and require an explicit revoke confirmation', () => {
  assert.match(usersControllerSource, /const \[invitationAction, setInvitationAction\]/);
  assert.match(usersControllerSource, /if \(invitationAction\) \{\s*return;\s*\}/);
  assert.match(tenantUserDetailPanelSource, /isRevokeConfirmationOpen/);
  assert.match(tenantUserDetailPanelSource, /revokeConfirmationTitle/);
  assert.match(tenantUserDetailPanelSource, /disabled=\{isInvitationActionSubmitting\}/);
});

test('people users protects incremental pages from a stale search or filter query', () => {
  assert.match(usersControllerSource, /const directoryQueryKey =/);
  assert.match(usersControllerSource, /directoryQueryKeyRef\.current === requestedDirectoryQueryKey/);
  assert.match(usersControllerSource, /directoryCacheRef/);
  assert.match(usersControllerSource, /cacheDirectoryPages/);
  assert.match(usersControllerSource, /clearDirectoryCache/);
  assert.match(usersControllerSource, /isLoadingMoreRef/);
});

test('people users loads more automatically and searches a bounded number of pages for a selected entry', () => {
  assert.match(directoryListSource, /IntersectionObserver/);
  assert.match(directoryListSource, /rootMargin: '240px 0px'/);
  assert.match(directoryListSource, /loadMoreSentinelRef/);
  assert.match(usersControllerSource, /MAX_RESTORE_PAGES = 8/);
  assert.match(usersControllerSource, /loadNextDirectoryPageRef/);
  assert.match(usersControllerSource, /restorePageAttemptsRef\.current < MAX_RESTORE_PAGES/);
});

test('people users restores a selected cached row with its semantic entry id and logical focus', () => {
  assert.match(tenantUserDirectoryItemSource, /forwardRef<HTMLButtonElement/);
  assert.match(usersControllerSource, /directoryEntryRefs/);
  assert.match(usersControllerSource, /registerDirectoryEntryElement/);
  assert.match(usersControllerSource, /scrollIntoView/);
  assert.match(usersControllerSource, /focus\(\{ preventScroll: true \}\)/);
});

test('people users uses the same route for a focused mobile detail and preserves selection on return', () => {
  assert.match(masterDetailPageSource, /mobileView/);
  assert.match(masterDetailStylesSource, /mobileNavigationHidden/);
  assert.match(masterDetailStylesSource, /mobileDetailHidden/);
  assert.match(usersControllerSource, /const handleReturnFromDetail/);
  assert.match(usersControllerSource, /pendingEntryRestoreRef\.current = routeSelectedEntryId/);
  assert.match(usersControllerSource, /params\.set\(USERS_PAGE_QUERY_KEYS\.mode, 'empty'\)/);
  assert.match(usersControllerSource, /onReturnFromDetail=\{handleReturnFromDetail\}/);
});

test('people users keeps summary loading and failure distinct from a real zero value', () => {
  assert.match(usersControllerSource, /isSummaryLoading/);
  assert.match(usersControllerSource, /summaryError/);
  assert.match(usersControllerSource, /texts\.pages\.dashboard\.usersDirectory\.summary/);
  assert.match(usersPageViewSource, /summaryFeedback\.loadingLabel/);
  assert.match(usersPageViewSource, /summaryFeedback\.errorLabel/);
  assert.match(usersCopySource, /summary\?\.totalUsers \?\? '—'/);
});

test('people users page restores directory filters from the URL and keeps shared list copy configurable', () => {
  assert.match(usersPageSource, /initialSearchState/);
  assert.match(usersControllerSource, /parseUsersSearchState/);
  assert.match(usersControllerSource, /USERS_PAGE_QUERY_KEYS\.search/);
  assert.match(usersControllerSource, /USERS_PAGE_QUERY_KEYS\.status/);
  assert.match(usersCopySource, /loadingLabel/);
  assert.match(usersCopySource, /retryLabel/);
});

test('people users keeps row and detail labels in typed copy instead of shared UI literals', () => {
  assert.match(usersCopySource, /directoryItem:/);
  assert.match(usersCopySource, /attentionReasons:/);
  assert.match(usersCopySource, /languageOptions:/);
  assert.match(usersControllerSource, /directoryItemCopy=\{usersPageCopy\.directoryItem\}/);
  assert.match(tenantUserDirectoryItemSource, /copy\.statuses/);
  assert.match(tenantUserDirectoryItemSource, /copy\.attentionReasons/);
  assert.match(tenantUserDetailPanelSource, /copy\.statusLabels/);
  assert.match(tenantUserDetailPanelSource, /copy\.attentionReasons/);
});

test('people users resolves its complete vocabulary from every locale catalog', () => {
  assert.match(usersControllerSource, /usersDirectory\.copy/);
  usersDirectoryCatalogs.forEach(({ copy }) => {
    assert.equal(typeof copy.filters.ariaLabel, 'string');
    assert.equal(copy.statusOptions.length, 5);
    assert.equal(typeof copy.directoryItem.attentionReasons.ACCOUNT_LOCKED, 'string');
    assert.equal(typeof copy.panels.invite.languageOptions.es, 'string');
    assert.equal(typeof copy.panels.detail.statusLabels.expired, 'string');
  });
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
