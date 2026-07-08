import { TenantUserDetailPanel } from '../../../components/people/users';
import { UsersEmptyPanel } from './UsersEmptyPanel';
import { UsersInvitePanel } from './UsersInvitePanel';
import type { UsersPageDetailRouterProps } from '../page.types';

export function UsersPageDetailRouter({
  detail,
  error = null,
  isLoading = false,
  locale,
  mode,
  onReturnToDirectory,
  selectedUserClientId,
}: UsersPageDetailRouterProps) {
  if (mode === 'invite') {
    return <UsersInvitePanel onReturnToDirectory={onReturnToDirectory} />;
  }

  if (mode === 'empty') {
    return <UsersEmptyPanel />;
  }

  return (
    <TenantUserDetailPanel
      locale={locale}
      userClientId={selectedUserClientId}
      detail={detail}
      isLoading={isLoading}
      error={error}
    />
  );
}
