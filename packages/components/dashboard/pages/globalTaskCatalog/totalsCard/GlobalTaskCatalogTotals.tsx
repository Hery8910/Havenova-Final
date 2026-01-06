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
    <article className={`${styles.card} card`}>
      <span className={styles.label}>{texts.bundles}</span>
      <span className={styles.value}>{totals.bundles}</span>
    </article>
    <article className={`${styles.card} card`}>
      <span className={styles.label}>{texts.steps}</span>
      <span className={styles.value}>{totals.steps}</span>
    </article>
    <article className={`${styles.card} card`}>
      <span className={styles.label}>{texts.billables}</span>
      <span className={styles.value}>{totals.billables}</span>
    </article>
  </section>
);

export default GlobalTaskCatalogTotals;
