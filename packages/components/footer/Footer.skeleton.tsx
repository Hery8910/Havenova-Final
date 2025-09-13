import styles from './Footer.module.css';

export function FooterSkeleton() {
  return (
    <footer className={styles.footer} aria-label="Footer loading">
      <div className={`${styles.logo} ${styles.skeleton}`} />
      <div className={`${styles.ul} ${styles.skeleton}`} />
      <div className={`${styles.ul} ${styles.skeleton}`} />
      <div className={`${styles.ul} ${styles.skeleton}`} />
      <p className={`${styles.cta} ${styles.skeleton}`} />
    </footer>
  );
}
