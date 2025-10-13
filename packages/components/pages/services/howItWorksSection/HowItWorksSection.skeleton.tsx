import styles from './HowItWorksSection.module.css';

const HowItWorksSectionSkeleton = () => {
  return (
    <section className={styles.section} aria-busy="true">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={`${styles.skeleton} ${styles.skeletonHeading}`} />
        </header>

        <div className={styles.steps}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.step}>
              <div className={`${styles.skeleton} ${styles.skeletonNumber}`} />
              <div className={styles.stepContent}>
                <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                <div className={`${styles.skeleton} ${styles.skeletonText}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSectionSkeleton;
