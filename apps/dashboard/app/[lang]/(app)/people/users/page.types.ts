import type { ReactNode } from 'react';
import type {
  AppLanguage,
  InviteTenantUserPayload,
  TenantUserDirectoryDetail,
  TenantUserDirectoryEntry,
  TenantUsersDirectoryFilter,
} from '@/packages/types';

export type UsersPageMode = 'empty' | 'detail';
export type UsersPageStatusFilter = Extract<TenantUsersDirectoryFilter, 'all' | 'invitations'>;

export type UsersPageSearchState = {
  search: string;
  status: UsersPageStatusFilter;
};

export type UsersDirectoryFeedbackCopy = {
  loadingLabel: string;
  refreshingLabel: string;
  loadingMoreLabel: string;
  loadMoreFallbackLabel: string;
  endOfResultsLabel: string;
  errorTitle: string;
  retryLabel: string;
  searchMinimumLabel: string;
};

export type UsersDirectoryItemCopy = {
  pendingProfileFallback: string;
  noRequestsFallback: string;
  nextAppointmentTemplate: string;
  activeRequestsTemplate: string;
  totalRequestsTemplate: string;
  lastServiceTemplate: string;
  statuses: {
    active: string;
    inactive: string;
    locked: string;
    invited: string;
    expired: string;
  };
  attentionReasons: {
    INVITATION_EXPIRED: string;
    EMAIL_UNVERIFIED_STALE: string;
    ACCOUNT_LOCKED: string;
  };
};

export type UsersSummaryFeedbackCopy = {
  loadingLabel: string;
  errorLabel: string;
  retryLabel: string;
};

export type UsersDetailPanelCopy = {
  empty: {
    eyebrow: string;
    title: string;
    description: string;
    noteLabel: string;
    noteText: string;
  };
  invite: {
    eyebrow: string;
    title: string;
    description: string;
    emailLabel: string;
    nameLabel: string;
    phoneLabel: string;
    languageLabel: string;
    languageOptions: {
      de: string;
      en: string;
      es: string;
    };
    submitLabel: string;
    submittingLabel: string;
    returnActionLabel: string;
    invitedSuccessTitle: string;
    renewedSuccessTitle: string;
    alreadyExistsError: string;
    alreadyPendingError: string;
    deliveryFailedError: string;
    errorTitle: string;
  };
  detail: {
    emptyEyebrow: string;
    emptyTitle: string;
    emptyDescription: string;
    loadingLabel: string;
    errorEyebrow: string;
    errorTitle: string;
    personEyebrow: string;
    invitationEyebrow: string;
    identityLabel: string;
    proposedIdentityLabel: string;
    proposedIdentityDescription: string;
    emailLabel: string;
    phoneLabel: string;
    createdLabel: string;
    statusLabel: string;
    profileLabel: string;
    languageLabel: string;
    addressLabel: string;
    relationshipLabel: string;
    requestsLabel: string;
    workOrdersUnavailableLabel: string;
    nextAppointmentLabel: string;
    lastCompletedServiceLabel: string;
    invitationLabel: string;
    invitationExpiresLabel: string;
    invitationLastSentLabel: string;
    invitationSendCountLabel: string;
    pendingProfileFallback: string;
    missingValueFallback: string;
    profileNotCreatedDescription: string;
    profileIncompleteDescription: string;
    languageLabels: {
      de: string;
      en: string;
      es: string;
    };
    resendInvitationLabel: string;
    resendingInvitationLabel: string;
    revokeInvitationLabel: string;
    revokingInvitationLabel: string;
    revokeConfirmationTitle: string;
    revokeConfirmationDescription: string;
    revokeConfirmationConfirmLabel: string;
    revokeConfirmationCancelLabel: string;
    actionSuccessTitle: string;
    actionErrorTitle: string;
    returnToDirectoryLabel: string;
    retryLabel: string;
    availableLabel: string;
    workOrdersLabel: string;
    requestsSummaryTemplate: string;
    statusLabels: UsersDirectoryItemCopy['statuses'];
    invitationStatusLabels: {
      pending: string;
      expired: string;
    };
    attentionReasons: UsersDirectoryItemCopy['attentionReasons'];
  };
};

export type UsersPageControllerProps = {
  initialMode: UsersPageMode;
  initialSelectedEntryId?: string;
  initialSearchState: UsersPageSearchState;
};

export type UsersInviteSubmitResult = {
  ok: boolean;
  message: string;
  code?: string;
};

export type UsersPageViewProps = {
  detail: ReactNode;
  detailLabel: string;
  directoryFeedback: UsersDirectoryFeedbackCopy;
  directoryItems: TenantUserDirectoryEntry[];
  directoryError?: string | null;
  directoryHint?: string;
  directorySectionLabel: string;
  directoryTitle: string;
  directoryItemCopy: UsersDirectoryItemCopy;
  emptyDescription: string;
  emptyTitle: string;
  noResultsDescription: string;
  noResultsTitle: string;
  filters: {
    ariaLabel: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchValue: string;
    selectLabel: string;
    selectOptions: { value: string; label: string }[];
    selectValue: string;
  };
  hasNextPage?: boolean;
  isDirectoryLoading?: boolean;
  isDirectoryRefreshing?: boolean;
  isLoadingMore?: boolean;
  isSummaryLoading?: boolean;
  mode: UsersPageMode;
  navigationLabel: string;
  onLoadMore?: () => void;
  onRetryDirectory?: () => void;
  onRetrySummary?: () => void;
  onSearchChange: (value: string) => void;
  onRegisterEntryElement: (entryId: string, element: HTMLButtonElement | null) => void;
  onSelectChange: (value: string) => void;
  onSelectEntry: (entryId: string) => void;
  onSummarySelect: (status: UsersPageStatusFilter) => void;
  selectedEntryId?: string;
  summaryItems: {
    label: string;
    value: string | number;
    tone?: 'neutral' | 'primary' | 'secondary' | 'accent';
    status: UsersPageStatusFilter;
  }[];
  summaryError?: boolean;
  summaryFeedback: UsersSummaryFeedbackCopy;
};

export type UsersPageDetailRouterProps = {
  copy: UsersDetailPanelCopy;
  detail: TenantUserDirectoryDetail | null;
  error?: string | null;
  isLoading?: boolean;
  locale: string;
  mode: UsersPageMode;
  onDetailRefresh: () => void;
  onReturnFromDetail: () => void;
  selectedEntryId?: string;
};
