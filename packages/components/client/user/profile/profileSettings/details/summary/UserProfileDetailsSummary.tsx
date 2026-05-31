'use client';

import type { ProfileSummaryRow } from '../types';
import styles from './UserProfileDetailsSummary.module.css';

interface UserProfileDetailsSummaryProps {
  title: string;
  tableAriaLabel?: string;
  editLabel: string;
  onEdit: () => void;
  rows: ProfileSummaryRow[];
}

export function UserProfileDetailsSummary({
  title,
  tableAriaLabel,
  editLabel,
  onEdit,
  rows,
}: UserProfileDetailsSummaryProps) {
  return (
    <section className={styles.card} aria-labelledby="profile-details-summary-title">
      <header className={styles.header}>
        <h3 id="profile-details-summary-title" className={styles.title}>
          {title}
        </h3>

        <button
          type="button"
          className="button button--outline"
          onClick={onEdit}
          aria-label={editLabel}
        >
          {editLabel}
        </button>
      </header>

      <table className={styles.table} aria-label={tableAriaLabel}>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.key}
              className={`${styles.tableRow} ${index % 2 === 0 ? styles.tableRowEven : ''}`}
            >
              <th scope="row" className={styles.tableHeader}>
                {row.label}
              </th>
              <td className={`${styles.tableCell} ${row.isMuted ? styles.muted : ''}`}>
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
