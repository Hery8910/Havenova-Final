import { IoSearch } from 'react-icons/io5';
import styles from './RequestsToolbar.module.css';
import { RequestFilters } from '@/packages/services/workRequest';

interface RequestsToolbarProps {
  filters: RequestFilters;
  onChange: (key: keyof RequestFilters, value: string) => void;
}

export default function RequestsToolbar({ filters, onChange }: RequestsToolbarProps) {
  return (
    <section className={styles.section}>
      {/* Search */}
      <div className={styles.search}>
        <p className={styles.icon}>
          <IoSearch />
        </p>
        <input
          className={styles.search_input}
          type="text"
          placeholder="Search by name or address..."
          value={filters.search || ''}
          onChange={(e) => onChange('search', e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className={styles.status}>
        <label className={styles.label}>Status</label>
        <select
          className={styles.status_input}
          name="status"
          id="status"
          value={filters.status || ''}
          onChange={(e) => onChange('status', e.target.value)}
        >
          <option id="all" value="">
            All
          </option>
          <option id="pending" value="pending">
            Pending
          </option>
          <option id="in_review" value="in_review">
            In Review
          </option>
          <option id="scheduled" value="scheduled">
            Scheduled
          </option>
          <option id="completed" value="completed">
            Completed
          </option>
          <option id="cancelled" value="cancelled">
            Cancelled
          </option>
        </select>
      </div>

      {/* Date Filter */}
      <div className={styles.date}>
        <label className={styles.label}>Date</label>
        <input
          className={styles.date_input}
          name="date"
          id="date"
          type="date"
          value={filters.date || ''}
          onChange={(e) => onChange('date', e.target.value)}
        />
      </div>
    </section>
  );
}
