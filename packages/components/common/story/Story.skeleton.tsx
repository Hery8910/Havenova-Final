import styles from './Story.module.css';

const StorySkeleton = () => {
  return (
    <section className={styles.story} role="region" aria-hidden="true">
      <div className={styles.skeletonLine} style={{ width: '40%', height: '2rem' }}></div>
      <div className={styles.skeletonLine} style={{ width: '90%', height: '1rem' }}></div>
      <div className={styles.skeletonLine} style={{ width: '85%', height: '1rem' }}></div>
      <div className={styles.skeletonLine} style={{ width: '80%', height: '1rem' }}></div>
      <div className={styles.skeletonLine} style={{ width: '70%', height: '1rem' }}></div>
    </section>
  );
};

export default StorySkeleton;
