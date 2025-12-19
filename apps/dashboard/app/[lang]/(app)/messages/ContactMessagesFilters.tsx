'use client';

import { IoSearch } from 'react-icons/io5';
import styles from './page.module.css';

interface ContactMessagesFiltersProps {
  query: string;
  searchLabel?: string;
  placeholder?: string;
  applyLabel?: string;
  onQueryChange: (value: string) => void;
  onApply: () => void;
}

export default function ContactMessagesFilters({
  query,
  searchLabel,
  placeholder,
  applyLabel,
  onQueryChange,
  onApply,
}: ContactMessagesFiltersProps) {
  return (
    <header className={styles.header}>
      <label className={styles.label}>
        <IoSearch aria-hidden="true" />
        <span className={styles.srOnly}>{searchLabel || 'Search'}</span>
        <input
          className={styles.input}
          name="search"
          id="search"
          type="text"
          value={query}
          placeholder={placeholder}
          aria-label={searchLabel || placeholder || 'Search'}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </label>
      <button className={styles.button} type="button" onClick={onApply}>
        {applyLabel || 'Apply'}
      </button>
    </header>
  );
}
