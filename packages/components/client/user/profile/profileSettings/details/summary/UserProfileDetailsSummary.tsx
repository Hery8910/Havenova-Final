'use client';

import { FaUserEdit } from 'react-icons/fa';
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
      <div className={styles.wrapper}>
        <article className={styles.article}>
          <h3 id="profile-details-summary-title" className={`type-title-sm ${styles.title}`}>
            {title}
          </h3>
          <button
            type="button"
            className={`${styles.editButton} button button--outline button--outline-small`}
            onClick={onEdit}
            aria-label={editLabel}
          >
            <FaUserEdit /> {editLabel}
          </button>
        </article>
        <table className={styles.table} aria-label={tableAriaLabel}>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className={styles.tableRow}>
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
      </div>
    </section>
  );
}
