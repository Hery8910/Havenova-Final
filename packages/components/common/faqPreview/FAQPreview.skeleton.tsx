import styles from './FAQPreview.module.css';

const FAQPreviewSkeleton = () => (
  <section className={styles.section}>
    <header>
      <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
    </header>
    <ul className={styles.ul}>
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className={styles.li}>
          <div className={`${styles.skeleton} ${styles.skeletonQuestion}`} />
          <div className={`${styles.skeleton} ${styles.skeletonAnswer}`} />
          <div className={`${styles.skeleton} ${styles.skeletonAnswer}`} />
        </li>
      ))}
    </ul>
    <aside className={styles.aside}>
      <div className={`${styles.skeleton} ${styles.skeletonAnswer}`} />
      <div className={`${styles.skeleton} ${styles.skeletonCTA}`} />
    </aside>
  </section>
);

export default FAQPreviewSkeleton;
