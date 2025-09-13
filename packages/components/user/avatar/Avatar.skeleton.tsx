import styles from './Avatar.module.css';

export function AvatarSkeleton() {
  return (
    <section className={styles.section} aria-label="Avatar loading">
      <div className={styles.button}>
        <span className={styles.skeletonCircle} />
        <span className={styles.skeletonText} />
      </div>
    </section>
  );
}
