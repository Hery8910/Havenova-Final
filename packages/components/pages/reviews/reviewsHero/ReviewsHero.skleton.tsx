// src/components/ReviewsHero.skeleton.tsx
import styles from './ReviewsHero.module.css';

const ReviewsHeroSkeleton = () => {
  return (
    <section className={styles.section} aria-busy="true">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={`${styles.skeleton} ${styles.skeletonHeadline}`} />
          <div className={`${styles.skeleton} ${styles.skeletonSubheadline}`} />
          <div className={`${styles.skeleton} ${styles.skeletonSubheadline}`} />
          <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
        </header>
        <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
      </div>
    </section>
  );
};

export default ReviewsHeroSkeleton;
