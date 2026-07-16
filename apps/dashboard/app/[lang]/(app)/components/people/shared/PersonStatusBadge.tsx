import styles from './PersonStatusBadge.module.css';

type PersonStatusBadgeProps = {
  status: 'active' | 'inactive' | 'locked' | 'invited' | 'expired' | 'attention';
  label: string;
};

export function PersonStatusBadge({ status, label }: PersonStatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[`status-${status}`]}`}>
      {label}
    </span>
  );
}
