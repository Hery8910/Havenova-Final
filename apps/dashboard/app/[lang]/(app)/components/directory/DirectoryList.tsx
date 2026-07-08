import styles from './DirectoryList.module.css';

type DirectoryListProps<TItem> = {
  sectionLabel: string;
  title: string;
  hint?: string;
  items: TItem[];
  isLoading?: boolean;
  error?: string | null;
  emptyTitle: string;
  emptyDescription: string;
  onRetry?: () => void;
  renderItem: (item: TItem) => React.ReactNode;
};

export function DirectoryList<TItem>({
  sectionLabel,
  title,
  hint,
  items,
  isLoading = false,
  error = null,
  emptyTitle,
  emptyDescription,
  onRetry,
  renderItem,
}: DirectoryListProps<TItem>) {
  return (
    <section className={styles.root} aria-labelledby="directory-list-title">
      <div className={styles.header}>
        <div>
          <p className={styles.sectionLabel}>{sectionLabel}</p>
          <h2 id="directory-list-title" className={styles.title}>
            {title}
          </h2>
        </div>
        {hint ? <p className={styles.hint}>{hint}</p> : null}
      </div>

      {isLoading ? <p className={styles.feedback}>Loading…</p> : null}

      {!isLoading && error ? (
        <div className={styles.errorState}>
          <p className={styles.errorTitle}>Could not load the directory.</p>
          <p className={styles.errorText}>{error}</p>
          {onRetry ? (
            <button type="button" className="button button--outline" onClick={onRetry}>
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      {!isLoading && !error && !items.length ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>{emptyTitle}</p>
          <p className={styles.emptyDescription}>{emptyDescription}</p>
        </div>
      ) : null}

      {!isLoading && !error && items.length ? <div className={styles.items}>{items.map(renderItem)}</div> : null}
    </section>
  );
}
