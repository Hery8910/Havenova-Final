import styles from './PersonStatusBadge.module.css';
import type { TenantUserProfileCompleteness, TenantUserStatus } from '@/packages/types';

type PersonStatusBadgeProps = {
  status: TenantUserStatus;
  isVerified: boolean;
  hasProfile?: boolean;
  profileCompleteness?: TenantUserProfileCompleteness;
};

const statusLabels: Record<TenantUserStatus, string> = {
  active: 'Active',
  invited: 'Invited',
  blocked: 'Blocked',
};

const completenessLabels: Record<TenantUserProfileCompleteness, string> = {
  missing: 'Profile missing',
  partial: 'Profile partial',
  complete: 'Profile complete',
};

export function PersonStatusBadge({
  status,
  isVerified,
  hasProfile,
  profileCompleteness,
}: PersonStatusBadgeProps) {
  return (
    <div className={styles.group}>
      <span className={`${styles.badge} ${styles[`status-${status}`]}`}>{statusLabels[status]}</span>
      <span className={`${styles.badge} ${isVerified ? styles.verified : styles.unverified}`}>
        {isVerified ? 'Verified' : 'Unverified'}
      </span>
      {typeof hasProfile === 'boolean' ? (
        <span className={`${styles.badge} ${hasProfile ? styles.hasProfile : styles.noProfile}`}>
          {hasProfile ? completenessLabels[profileCompleteness ?? 'partial'] : 'No profile'}
        </span>
      ) : null}
    </div>
  );
}
