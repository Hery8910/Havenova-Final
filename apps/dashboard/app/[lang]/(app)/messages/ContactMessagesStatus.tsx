'use client';

import { ContactMessageStatus } from '@/packages/types';
import styles from './page.module.css';

interface ContactMessagesStatusProps {
  status?: ContactMessageStatus | '';
  totals: { total: number; pending: number; answered: number };
  statusLabel?: string;
  statusAll?: string;
  statusPending?: string;
  statusAnswered?: string;
  onChange: (status: ContactMessageStatus | '') => void;
}

export default function ContactMessagesStatus({
  status,
  totals,
  statusLabel,
  statusAll,
  statusPending,
  statusAnswered,
  onChange,
}: ContactMessagesStatusProps) {
  return (
    <section className={styles.buttons} aria-label={statusLabel || 'Status'}>
      <div className={`${styles.div} ${(status || '') === '' ? styles.divActive : ''}`}>
        <button
          className={styles.statusButton}
          type="button"
          aria-pressed={(status || '') === ''}
          onClick={() => onChange('')}
        >
          {statusAll || 'All'}
        </button>
        <span className={styles.badge}>{totals.total}</span>
      </div>
      <div className={`${styles.div} ${(status || '') === 'pending' ? styles.divActive : ''}`}>
        <button
          className={styles.statusButton}
          type="button"
          aria-pressed={(status || '') === 'pending'}
          onClick={() => onChange('pending')}
        >
          {statusPending || 'Pending'}
        </button>
        <span className={styles.badge}>{totals.pending}</span>
      </div>
      <div className={`${styles.div} ${(status || '') === 'answered' ? styles.divActive : ''}`}>
        <button
          className={styles.statusButton}
          type="button"
          aria-pressed={(status || '') === 'answered'}
          onClick={() => onChange('answered')}
        >
          {statusAnswered || 'Answered'}
        </button>
        <span className={styles.badge}>{totals.answered}</span>
      </div>
    </section>
  );
}
