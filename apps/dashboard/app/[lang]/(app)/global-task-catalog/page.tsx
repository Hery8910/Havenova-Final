'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './page.module.css';

import {
  fallbackGlobalError,
  fallbackGlobalLoading,
  useAuth,
  useGlobalAlert,
  useI18n,
} from '../../../../../../packages/contexts';
import {
  GlobalTaskCatalogBundleList,
  GlobalTaskCatalogDetails,
  GlobalTaskCatalogTotals,
} from '../../../../../../packages/components/dashboard/pages';
import type { GlobalTaskCatalogBundleFiltersValue } from '../../../../../../packages/components/dashboard/pages/globalTaskCatalog/bundleFilters';
import type {
  CatalogBundleDetail,
  CatalogBundleSummary,
  CatalogBundlesMeta,
  AreaKey,
  RecurrenceKey,
  GlobalTaskCatalogSummary,
} from '../../../../../../packages/types';
import {
  getGlobalTaskCatalog,
  getGlobalTaskCatalogBundle,
} from '../../../../../../packages/services';
import { getPopup } from '../../../../../../packages/utils';

const GlobalTaskCatalogPage = () => {
  const { texts, language } = useI18n();
  const { refreshAuth } = useAuth();
  const { showLoading, showError, showSuccess, closeAlert } = useGlobalAlert();
  const pageTexts = texts.components?.dashboard?.pages?.globalTaskCatalog;
  const popups = texts.popups;

  const [catalog, setCatalog] = useState<GlobalTaskCatalogSummary | null>(null);
  const [bundles, setBundles] = useState<CatalogBundleSummary[]>([]);
  const [meta, setMeta] = useState<CatalogBundlesMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [bundleLoading, setBundleLoading] = useState(false);
  const [bundleDetail, setBundleDetail] = useState<CatalogBundleDetail | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{
    status: '' | 'active' | 'inactive';
    title: string;
    recurrenceKey: '' | RecurrenceKey;
    areaKey: '' | AreaKey;
  }>({
    status: '',
    title: '',
    recurrenceKey: '',
    areaKey: '',
  });
  const [queryInput, setQueryInput] = useState('');

  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);

  const handleSearchApply = useCallback(() => {
    if (queryInput === filters.title) return;
    setFilters((prev) => ({ ...prev, title: queryInput }));
    setPage(1);
    setBundles([]);
    setSelectedBundleId(null);
    setBundleDetail(null);
  }, [filters.title, queryInput]);

  const handleFilterChange = useCallback(
    (next: Partial<GlobalTaskCatalogBundleFiltersValue>) => {
      const nextFilters = { ...filters, ...next };
      if (
        nextFilters.status === filters.status &&
        nextFilters.title === filters.title &&
        nextFilters.recurrenceKey === filters.recurrenceKey &&
        nextFilters.areaKey === filters.areaKey
      ) {
        return;
      }
      setFilters(nextFilters);
      setPage(1);
      setBundles([]);
      setSelectedBundleId(null);
      setBundleDetail(null);
    },
    [filters]
  );

  const handleResetFilters = useCallback(() => {
    if (
      filters.status === '' &&
      filters.title === '' &&
      filters.recurrenceKey === '' &&
      filters.areaKey === '' &&
      queryInput === ''
    ) {
      return;
    }
    setFilters({
      status: '',
      title: '',
      recurrenceKey: '',
      areaKey: '',
    });
    setQueryInput('');
    setPage(1);
    setBundles([]);
    setSelectedBundleId(null);
    setBundleDetail(null);
  }, [filters, queryInput]);

  const handleLoadMore = useCallback(() => {
    setPage((current) => current + 1);
  }, []);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    const loadingPopup = getPopup(
      popups,
      'GLOBAL_LOADING',
      'GLOBAL_LOADING',
      fallbackGlobalLoading
    );
    showLoading({
      response: {
        status: 102,
        title: loadingPopup.title,
        description: loadingPopup.description,
      },
    });

    try {
      let response;
      const requestParams = {
        page,
        limit: 10,
        status: filters.status || undefined,
        title: filters.title || undefined,
        recurrenceKey: filters.recurrenceKey || undefined,
        areaKey: filters.areaKey || undefined,
      };
      try {
        response = await getGlobalTaskCatalog(requestParams);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          await refreshAuth();
          response = await getGlobalTaskCatalog(requestParams);
        } else {
          throw error;
        }
      }

      if (!response?.success || !response.data) {
        throw new Error('Catalog not available');
      }

      const catalogData =
        (response.data as { data?: GlobalTaskCatalogSummary })?.data ?? response.data;

      const responseMeta = (
        response as {
          meta?: { total: number | string; page: number | string; limit: number | string };
        }
      )?.meta;
      const metaData = responseMeta ?? catalogData.meta ?? null;
      const normalizedMeta = metaData
        ? {
            total: Number(metaData.total),
            page: Number(metaData.page),
            limit: Number(metaData.limit),
          }
        : null;

      setCatalog(catalogData);
      setMeta(normalizedMeta);
      setBundles((current) =>
        page === 1 ? catalogData.bundles : [...current, ...catalogData.bundles]
      );
      closeAlert();
    } catch (error: any) {
      closeAlert();
      const errorKey = error?.response?.data?.errorCode;
      const popupData = getPopup(popups, errorKey, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
      showError({
        response: {
          status: error?.response?.status || 500,
          title: popupData.title,
          description: popupData.description || error?.response?.data?.message,
          cancelLabel: popupData.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setLoading(false);
    }
  }, [
    closeAlert,
    filters.areaKey,
    filters.recurrenceKey,
    filters.status,
    filters.title,
    page,
    popups,
    refreshAuth,
    showError,
    showLoading,
  ]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  useEffect(() => {
    if (!selectedBundleId && bundles.length) {
      setSelectedBundleId(bundles[0]?.bundleId ?? null);
    }
  }, [bundles, selectedBundleId]);

  const fetchBundleDetail = useCallback(
    async (bundleId: string) => {
      setBundleLoading(true);
      setBundleDetail(null);
      const loadingPopup = getPopup(
        popups,
        'GLOBAL_LOADING',
        'GLOBAL_LOADING',
        fallbackGlobalLoading
      );
      showLoading({
        response: {
          status: 102,
          title: loadingPopup.title,
          description: loadingPopup.description,
        },
      });

      try {
        let response;
        try {
          response = await getGlobalTaskCatalogBundle(bundleId);
        } catch (error: any) {
          if (error?.response?.status === 401) {
            await refreshAuth();
            response = await getGlobalTaskCatalogBundle(bundleId);
          } else {
            throw error;
          }
        }

        if (!response?.success || !response.data) {
          throw new Error('Bundle not available');
        }

        setBundleDetail(response.data);
        closeAlert();
      } catch (error: any) {
        closeAlert();
        const errorKey = error?.response?.data?.errorCode;
        const popupData = getPopup(popups, errorKey, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
        showError({
          response: {
            status: error?.response?.status || 500,
            title: popupData.title,
            description: popupData.description || error?.response?.data?.message,
            cancelLabel: popupData.close,
          },
          onCancel: closeAlert,
        });
      } finally {
        setBundleLoading(false);
      }
    },
    [
      closeAlert,
      pageTexts?.bundleSuccessDescription,
      pageTexts?.bundleSuccessTitle,
      popups,
      refreshAuth,
      showError,
      showLoading,
      showSuccess,
    ]
  );

  useEffect(() => {
    if (selectedBundleId) {
      fetchBundleDetail(selectedBundleId);
    }
  }, [fetchBundleDetail, selectedBundleId]);

  const selectedBundle = useMemo(
    () => (bundleDetail?.bundleId === selectedBundleId ? bundleDetail : null),
    [bundleDetail, selectedBundleId]
  );

  const totalsTexts = {
    title: pageTexts?.totals?.title ?? 'Totals',
    bundles: pageTexts?.totals?.bundles ?? 'Bundles',
    steps: pageTexts?.totals?.steps ?? 'Steps',
    billables: pageTexts?.totals?.billables ?? 'Billables',
  };

  const bundleListTexts = {
    title: pageTexts?.bundles?.title ?? 'Bundles',
    empty: pageTexts?.bundles?.empty ?? 'No bundles available',
    loading: pageTexts?.bundles?.loading ?? 'Loading bundles...',
    recurrenceLabel: pageTexts?.bundles?.recurrenceLabel ?? 'Recurrence',
    areaLabel: pageTexts?.bundles?.areaLabel ?? 'Area',
    stepsLabel: pageTexts?.bundles?.stepsLabel ?? 'Steps',
    billablesLabel: pageTexts?.bundles?.billablesLabel ?? 'Billables',
    statusActive: pageTexts?.bundles?.statusActive ?? 'Active',
    statusInactive: pageTexts?.bundles?.statusInactive ?? 'Inactive',
    recurrenceKeys: pageTexts?.recurrenceKeys ?? {},
    areaKeys: pageTexts?.areaKeys ?? {},
    filters: {
      searchPlaceholder: pageTexts?.bundles?.filters?.searchPlaceholder ?? 'Search by title',
      statusLabel: pageTexts?.bundles?.filters?.statusLabel ?? 'Status',
      statusAll: pageTexts?.bundles?.filters?.statusAll ?? 'All',
      statusActive: pageTexts?.bundles?.filters?.statusActive ?? 'Active',
      statusInactive: pageTexts?.bundles?.filters?.statusInactive ?? 'Inactive',
      recurrenceLabel: pageTexts?.bundles?.filters?.recurrenceLabel ?? 'Recurrence',
      areaLabel: pageTexts?.bundles?.filters?.areaLabel ?? 'Area',
      resetLabel: pageTexts?.bundles?.filters?.resetLabel ?? 'Reset',
    },
    pagination: {
      loadMoreLabel: pageTexts?.bundles?.pagination?.loadMoreLabel ?? 'Load more',
      loadingLabel: pageTexts?.bundles?.pagination?.loadingLabel ?? 'Loading...',
    },
  };

  const detailsTexts = {
    title: pageTexts?.details?.title ?? 'Catalog details',
    nameLabel: pageTexts?.details?.nameLabel ?? 'Name',
    versionLabel: pageTexts?.details?.versionLabel ?? 'Version',
    activeLabel: pageTexts?.details?.activeLabel ?? 'Active',
    inactiveLabel: pageTexts?.details?.inactiveLabel ?? 'Inactive',
    createdLabel: pageTexts?.details?.createdLabel ?? 'Created',
    updatedLabel: pageTexts?.details?.updatedLabel ?? 'Updated',
    bundleTitle: pageTexts?.details?.bundleTitle ?? 'Bundle details',
    bundleEmpty: pageTexts?.details?.bundleEmpty ?? 'Select a bundle to see details',
    bundleDescriptionLabel: pageTexts?.details?.bundleDescriptionLabel ?? 'Description',
    recurrenceKeyLabel: pageTexts?.details?.recurrenceKeyLabel ?? 'Recurrence key',
    areaKeyLabel: pageTexts?.details?.areaKeyLabel ?? 'Area key',
    scheduleTitle: pageTexts?.details?.scheduleTitle ?? 'Schedule',
    scheduleFrequencyLabel: pageTexts?.details?.scheduleFrequencyLabel ?? 'Frequency',
    scheduleIntervalLabel: pageTexts?.details?.scheduleIntervalLabel ?? 'Interval (weeks)',
    scheduleAnchorLabel: pageTexts?.details?.scheduleAnchorLabel ?? 'Anchor week',
    scheduleNoteLabel: pageTexts?.details?.scheduleNoteLabel ?? 'Note',
    pricingTitle: pageTexts?.details?.pricingTitle ?? 'Pricing',
    pricingCurrencyLabel: pageTexts?.details?.pricingCurrencyLabel ?? 'Currency',
    pricingClientLabel: pageTexts?.details?.pricingClientLabel ?? 'Client gross',
    pricingPartnerLabel: pageTexts?.details?.pricingPartnerLabel ?? 'Partner gross',
    pricingTaxLabel: pageTexts?.details?.pricingTaxLabel ?? 'Expected profit',
    stepsTitle: pageTexts?.details?.stepsTitle ?? 'Steps',
    stepsEmpty: pageTexts?.details?.stepsEmpty ?? 'No steps available.',
    stepsRequirementLabel: pageTexts?.details?.stepsRequirementLabel ?? 'Requirement',
    stepsBillableLabel: pageTexts?.details?.stepsBillableLabel ?? 'Billable',
    stepsOrderLabel: pageTexts?.details?.stepsOrderLabel ?? 'Order',
    stepsBillableYes: pageTexts?.details?.stepsBillableYes ?? 'Yes',
    stepsBillableNo: pageTexts?.details?.stepsBillableNo ?? 'No',
    stepsLabel: pageTexts?.details?.stepsLabel ?? 'Steps',
    billablesLabel: pageTexts?.details?.billablesLabel ?? 'Billables',
    bundleStatusLabel: pageTexts?.details?.bundleStatusLabel ?? 'Bundle status',
    bundleLoading: pageTexts?.details?.bundleLoading ?? 'Loading bundle details...',
    recurrenceKeys: pageTexts?.recurrenceKeys ?? {},
    areaKeys: pageTexts?.areaKeys ?? {},
  };

  if (!catalog) {
    return (
      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.scrollArea}>
            <p className={styles.subtitle}>
              {loading
                ? pageTexts?.loading ?? 'Loading catalog...'
                : pageTexts?.empty ?? 'No catalog data available.'}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <GlobalTaskCatalogTotals totals={catalog.totals} texts={totalsTexts} />
        <GlobalTaskCatalogBundleList
          bundles={bundles}
          selectedBundleId={selectedBundleId}
          loading={loading}
          hasMore={meta ? meta.page * meta.limit < meta.total : false}
          filters={filters}
          searchQuery={queryInput}
          texts={bundleListTexts}
          onSearchChange={setQueryInput}
          onSearchApply={handleSearchApply}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onLoadMore={handleLoadMore}
          onSelect={setSelectedBundleId}
        />
      </section>
      <aside className={styles.panel}>
        <GlobalTaskCatalogDetails
          catalog={catalog}
          selectedBundle={selectedBundle}
          texts={detailsTexts}
        />
      </aside>
    </main>
  );
};

export default GlobalTaskCatalogPage;
