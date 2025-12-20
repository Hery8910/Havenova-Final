import styles from './Values.module.css';

const ValuesSkeleton = () => {
  return (
    <section className={styles.section} role="region" aria-hidden="true">
      <header className={styles.header}>
        <div className={styles.skeletonLine} style={{ width: '40%', height: '2rem' }}></div>
      </header>
      <ul className={styles.ul}>
        {[1, 2, 3, 4].map((_, idx) => (
          <li className={styles.li} key={idx}>
            <div className={styles.skeletonLine} style={{ width: '50px', height: '2rem' }}></div>
            <div className={styles.skeletonLine} style={{ width: '70%', height: '1.5rem' }}></div>
            <div
              className={styles.skeletonLine}
              style={{ width: '90%', height: '1rem', marginTop: '8px' }}
            ></div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ValuesSkeleton;
