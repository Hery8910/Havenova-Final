'use client';

import { CatalogTotals } from '@/packages/types';
import styles from './GlobalTaskCatalogTotals.module.css';

interface GlobalTaskCatalogTotalsTexts {
  title: string;
  bundles: string;
  steps: string;
  billables: string;
}

interface GlobalTaskCatalogTotalsProps {
  totals: CatalogTotals;
  texts: GlobalTaskCatalogTotalsTexts;
}

const GlobalTaskCatalogTotals = ({ totals, texts }: GlobalTaskCatalogTotalsProps) => (
  <section className={styles.section}>
    <header className={styles.header}>
      <h4>{texts.title}</h4>
    </header>
    <div className={styles.grid}>
      <article className={`${styles.card} card`}>
        <span className={styles.value}>{totals.bundles}</span>
        <span className={styles.label}>{texts.bundles}</span>
      </article>
      <article className={`${styles.card} card`}>
        <span className={styles.value}>{totals.steps}</span>
        <span className={styles.label}>{texts.steps}</span>
      </article>
      <article className={`${styles.card} card`}>
        <span className={styles.value}>{totals.billables}</span>
        <span className={styles.label}>{texts.billables}</span>
      </article>
    </div>
  </section>
);

export default GlobalTaskCatalogTotals;
