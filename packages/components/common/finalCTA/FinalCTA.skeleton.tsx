import styles from './FinalCTA.module.css';

const FinalCTASkeleton = () => {
  return (
    <section className={styles.section} aria-labelledby="final-cta-skeleton">
      <div className={`${styles.skeleton} ${styles.skeletonHeadline}`} />
      <div className={`${styles.skeleton} ${styles.skeletonSubheadline}`} />
      <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
    </section>
  );
};

export default FinalCTASkeleton;
