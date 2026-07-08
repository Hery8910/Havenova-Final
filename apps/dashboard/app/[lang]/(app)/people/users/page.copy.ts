import type { DirectorySelectOption, DirectorySummaryItem } from '../../components/directory';
import type { TenantUserListItem } from '@/packages/types';
import type { UsersPageMode } from './page.types';

export const USERS_PAGE_QUERY_KEYS = {
  selected: 'selected',
  legacySelected: 'userClientId',
  mode: 'mode',
} as const;

export const usersPageCopy = {
  intro: {
    eyebrow: 'People',
    title: 'Tenant users',
    description: 'Manage the tenant user branch with a reusable directory and detail surface.',
    primaryActionLabel: 'Invite user',
  },
  filters: {
    searchLabel: 'Search users',
    searchPlaceholder: 'Search by name, email, or phone',
    selectLabel: 'Status',
  },
  list: {
    sectionLabel: 'Directory',
    title: 'Users list',
    hint: 'Select a record to update the detail panel.',
    emptyTitle: 'No tenant users found.',
    emptyDescription: 'This directory is ready to receive richer actions and detail states.',
  },
  detail: {
    navigationLabel: 'Tenant users directory',
    detailLabel: 'Tenant user detail',
  },
};

export const usersStatusOptions: DirectorySelectOption[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'invited', label: 'Invited' },
  { value: 'blocked', label: 'Blocked' },
];

export function buildUsersSummary(input: {
  items: TenantUserListItem[];
  total: number;
}): DirectorySummaryItem[] {
  const invitedCount = input.items.filter((item) => item.userClientStatus === 'invited').length;
  const activeCount = input.items.filter((item) => item.userClientStatus === 'active').length;

  return [
    { label: 'Total users', value: input.total },
    { label: 'Invited in result', value: invitedCount },
    { label: 'Active in result', value: activeCount },
  ];
}

export const resolveUsersPageMode = (
  requestedMode?: string | null,
  selectedUserClientId?: string,
  fallbackMode: UsersPageMode = 'empty'
): UsersPageMode => {
  if (requestedMode === 'invite') {
    return 'invite';
  }

  if (requestedMode === 'detail') {
    return selectedUserClientId ? 'detail' : 'empty';
  }

  if (requestedMode === 'empty') {
    return 'empty';
  }

  if (selectedUserClientId) {
    return 'detail';
  }

  return fallbackMode;
};
