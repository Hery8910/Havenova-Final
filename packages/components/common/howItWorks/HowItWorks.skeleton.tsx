// src/components/WorkFlow.skeleton.tsx
import styles from './HowItWorks.module.css';

const lines = Array.from({ length: 3 });

export default function SkeletonHowItWorks() {
  return (
    <section
      className={`${styles.section} ${styles.skeletonSection}`}
      aria-busy="true"
      aria-live="polite"
    >
      <header className={styles.header}>
        <div className={`${styles.skelBlock} ${styles.skelH2}`} />
        <div className={`${styles.skelBlock} ${styles.skelH3}`} />
      </header>

      <ol className={styles.ol} aria-hidden="true">
        {lines.map((_, i) => (
          <li className={styles.li} key={i}>
            <div className={`${styles.skelMedia}`} />
            <article className={`${styles.article} card`}>
              <div className={`${styles.skelBlock} ${styles.skelH4}`} />
              <div className={`${styles.skelBlock} ${styles.skelP}`} />
              <div className={`${styles.skelBlock} ${styles.skelP} ${styles.skelPshort}`} />
            </article>
          </li>
        ))}
      </ol>

      <div className={`${styles.skelBlock} ${styles.skelDesc}`} />
      <div className={`${styles.skelBtn}`} role="presentation" />
    </section>
  );
}
