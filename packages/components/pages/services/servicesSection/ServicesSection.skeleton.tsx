import styles from './ServicesSection.module.css';

const ServiceCategoriesSkeleton = () => {
  return (
    <section className={styles.section} aria-busy="true">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={`${styles.skeleton} ${styles.skeletonHeading}`} />
          <div className={`${styles.skeleton} ${styles.skeletonText}`} />
        </header>

        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`${styles.card} ${styles.skeletonCard}`}>
              <div className={`${styles.skeleton} ${styles.skeletonIcon}`} />
              <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
              <div className={`${styles.skeleton} ${styles.skeletonText}`} />
              <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategoriesSkeleton;
