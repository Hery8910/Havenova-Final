import styles from './ContactHero.module.css';

const ContactHeroSkeleton = () => {
  return (
    <section className={`${styles.hero} ${styles.skeletonHero}`} role="region" aria-hidden="true">
      <div className={styles.heroText}>
        <div className={styles.skeletonLine} style={{ width: '70%', height: '2.5rem' }}></div>
        <div className={styles.skeletonLine} style={{ width: '50%', height: '2rem' }}></div>
        <div className={styles.skeletonLine} style={{ width: '80%', height: '1.5rem' }}></div>
      </div>
    </section>
  );
};

export default ContactHeroSkeleton;
