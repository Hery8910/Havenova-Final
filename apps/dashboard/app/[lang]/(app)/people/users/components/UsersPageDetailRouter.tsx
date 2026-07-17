import { TenantUserDetailPanel } from '../../../components/people/users';
import { UsersEmptyPanel } from './UsersEmptyPanel';
import type { UsersPageDetailRouterProps } from '../page.types';

export function UsersPageDetailRouter({
  copy,
  detail,
  error = null,
  isLoading = false,
  locale,
  mode,
  onDetailRefresh,
  onReturnFromDetail,
  selectedEntryId,
}: UsersPageDetailRouterProps) {
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
      onRetry={onDetailRefresh}
      onReturnToDirectory={onReturnFromDetail}
    />
  );
}
