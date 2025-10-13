// src/components/ServicesHero.skeleton.tsx
import styles from './ServicesHero.module.css';

const ServicesHeroSkeleton = () => {
  return (
    <section className={styles.section} aria-busy="true">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={`${styles.skeleton} ${styles.skeletonHeadline}`} />
          <div className={`${styles.skeleton} ${styles.skeletonText}`} />
        </header>
        <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
      </div>
    </section>
  );
};

export default ServicesHeroSkeleton;
