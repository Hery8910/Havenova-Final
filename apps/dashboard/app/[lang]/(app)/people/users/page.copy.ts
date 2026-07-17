import type { DirectorySelectOption, DirectorySummaryItem } from '../../components/directory';
import type { TenantUsersDirectorySummary } from '@/packages/types';
import type {
  UsersDetailPanelCopy,
  UsersDirectoryFeedbackCopy,
  UsersPageMode,
  UsersPageSearchState,
  UsersPageStatusFilter,
} from './page.types';

export const USERS_PAGE_QUERY_KEYS = {
  selected: 'selected',
  legacySelected: 'userClientId',
  mode: 'mode',
  search: 'search',
  status: 'status',
} as const;

export const usersPageCopy = {
  intro: {
    primaryActionLabel: 'Invite customer',
  },
  filters: {
    ariaLabel: 'Customer directory filters',
    searchLabel: 'Search customers',
    searchPlaceholder: 'Name, email, or phone',
    selectLabel: 'Status',
  },
  list: {
    sectionLabel: 'Directory',
    title: 'Customers',
    hint: 'Select a customer or invitation to review details.',
    emptyTitle: 'No customers yet.',
    emptyDescription: 'Invite a customer to start building the directory.',
    noResultsTitle: 'No customers match this view.',
    noResultsDescription: 'Try a different search or status filter.',
  },
  feedback: {
    loadingLabel: 'Loading customer directory...',
    refreshingLabel: 'Updating directory...',
    loadingMoreLabel: 'Loading more customers...',
    loadMoreFallbackLabel: 'Load more customers',
    endOfResultsLabel: 'End of results',
    errorTitle: 'We could not load the customer directory.',
    retryLabel: 'Try again',
    searchMinimumLabel: 'Enter at least two characters to search.',
  } satisfies UsersDirectoryFeedbackCopy,
  detail: {
    navigationLabel: 'Customers directory',
    detailLabel: 'Customer detail',
  },
  panels: {
    empty: {
      eyebrow: 'Panel',
      title: 'Select a customer to continue',
      description: 'Customer details and invitation actions are handled in this panel.',
      noteLabel: 'Current use',
      noteText: 'Select a record from the directory or open the invite flow from the left column.',
    },
    invite: {
      eyebrow: 'Invite',
      title: 'Invite a customer',
      description: 'Create a secure invitation for a customer without leaving the directory.',
      emailLabel: 'Email',
      nameLabel: 'Name',
      phoneLabel: 'Phone',
      languageLabel: 'Language',
      languageOptions: {
        de: 'German',
        en: 'English',
        es: 'Spanish',
      },
      submitLabel: 'Send invitation',
      submittingLabel: 'Sending...',
      returnActionLabel: 'Back to directory',
      invitedSuccessTitle: 'Invitation sent.',
      renewedSuccessTitle: 'Expired invitation renewed.',
      alreadyExistsError: 'This customer already has an account. Search for the email to open it.',
      alreadyPendingError: 'An active invitation already exists. Open Invitations to resend it.',
      deliveryFailedError:
        'The invitation was saved, but delivery failed. Refresh Invitations and resend it from the detail panel.',
      errorTitle: 'We could not send this invitation.',
    },
    detail: {
      emptyEyebrow: 'Detail',
      emptyTitle: 'Choose a customer',
      emptyDescription: 'Identity, access, invitations, and activity data will appear here.',
      loadingLabel: 'Loading customer detail...',
      errorEyebrow: 'Detail',
      errorTitle: 'We could not load this entry.',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      createdLabel: 'Created',
      statusLabel: 'Status',
      profileLabel: 'Profile',
      languageLabel: 'Language',
      addressLabel: 'Primary address',
      relationshipLabel: 'Relationship',
      requestsLabel: 'Requests',
      workOrdersUnavailableLabel: 'Work orders are not available yet.',
      nextAppointmentLabel: 'Next appointment',
      lastCompletedServiceLabel: 'Last completed service',
      invitationLabel: 'Invitation',
      invitationExpiresLabel: 'Expires',
      invitationLastSentLabel: 'Last sent',
      invitationSendCountLabel: 'Send count',
      pendingProfileFallback: 'Pending profile',
      missingValueFallback: 'Not provided',
      resendInvitationLabel: 'Resend invitation',
      resendingInvitationLabel: 'Resending invitation...',
      revokeInvitationLabel: 'Revoke invitation',
      revokingInvitationLabel: 'Revoking invitation...',
      revokeConfirmationTitle: 'Revoke this invitation?',
      revokeConfirmationDescription:
        'The invitation link will stop working immediately. You can create a new invitation later if needed.',
      revokeConfirmationConfirmLabel: 'Revoke invitation',
      revokeConfirmationCancelLabel: 'Keep invitation',
      actionSuccessTitle: 'Invitation action completed.',
      actionErrorTitle: 'We could not complete this invitation action.',
      returnToDirectoryLabel: 'Back to directory',
      retryLabel: 'Try again',
      availableLabel: 'Available',
      workOrdersLabel: 'Work orders',
      requestsSummaryTemplate: '{active} active of {total} total',
      statusLabels: {
        active: 'Active',
        inactive: 'Inactive',
        locked: 'Locked',
        invited: 'Invited',
        expired: 'Expired',
      },
      invitationStatusLabels: {
        pending: 'Pending',
        expired: 'Expired',
      },
      attentionReasons: {
        INVITATION_EXPIRED: 'Invitation expired',
        EMAIL_UNVERIFIED_STALE: 'Email verification is overdue',
        ACCOUNT_LOCKED: 'Account locked',
      },
    },
  } satisfies UsersDetailPanelCopy,
  directoryItem: {
    pendingProfileFallback: 'Pending profile',
    noRequestsFallback: 'No requests yet',
    nextAppointmentTemplate: 'Next: {date}',
    activeRequestsTemplate: '{count} active request',
    totalRequestsTemplate: '{count} total requests',
    lastServiceTemplate: 'Last service: {date}',
    statuses: {
      active: 'Active',
      inactive: 'Inactive',
      locked: 'Locked',
      invited: 'Invited',
      expired: 'Expired',
    },
    attentionReasons: {
      INVITATION_EXPIRED: 'Invitation expired',
      EMAIL_UNVERIFIED_STALE: 'Email verification is overdue',
      ACCOUNT_LOCKED: 'Account locked',
    },
  },
};

export const usersStatusOptions: DirectorySelectOption[] = [
  { value: 'all', label: 'All people' },
  { value: 'invitations', label: 'Invitations' },
];

export type UsersPageCopy = typeof usersPageCopy & {
  statusOptions: DirectorySelectOption[];
};

/**
 * Keeps the screen's default English copy as a narrow fallback while requiring
 * every runtime locale to provide the complete, typed directory vocabulary.
 */
export const createUsersPageCopy = (copy: UsersPageCopy) => copy;

export function parseUsersStatus(value?: string | null): UsersPageStatusFilter {
  if (value === 'invitations') {
    return value;
  }

  return 'all';
}

export function parseUsersSearchState(input: {
  search?: string | null;
  status?: string | null;
}): UsersPageSearchState {
  return {
    search: input.search?.trim() ?? '',
    status: parseUsersStatus(input.status),
  };
}

export function buildUsersSummary(
  summary: TenantUsersDirectorySummary | null,
  labels: { totalUsers: string; pendingInvites: string }
): (DirectorySummaryItem & { status: UsersPageStatusFilter })[] {
  return [
    {
      label: labels.totalUsers,
      value: summary?.totalUsers ?? '—',
      tone: 'primary',
      status: 'all',
    },
    {
      label: labels.pendingInvites,
      value: summary?.pendingInvites ?? '—',
      tone: 'secondary',
      status: 'invitations',
    },
  ];
}

export const resolveUsersPageMode = (
  requestedMode?: string | null,
  selectedEntryId?: string,
  fallbackMode: UsersPageMode = 'empty'
): UsersPageMode => {
  if (requestedMode === 'detail') {
    return selectedEntryId ? 'detail' : 'empty';
  }

  if (requestedMode === 'empty') {
    return 'empty';
  }

  if (selectedEntryId) {
    return 'detail';
  }

  return fallbackMode;
};
