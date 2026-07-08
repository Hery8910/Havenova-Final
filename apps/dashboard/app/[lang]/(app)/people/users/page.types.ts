import type { ReactNode } from 'react';
import type { TenantUserDetail, TenantUserListItem, TenantUserStatus } from '@/packages/types';

export type UsersPageMode = 'empty' | 'detail' | 'invite';

export type UsersPageControllerProps = {
  initialMode: UsersPageMode;
  initialSelectedUserClientId?: string;
};

export type UsersPageViewProps = {
  detail: ReactNode;
  detailLabel: string;
  directoryItems: TenantUserListItem[];
  directoryError?: string | null;
  directoryHint?: string;
  directorySectionLabel: string;
  directoryTitle: string;
  emptyDescription: string;
  emptyTitle: string;
  filters: {
    searchLabel: string;
    searchPlaceholder: string;
    searchValue: string;
    selectLabel: string;
    selectOptions: { value: string; label: string }[];
    selectValue: string;
  };
  header: {
    eyebrow?: string;
    title: string;
    description?: string;
    primaryActionLabel: string;
  };
  isDirectoryLoading?: boolean;
  mode: UsersPageMode;
  navigationLabel: string;
  onOpenInvite: () => void;
  onRetryDirectory?: () => void;
  onSearchChange: (value: string) => void;
  onSelectChange: (value: string) => void;
  onSelectUser: (userClientId: string) => void;
  selectedUserClientId?: string;
  summaryItems: { label: string; value: string | number }[];
  tenantUserLocale: string;
};

export type UsersPageDetailRouterProps = {
  detail: TenantUserDetail | null;
  error?: string | null;
  isLoading?: boolean;
  locale: string;
  mode: UsersPageMode;
  onReturnToDirectory: () => void;
  selectedUserClientId?: string;
};

export type UsersPageSearchState = {
  search: string;
  status: 'all' | TenantUserStatus;
};
