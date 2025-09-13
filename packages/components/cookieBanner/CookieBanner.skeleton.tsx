import styles from './CookieBanner.module.css';

export function CookieBannerSkeleton() {
  return (
    <main className={`${styles.wrapper} card`} aria-label="Cookie banner loading">
      <section className={`${styles.banner} card`}>
        <article className={styles.article}>
          <div className={`${styles.title} ${styles.skeleton}`} />
          <div className={`${styles.description} ${styles.skeleton}`} />
          <div className={`${styles.controls} ${styles.skeleton}`} />
        </article>
      </section>
    </main>
  );
}
