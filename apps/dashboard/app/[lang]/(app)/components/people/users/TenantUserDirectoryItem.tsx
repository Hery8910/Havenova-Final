import { forwardRef } from 'react';

import type { TenantUserDirectoryEntry } from '@/packages/types';
import styles from './TenantUserDirectoryItem.module.css';
import type { UsersDirectoryItemCopy } from '../../../people/users/page.types';

type TenantUserDirectoryItemProps = {
  item: TenantUserDirectoryEntry;
  copy: UsersDirectoryItemCopy;
  isActive?: boolean;
  onSelect: (entryId: string) => void;
};

const getLifecycleLabel = (item: TenantUserDirectoryEntry, copy: UsersDirectoryItemCopy) => {
  if (item.kind !== 'invitation') {
    return null;
  }

  return item.invitationStatus === 'expired' ? copy.statuses.expired : copy.statuses.invited;
};

export const TenantUserDirectoryItem = forwardRef<HTMLButtonElement, TenantUserDirectoryItemProps>(
  function TenantUserDirectoryItem({ item, copy, isActive = false, onSelect }, ref) {
    const lifecycleLabel = getLifecycleLabel(item, copy);

    return (
      <button
        ref={ref}
        type="button"
        className={[styles.button, isActive ? styles.active : ''].filter(Boolean).join(' ')}
        aria-current={isActive ? 'true' : undefined}
        onClick={() => onSelect(item.entryId)}
      >
        <div className={styles.content}>
          <div className={styles.identity}>
            <p className={styles.name}>{item.displayName?.trim() || copy.pendingProfileFallback}</p>
            <p className={styles.meta}>{item.email}</p>
            {item.phone ? <p className={styles.meta}>{item.phone}</p> : null}
          </div>

          {lifecycleLabel ? <div className={styles.statusColumn}>{lifecycleLabel}</div> : null}
        </div>
      </button>
    );
  }
);
