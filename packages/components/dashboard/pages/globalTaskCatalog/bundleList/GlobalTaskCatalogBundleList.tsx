'use client';

import { CatalogBundleSummary } from '@/packages/types';
import styles from './GlobalTaskCatalogBundleList.module.css';
import { StatusBadge } from '../../../statusBadge';
import { RecurrenceBadge } from '../../../recurrenceBadge';
import { AreaBadge } from '../../../areaBadge';
import { DashboardLoadMore } from '../../../pagination';
import {
  GlobalTaskCatalogBundleFilters,
  type GlobalTaskCatalogBundleFiltersValue,
} from '../bundleFilters';

interface GlobalTaskCatalogBundleListTexts {
  title: string;
  empty: string;
  loading: string;
  recurrenceLabel: string;
  areaLabel: string;
  stepsLabel: string;
  billablesLabel: string;
  statusActive: string;
  statusInactive: string;
  recurrenceKeys: Record<string, string>;
  areaKeys: Record<string, string>;
  filters: {
    searchPlaceholder: string;
    statusLabel: string;
    statusAll: string;
    statusActive: string;
    statusInactive: string;
    recurrenceLabel: string;
    areaLabel: string;
    resetLabel: string;
  };
  pagination: {
    loadMoreLabel: string;
    loadingLabel: string;
  };
}

interface GlobalTaskCatalogBundleListProps {
  bundles: CatalogBundleSummary[];
  selectedBundleId?: string | null;
  loading?: boolean;
  hasMore?: boolean;
  filters: GlobalTaskCatalogBundleFiltersValue;
  searchQuery: string;
  texts: GlobalTaskCatalogBundleListTexts;
  onSearchChange: (value: string) => void;
  onSearchApply: () => void;
  onFilterChange: (next: Partial<GlobalTaskCatalogBundleFiltersValue>) => void;
  onResetFilters: () => void;
  onLoadMore: () => void;
  onSelect: (bundleId: string) => void;
}

const GlobalTaskCatalogBundleList = ({
  bundles,
  texts,
  onSelect,
  loading = false,
  hasMore = false,
  filters,
  searchQuery,
  onSearchChange,
  onSearchApply,
  onFilterChange,
  onResetFilters,
  onLoadMore,
}: GlobalTaskCatalogBundleListProps) => {
  const normalizeKey = (value: string) =>
    value
      .trim()
      .toUpperCase()
      .replace(/[^A-Z]/g, '_');

  return (
    <section className={styles.section}>
      <GlobalTaskCatalogBundleFilters
        values={filters}
        searchQuery={searchQuery}
        texts={{
          searchPlaceholder: texts.filters.searchPlaceholder,
          statusLabel: texts.filters.statusLabel,
          statusAll: texts.filters.statusAll,
          statusActive: texts.filters.statusActive,
          statusInactive: texts.filters.statusInactive,
          recurrenceLabel: texts.filters.recurrenceLabel,
          areaLabel: texts.filters.areaLabel,
          resetLabel: texts.filters.resetLabel,
          recurrenceKeys: texts.recurrenceKeys,
          areaKeys: texts.areaKeys,
        }}
        onSearchChange={onSearchChange}
        onSearchApply={onSearchApply}
        onChange={onFilterChange}
        onReset={onResetFilters}
      />
      {loading && !bundles.length ? (
        <div className={styles.emptyState}>{texts.loading}</div>
      ) : !bundles.length ? (
        <div className={styles.emptyState}>{texts.empty}</div>
      ) : (
        <div className={styles.wrapper}>
          <ul className={styles.list}>
            {bundles.map((bundle) => {
              const statusLabel = bundle.isActive ? texts.statusActive : texts.statusInactive;
              const recurrenceKey = normalizeKey(bundle.recurrenceKey || bundle.recurrence);
              const areaKey = normalizeKey(bundle.areaKey || bundle.area);
              const recurrenceLabel = texts.recurrenceKeys?.[recurrenceKey] ?? bundle.recurrence;
              const areaLabel = texts.areaKeys?.[areaKey] ?? bundle.area;

              return (
                <li
                  key={bundle.bundleId}
                  className={`${styles.card} card`}
                  onClick={() => onSelect(bundle.bundleId)}
                >
                  <header className={styles.cardHeader}>
                    <aside className={styles.badgeGroup}>
                      <StatusBadge label={statusLabel} isActive={bundle.isActive} />
                      <RecurrenceBadge value={recurrenceKey} label={recurrenceLabel} />
                      <AreaBadge value={areaKey} label={areaLabel} />
                    </aside>
                    <h5 className={styles.cardTitle}>{bundle.title}</h5>
                  </header>
                  <article className={styles.meta}>
                    <div className={styles.metaDiv}>
                      <span className={styles.metaLabel}>{texts.stepsLabel}</span>
                      <span className={styles.metaValue}>{bundle.stepsCount}</span>
                    </div>
                    <div className={styles.metaDiv}>
                      <span className={styles.metaLabel}>{texts.billablesLabel}</span>
                      <span className={styles.metaValue}>{bundle.billablesCount}</span>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          <DashboardLoadMore
            hasMore={hasMore}
            loading={loading}
            label={texts.pagination.loadMoreLabel}
            loadingLabel={texts.pagination.loadingLabel}
            onLoadMore={onLoadMore}
          />
        </div>
      )}
    </section>
  );
};

export default GlobalTaskCatalogBundleList;
