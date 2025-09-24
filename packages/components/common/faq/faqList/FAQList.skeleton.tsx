import { FAQPreviewSkeleton } from '../faqPreview';
import styles from './FAQList.module.css';

const FAQListSkeleton = () => (
  <section className={styles.section} aria-busy="true">
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <li className={styles.navLi} key={idx}>
            <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
          </li>
        ))}
      </ul>
    </nav>

    <aside className={styles.aside}>
      <div className={`${styles.skeleton} ${styles.skeletonHeadline}`} />
      <ul className={styles.skeletonList}>
        <FAQPreviewSkeleton />
      </ul>
    </aside>
  </section>
);

export default FAQListSkeleton;
