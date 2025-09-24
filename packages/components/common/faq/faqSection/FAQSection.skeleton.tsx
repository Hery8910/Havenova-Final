import { FAQPreviewSkeleton } from '../faqPreview';
import styles from './FAQSection.module.css';

const FAQSectionSkeleton = () => (
  <section className={styles.section} aria-hidden="true">
    <header>
      <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
    </header>

    <FAQPreviewSkeleton />

    <aside className={styles.aside}>
      <div className={`${styles.skeleton} ${styles.skeletonSubtitle}`} />
      <div className={`${styles.skeleton} ${styles.skeletonCTA}`} />
    </aside>
  </section>
);

export default FAQSectionSkeleton;
