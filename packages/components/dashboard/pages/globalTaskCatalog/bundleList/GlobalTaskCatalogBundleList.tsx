'use client';

import { GoDotFill } from 'react-icons/go';
import { CatalogBundleSummary } from '@/packages/types';
import styles from './GlobalTaskCatalogBundleList.module.css';

interface GlobalTaskCatalogBundleListTexts {
  title: string;
  empty: string;
  recurrenceLabel: string;
  areaLabel: string;
  stepsLabel: string;
  billablesLabel: string;
  statusActive: string;
  statusInactive: string;
}

interface GlobalTaskCatalogBundleListProps {
  bundles: CatalogBundleSummary[];
  selectedBundleId?: string | null;
  texts: GlobalTaskCatalogBundleListTexts;
  onSelect: (bundleId: string) => void;
}

const GlobalTaskCatalogBundleList = ({
  bundles,
  selectedBundleId,
  texts,
  onSelect,
}: GlobalTaskCatalogBundleListProps) => {
  if (!bundles.length) {
    return <div className={styles.emptyState}>{texts.empty}</div>;
  }

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h4>{texts.title}</h4>
      </header>
      <ul className={styles.list}>
        {bundles.map((bundle) => {
          const isSelected = selectedBundleId === bundle.bundleId;
          const statusLabel = bundle.isActive ? texts.statusActive : texts.statusInactive;

          return (
            <li
              key={bundle.bundleId}
              className={`${styles.card} card ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => onSelect(bundle.bundleId)}
            >
              <header className={styles.cardHeader}>
                <div>
                  <h5 className={styles.cardTitle}>{bundle.title}</h5>
                  <p className={styles.cardSubtext}>
                    {texts.recurrenceLabel}: {bundle.recurrence}
                  </p>
                </div>
                <span
                  className={`${styles.badge} ${
                    bundle.isActive ? styles.badgeActive : styles.badgeInactive
                  }`}
                >
                  {statusLabel} <GoDotFill />
                </span>
              </header>
              <div className={styles.meta}>
                <div>
                  <span className={styles.metaLabel}>{texts.areaLabel}</span>
                  <span className={styles.metaValue}>{bundle.area}</span>
                </div>
                <div>
                  <span className={styles.metaLabel}>{texts.stepsLabel}</span>
                  <span className={styles.metaValue}>{bundle.stepsCount}</span>
                </div>
                <div>
                  <span className={styles.metaLabel}>{texts.billablesLabel}</span>
                  <span className={styles.metaValue}>{bundle.billablesCount}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default GlobalTaskCatalogBundleList;
