'use client';

import { useEffect, useRef } from 'react';
import { IoSearch } from 'react-icons/io5';
import styles from './DashboardSearchInput.module.css';

interface DashboardSearchInputProps {
  query: string;
  searchLabel?: string;
  placeholder?: string;
  debounceMs?: number;
  onQueryChange: (value: string) => void;
  onApply: () => void;
}

export default function DashboardSearchInput({
  query,
  searchLabel,
  placeholder,
  debounceMs = 400,
  onQueryChange,
  onApply,
}: DashboardSearchInputProps) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onApply();
    }, debounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [debounceMs, onApply, query]);

  return (
    <header className={styles.header}>
      <label className={`${styles.label} text-body-sm`}>
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
    </header>
  );
}
