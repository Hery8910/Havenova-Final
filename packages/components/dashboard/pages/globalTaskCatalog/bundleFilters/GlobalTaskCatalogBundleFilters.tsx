'use client';

import { DashboardSearchInput } from '../../../filters';
import type { AreaKey, RecurrenceKey } from '@/packages/types';
import styles from './GlobalTaskCatalogBundleFilters.module.css';

interface GlobalTaskCatalogBundleFiltersTexts {
  searchPlaceholder: string;
  statusLabel: string;
  statusAll: string;
  statusActive: string;
  statusInactive: string;
  recurrenceLabel: string;
  areaLabel: string;
  resetLabel: string;
  recurrenceKeys: Record<string, string>;
  areaKeys: Record<string, string>;
}

export interface GlobalTaskCatalogBundleFiltersValue {
  status: '' | 'active' | 'inactive';
  title: string;
  recurrenceKey: '' | RecurrenceKey;
  areaKey: '' | AreaKey;
}

interface GlobalTaskCatalogBundleFiltersProps {
  values: GlobalTaskCatalogBundleFiltersValue;
  searchQuery: string;
  texts: GlobalTaskCatalogBundleFiltersTexts;
  onSearchChange: (value: string) => void;
  onSearchApply: () => void;
  onChange: (next: Partial<GlobalTaskCatalogBundleFiltersValue>) => void;
  onReset: () => void;
}

const GlobalTaskCatalogBundleFilters = ({
  values,
  searchQuery,
  texts,
  onSearchChange,
  onSearchApply,
  onChange,
  onReset,
}: GlobalTaskCatalogBundleFiltersProps) => {
  const recurrenceOptions = Object.entries(texts.recurrenceKeys || {});
  const areaOptions = Object.entries(texts.areaKeys || {});

  return (
    <section className={styles.section}>
      <aside className={styles.search}>
        <DashboardSearchInput
          query={searchQuery}
          placeholder={texts.searchPlaceholder}
          onQueryChange={onSearchChange}
          onApply={onSearchApply}
        />
        <button className={styles.reset} type="button" onClick={onReset}>
          {texts.resetLabel}
        </button>
      </aside>
      <article className={styles.controls}>
        <label className={styles.label}>
          {texts.statusLabel}
          <select
            className={styles.select}
            value={values.status}
            onChange={(event) =>
              onChange({ status: event.target.value as 'active' | 'inactive' | '' })
            }
          >
            <option value="">{texts.statusAll}</option>
            <option value="active">{texts.statusActive}</option>
            <option value="inactive">{texts.statusInactive}</option>
          </select>
        </label>
        <label className={styles.label}>
          {texts.recurrenceLabel}
          <select
            className={styles.select}
            value={values.recurrenceKey}
            onChange={(event) =>
              onChange({ recurrenceKey: event.target.value as '' | RecurrenceKey })
            }
          >
            <option value="">{texts.statusAll}</option>
            {recurrenceOptions.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          {texts.areaLabel}
          <select
            className={styles.select}
            value={values.areaKey}
            onChange={(event) => onChange({ areaKey: event.target.value as '' | AreaKey })}
          >
            <option value="">{texts.statusAll}</option>
            {areaOptions.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </article>
    </section>
  );
};

export default GlobalTaskCatalogBundleFilters;
