'use client';
import styles from './page.module.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useRequireRole,
  useGlobalAlert,
  useI18n,
  fallbackGlobalError,
  useAuth,
} from '../../../../../../packages/contexts';
import {
  DashboardLoadMore,
  DashboardSearchInput,
  WorkerCreateForm,
  WorkerDetails,
} from '../../../../../../packages/components/dashboard';
import {
  getWorkerById,
  listWorkers,
  resendWorkerInvite,
} from '../../../../../../packages/services';
import { getPopup } from '../../../../../../packages/utils';
import type {
  WorkerListItem,
  WorkerDetailData,
  WorkerRecord,
} from '../../../../../../packages/types';
import { IoAdd } from 'react-icons/io5';
import Image from 'next/image';
import { IoIosArrowForward } from 'react-icons/io';

const getWorkerIdentity = (worker: Pick<WorkerListItem, 'userClientId'>) => worker.userClientId;

const Employees = () => {
  const isAllowed = useRequireRole('admin');
  const { refreshAuth } = useAuth();
  const { texts, language } = useI18n();
  const popups = texts.popups;
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();

  const [workers, setWorkers] = useState<WorkerListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [queryInput, setQueryInput] = useState('');
  const [meta, setMeta] = useState<{ total: number; page: number; limit: number } | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<WorkerDetailData | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [resendInviteLoading, setResendInviteLoading] = useState(false);

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
        const status = err?.response?.status;
        if (status === 401) {
          try {
            const refreshResult = await refreshAuth();
            if (!refreshResult.syncedFromServer) {
              return;
            }
            const { workers: nextWorkers, meta: nextMeta } = await listWorkers({
              page: nextPage,
              limit: 20,
              search: query.trim() || undefined,
            });
            setWorkers((prev) => (append ? [...prev, ...nextWorkers] : nextWorkers));
            setMeta(nextMeta);
            setPage(nextPage);
            return;
          } catch {
            // fall through to popup
          }
        }
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
    [closeAlert, popups, refreshAuth, showError]
  );

  const handleSelectWorker = useCallback(
    async (workerId: string) => {
      setIsCreating(false);
      setSelectedWorkerId(workerId);
      setDetailsLoading(true);
      try {
        const worker = await getWorkerById(workerId);
        setSelectedWorker(worker);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401) {
          try {
            const refreshResult = await refreshAuth();
            if (!refreshResult.syncedFromServer) {
              return;
            }
            const worker = await getWorkerById(workerId);
            setSelectedWorker(worker);
            return;
          } catch {
            // fall through to popup
          }
        }
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
        setDetailsLoading(false);
      }
    },
    [closeAlert, popups, refreshAuth, showError]
  );

  const handleCreateWorker = useCallback(() => {
    setIsCreating(true);
    setSelectedWorkerId(null);
    setSelectedWorker(null);
  }, []);

  const handleWorkerCreated = useCallback(
    (_worker: WorkerRecord) => {
      setIsCreating(false);
      setSelectedWorker(null);
      setSelectedWorkerId(null);
      fetchWorkers(1, queryInput, false);
    },
    [fetchWorkers, queryInput]
  );

  const handleSearchApply = useCallback(() => {
    fetchWorkers(1, queryInput, false);
  }, [fetchWorkers, queryInput]);

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchWorkers(page + 1, queryInput, true);
  }, [fetchWorkers, hasMore, loading, page, queryInput]);

  const handleResendInvite = useCallback(
    async (worker: WorkerDetailData) => {
      if (!worker.clientId || !worker.email) return;

      setResendInviteLoading(true);
      const loadingPopup = getPopup(
        popups,
        'GLOBAL_LOADING',
        'GLOBAL_LOADING',
        fallbackGlobalError
      );

      showLoading({
        response: {
          status: 102,
          title: loadingPopup.title,
          description: loadingPopup.description,
        },
      });

      try {
        const response = await resendWorkerInvite({
          clientId: worker.clientId,
          email: worker.email,
          language,
        });
        const popup = getPopup(
          popups,
          response.code,
          'WORKER_INVITE_RESENT',
          fallbackGlobalError
        );

        closeAlert();
        showSuccess({
          response: {
            status: 200,
            title: popup.title,
            description: popup.description,
            cancelLabel: popup.close,
          },
          onCancel: closeAlert,
        });

        if (selectedWorkerId) {
          await handleSelectWorker(selectedWorkerId);
        }
      } catch (err: any) {
        const code = err?.response?.data?.code;
        const popup = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
        closeAlert();
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
        setResendInviteLoading(false);
      }
    },
    [
      closeAlert,
      handleSelectWorker,
      language,
      popups,
      selectedWorkerId,
      showError,
      showLoading,
      showSuccess,
    ]
  );

  useEffect(() => {
    if (!isAllowed) return;
    fetchWorkers(1, '', false);
  }, [fetchWorkers, isAllowed]);

  if (!isAllowed) return null;

  return (
    <section className={styles.main}>
      <section className={`${styles.leftPanel} glass-panel--base`}>
        <header className={styles.headerRow}>
          <aside className={styles.totalCard}>
            <p className={styles.totalValue}>{meta?.total ?? 0}</p>
            <p className={styles.totalLabel}>
              {texts.components?.dashboard?.pages?.employees?.totalLabel || 'Total Mitarbeiter'}
            </p>
          </aside>
          <button type="button" className="button button--primary" onClick={handleCreateWorker}>
            <IoAdd aria-hidden="true" />
            {texts.components?.dashboard?.pages?.employees?.createButton || 'Mitarbeiter anlegen'}
          </button>
        </header>
        <DashboardSearchInput
          query={queryInput}
          placeholder={texts.components?.dashboard?.filters?.searchPlaceholder || 'Suche bei Name'}
          searchLabel={texts.components?.dashboard?.filters?.searchLabel || 'Suche'}
          onQueryChange={setQueryInput}
          onApply={handleSearchApply}
        />
        <div className={styles.listCard}>
          <ul className={styles.listBody}>
            {workers.map((worker) => {
              const workerIdentity = getWorkerIdentity(worker);
              const isActive = selectedWorkerId === workerIdentity;

              return (
                <li key={workerIdentity} className={styles.listItem}>
                  <button
                    type="button"
                    className={`${styles.listRow} ${isActive ? styles.listRowActive : ''}`}
                    onClick={() => handleSelectWorker(workerIdentity)}
                  >
                    <aside className={styles.rowAside}>
                      {worker.profileImage && (
                        <Image
                          className={styles.image}
                          src={worker.profileImage}
                          alt={`${worker.name}'s profile picture`}
                          width={50}
                          height={50}
                        />
                      )}
                      <div className={styles.asideDiv}>
                        <span className={styles.primary}>{worker.name}</span>
                        <span>{worker.email}</span>
                      </div>
                    </aside>
                    <div className={styles.detailsDiv}>
                      <span className={styles.badge}>{worker.jobTitle}</span>
                      <span className={styles.details}>
                        Más detalles <IoIosArrowForward />
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
            {loading && workers.length === 0 && (
              <li className={styles.empty}>Cargando trabajadores...</li>
            )}
            {!loading && workers.length === 0 && (
              <li className={styles.empty}>No hay trabajadores disponibles.</li>
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
      <section className={`${styles.rightPanel} glass-panel--base`}>
        <div className={styles.rightScroll}>
          {isCreating ? (
            <WorkerCreateForm onCreated={handleWorkerCreated} />
          ) : (
            <WorkerDetails
              worker={selectedWorker}
              loading={detailsLoading}
              resendInviteLoading={resendInviteLoading}
              onResendInvite={handleResendInvite}
            />
          )}
        </div>
      </section>
    </section>
  );
};

export default Employees;
