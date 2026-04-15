import type { UserAddress } from '../../../../types';
import type { ProfileSummaryRow } from '../types';
import { UserProfileDetailsForm, type UserProfileDetailsFormProps } from '../form';
import styles from './UserProfileDetailsSummary.module.css';

interface UserProfileDetailsSummaryProps {
  eyebrow: string;
  editButtonLabel: string;
  tableAriaLabel: string;
  rows: ProfileSummaryRow[];
  onEdit: () => void;
  onAddressClick?: (address: UserAddress) => void;
  secondaryForm: UserProfileDetailsFormProps;
}

export function UserProfileDetailsSummary({
  eyebrow,
  editButtonLabel,
  tableAriaLabel,
  rows,
  onEdit,
  onAddressClick,
  secondaryForm,
}: UserProfileDetailsSummaryProps) {
  return (
    <section className={`${styles.card} card`} aria-labelledby="profile-details-title">
      <header className={styles.header}>
        <p className="type-eyebrow-primary">{eyebrow}</p>

        <button
          type="button"
          className="button-edit"
          onClick={onEdit}
          aria-label={editButtonLabel}
        >
          {editButtonLabel}
        </button>
      </header>

      <table className={styles.table} aria-label={tableAriaLabel}>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className={styles.tableRow}>
              <th scope="row" className={styles.tableHeader}>
                {row.label}
              </th>
              <td className={`${styles.tableCell} ${row.isMuted ? styles.muted : ''}`}>
                {row.address && onAddressClick ? (
                  <button
                    type="button"
                    className={styles.addressButton}
                    onClick={() => onAddressClick(row.address as UserAddress)}
                  >
                    {row.value}
                  </button>
                ) : (
                  row.value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UserProfileDetailsForm {...secondaryForm} />
    </section>
  );
}
