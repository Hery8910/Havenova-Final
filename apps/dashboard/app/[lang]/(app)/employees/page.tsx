'use client';
import styles from './page.module.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRequireRole, useGlobalAlert, useI18n, fallbackGlobalError } from '../../../../../../packages/contexts';
import { DashboardLoadMore, DashboardSearchInput } from '../../../../../../packages/components/dashboard';
import { listWorkers } from '../../../../../../packages/services';
import { getPopup } from '../../../../../../packages/utils';
import type { WorkerListItem } from '../../../../../../packages/types/worker/workerTypes';

const Employees = () => {
  const isAllowed = useRequireRole('admin');
  const { texts } = useI18n();
  const popups = texts.popups;
  const { showError, closeAlert } = useGlobalAlert();

  const [workers, setWorkers] = useState<WorkerListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [queryInput, setQueryInput] = useState('');
  const [meta, setMeta] = useState<{ total: number; page: number; limit: number } | null>(null);

  const hasMore = useMemo(() => {
    if (!meta) return false;
    return workers.length < meta.total;
  }, [meta, workers.length]);

  const fetchWorkers = useCallback(
    async (nextPage: number, query: string, append: boolean) => {
      setLoading(true);
      try {
        const { workers: nextWorkers, meta: nextMeta } = await listWorkers({
          page: nextPage,
          limit: 20,
          search: query.trim() || undefined,
        });

        setWorkers((prev) => (append ? [...prev, ...nextWorkers] : nextWorkers));
        setMeta(nextMeta);
        setPage(nextPage);
      } catch (err: any) {
        const code = err?.response?.data?.code;
        const popup = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
        showError({
          response: {
            status: err?.response?.status ?? 500,
            title: popup.title,
            description: popup.description,
            cancelLabel: popup.close,
          },
          onCancel: closeAlert,
        });
      } finally {
        setLoading(false);
      }
    },
    [closeAlert, popups, showError]
  );

  const handleSearchApply = useCallback(() => {
    fetchWorkers(1, queryInput, false);
  }, [fetchWorkers, queryInput]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchWorkers(page + 1, queryInput, true);
  }, [fetchWorkers, hasMore, loading, page, queryInput]);

  useEffect(() => {
    if (!isAllowed) return;
    fetchWorkers(1, '', false);
  }, [fetchWorkers, isAllowed]);

  if (!isAllowed) return null;

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <DashboardSearchInput
          query={queryInput}
          placeholder={texts.components?.dashboard?.filters?.searchPlaceholder || 'Search by name'}
          searchLabel={texts.components?.dashboard?.filters?.searchLabel || 'Search'}
          onQueryChange={setQueryInput}
          onApply={handleSearchApply}
        />
        <div className={styles.list}>
          <header className={styles.listHeader}>
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Created</span>
          </header>
          <ul className={styles.listBody}>
            {workers.map((worker) => (
              <li key={worker.userId} className={styles.listRow}>
                <span>{worker.name}</span>
                <span>{worker.email}</span>
                <span>{worker.phone || '-'}</span>
                <span>{worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : '-'}</span>
              </li>
            ))}
            {!loading && workers.length === 0 && (
              <li className={styles.empty}>No workers found.</li>
            )}
          </ul>
        </div>
        <DashboardLoadMore
          hasMore={hasMore}
          loading={loading}
          onLoadMore={handleLoadMore}
          label={texts.components?.dashboard?.pagination?.loadMore || 'Load more'}
          loadingLabel={texts.components?.dashboard?.pagination?.loading || 'Loading...'}
        />
      </section>
    </main>
  );
};

export default Employees;
