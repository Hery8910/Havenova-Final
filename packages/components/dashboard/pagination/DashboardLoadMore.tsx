'use client';

import styles from './DashboardLoadMore.module.css';

interface DashboardLoadMoreProps {
  hasMore: boolean;
  loading?: boolean;
  label?: string;
  loadingLabel?: string;
  onLoadMore: () => void;
}

export default function DashboardLoadMore({
  hasMore,
  loading = false,
  label = 'Cargar mas resultados',
  loadingLabel = 'Cargando...',
  onLoadMore,
}: DashboardLoadMoreProps) {
  if (!hasMore && !loading) return null;

  return (
    <button
      className={styles.button}
      type="button"
      onClick={onLoadMore}
      disabled={loading || !hasMore}
    >
      <span className={styles.span}></span>
      <span className={styles.label}>{loading ? loadingLabel : label}</span>
      <span className={styles.span}></span>
    </button>
  );
}
