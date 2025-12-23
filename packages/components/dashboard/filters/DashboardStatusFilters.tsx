'use client';

import styles from './DashboardStatusFilters.module.css';

export interface DashboardStatusFilterItem<T = string> {
  label: string;
  value: T;
  total: number;
}

interface DashboardStatusFiltersProps<T = string> {
  items: DashboardStatusFilterItem<T>[];
  activeValue: T;
  onChange: (value: T) => void;
}

export default function DashboardStatusFilters<T = string>({
  items,
  activeValue,
  onChange,
}: DashboardStatusFiltersProps<T>) {
  return (
    <section className={styles.buttons}>
      {items.map((item) => {
        const isActive = item.value === activeValue;
        return (
          <div
            key={String(item.value)}
            className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
          >
            <button
              className={styles.statusButton}
              type="button"
              onClick={() => onChange(item.value)}
            >
              {item.label}
            </button>
            <span className={styles.badge}>{item.total}</span>
          </div>
        );
      })}
    </section>
  );
}
