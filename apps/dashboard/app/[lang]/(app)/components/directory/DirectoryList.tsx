"use client";

import { useEffect, useRef } from 'react';

import styles from './DirectoryList.module.css';

type DirectoryListProps<TItem> = {
  sectionLabel: string;
  title: string;
  hint?: string;
  variant?: 'neutral' | 'primary' | 'secondary' | 'accent';
  items: TItem[];
  isLoading?: boolean;
  error?: string | null;
  loadingLabel: string;
  errorTitle: string;
  retryLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  endOfResultsLabel?: string;
  onRetry?: () => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  isRefreshing?: boolean;
  loadingMoreLabel?: string;
  loadMoreFallbackLabel?: string;
  noResultsTitle?: string;
  noResultsDescription?: string;
  renderItem: (item: TItem) => React.ReactNode;
};

export function DirectoryList<TItem>({
  sectionLabel,
  title,
  hint,
  variant = 'neutral',
  items,
  isLoading = false,
  error = null,
  loadingLabel,
  errorTitle,
  retryLabel,
  emptyTitle,
  emptyDescription,
  endOfResultsLabel,
  onRetry,
  onLoadMore,
  hasNextPage = false,
  isLoadingMore = false,
  isRefreshing = false,
  loadingMoreLabel,
  loadMoreFallbackLabel,
  noResultsTitle,
  noResultsDescription,
  renderItem,
}: DirectoryListProps<TItem>) {
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);
  const showInitialLoading = isLoading && !items.length;
  const showEmpty = !showInitialLoading && !error && !items.length;

  useEffect(() => {
    const sentinel = loadMoreSentinelRef.current;

    if (
      !sentinel ||
      !hasNextPage ||
      isLoadingMore ||
      !onLoadMore ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, isLoadingMore, onLoadMore]);

  return (
    <section className={`card card--${variant} ${styles.root}`} aria-labelledby="directory-list-title">
      <div className={styles.header}>
        <div>
          <p className={styles.sectionLabel}>{sectionLabel}</p>
          <h2 id="directory-list-title" className={styles.title}>
            {title}
          </h2>
        </div>
        {hint ? <p className={styles.hint}>{hint}</p> : null}
      </div>

      {showInitialLoading ? <p className={styles.feedback}>{loadingLabel}</p> : null}
      {isRefreshing && items.length ? (
        <p className={styles.feedback} aria-live="polite">
          {loadingLabel}
        </p>
      ) : null}

      {!showInitialLoading && error ? (
        <div className={styles.errorState}>
          <p className={styles.errorTitle}>{errorTitle}</p>
          <p className={styles.errorText}>{error}</p>
          {onRetry ? (
            <button type="button" className="button button--outline" onClick={onRetry}>
              {retryLabel}
            </button>
          ) : null}
        </div>
      ) : null}

      {showEmpty ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>{noResultsTitle ?? emptyTitle}</p>
          <p className={styles.emptyDescription}>{noResultsDescription ?? emptyDescription}</p>
        </div>
      ) : null}

      {!showInitialLoading && !error && items.length ? (
        <>
          <div className={styles.items}>{items.map(renderItem)}</div>
          <div className={styles.feedback}>
            {hasNextPage ? (
              <>
                <div ref={loadMoreSentinelRef} className={styles.loadMoreSentinel} aria-hidden="true" />
                {isLoadingMore ? (
                  <span aria-live="polite">{loadingMoreLabel ?? loadingLabel}</span>
                ) : (
                  <button type="button" className="button button--outline" onClick={onLoadMore}>
                    {loadMoreFallbackLabel ?? loadingMoreLabel ?? loadingLabel}
                  </button>
                )}
              </>
            ) : endOfResultsLabel ? (
              <span>{endOfResultsLabel}</span>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}
