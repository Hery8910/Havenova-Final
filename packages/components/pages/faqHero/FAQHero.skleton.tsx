import styles from './FAQHero.module.css';

const FAQHeroSkeleton: React.FC = () => {
  return (
    <section className={styles.section} role="region" aria-busy="true">
      <article className={styles.article}>
        <header className={styles.header}>
          <div className={`${styles.skeleton} ${styles.skeletonHeadline}`} />
          <div className={`${styles.skeleton} ${styles.skeletonHeadline}`} />
          <div className={`${styles.skeleton} ${styles.skeletonSubheadline}`} />
        </header>
        <div className={`${styles.skeleton} ${styles.skeletonImage}`} />
      </article>
    </section>
  );
};

export default FAQHeroSkeleton;
