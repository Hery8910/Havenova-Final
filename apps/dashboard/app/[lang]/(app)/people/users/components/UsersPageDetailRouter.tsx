import { TenantUserDetailPanel } from '../../../components/people/users';
import { UsersEmptyPanel } from './UsersEmptyPanel';
import { UsersInvitePanel } from './UsersInvitePanel';
import type { UsersPageDetailRouterProps } from '../page.types';

export function UsersPageDetailRouter({
  copy,
  detail,
  error = null,
  feedback = null,
  invitationAction = null,
  invite,
  isLoading = false,
  locale,
  mode,
  onDetailRefresh,
  onReturnFromDetail,
  onResendInvitation,
  onReturnToDirectory,
  onRevokeInvitation,
  selectedEntryId,
}: UsersPageDetailRouterProps) {
  if (mode === 'invite') {
    return (
      <UsersInvitePanel
        copy={copy.invite}
        defaultLanguage={invite.defaultLanguage}
        isSubmitting={invite.isSubmitting}
        result={invite.result}
        onReturnToDirectory={onReturnToDirectory}
        onSubmit={invite.onSubmit}
      />
    );
  }

  if (mode === 'empty') {
    return <UsersEmptyPanel copy={copy.empty} />;
  }

  return (
    <TenantUserDetailPanel
      copy={copy.detail}
      locale={locale}
      entryId={selectedEntryId}
      detail={detail}
      isLoading={isLoading}
      error={error}
      feedback={feedback}
      invitationAction={invitationAction}
      onRetry={onDetailRefresh}
      onReturnToDirectory={onReturnFromDetail}
      onResendInvitation={onResendInvitation}
      onRevokeInvitation={onRevokeInvitation}
    />
  );
}
