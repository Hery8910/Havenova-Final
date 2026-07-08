import type { TenantUserListItem } from '@/packages/types';
import { PersonStatusBadge } from '../shared';
import styles from './TenantUserDirectoryItem.module.css';

type TenantUserDirectoryItemProps = {
  item: TenantUserListItem;
  locale: string;
  isActive?: boolean;
  onSelect: (userClientId: string) => void;
};

export function TenantUserDirectoryItem({
  item,
  locale,
  isActive = false,
  onSelect,
}: TenantUserDirectoryItemProps) {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <button
      type="button"
      className={[styles.button, isActive ? styles.active : ''].filter(Boolean).join(' ')}
      onClick={() => onSelect(item.userClientId)}
    >
      <div className={styles.identity}>
        <p className={styles.name}>{item.name?.trim() || 'Pending profile'}</p>
        <p className={styles.meta}>{item.email}</p>
        {item.phone ? <p className={styles.meta}>{item.phone}</p> : null}
      </div>

      <div className={styles.footer}>
        <PersonStatusBadge
          status={item.userClientStatus}
          isVerified={item.isVerified}
          hasProfile={item.hasProfile}
          profileCompleteness={item.profileCompleteness}
        />
        <div className={styles.dateBlock}>
          <p className={styles.dateLabel}>Updated</p>
          <p className={styles.dateValue}>{formatter.format(new Date(item.updatedAt))}</p>
        </div>
      </div>
    </button>
  );
}
