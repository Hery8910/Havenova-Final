import styles from './Map.module.css';

export function MapSkeleton() {
  return (
    <div className={`${styles.mapWrapper} ${styles.skeleton}`}>
      <div className={styles.mapPlaceholder}></div>
      <div className={styles.addressPlaceholder}></div>
    </div>
  );
}
