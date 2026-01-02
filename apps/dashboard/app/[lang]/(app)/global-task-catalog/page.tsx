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
import type {
  CatalogBundleDetail,
  CatalogBundleSummary,
  GlobalTaskCatalogSummary,
} from '../../../../../../packages/types';
import { getGlobalTaskCatalog, getGlobalTaskCatalogBundle } from '../../../../../../packages/services';
import { getPopup } from '../../../../../../packages/utils';

const GlobalTaskCatalogPage = () => {
  const { texts, language } = useI18n();
  const { refreshAuth } = useAuth();
  const { showLoading, showError, showSuccess, closeAlert } = useGlobalAlert();
  const pageTexts = texts.components?.dashboard?.pages?.globalTaskCatalog;
  const popups = texts.popups;

  const [catalog, setCatalog] = useState<GlobalTaskCatalogSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [bundleLoading, setBundleLoading] = useState(false);
  const [bundleDetail, setBundleDetail] = useState<CatalogBundleDetail | null>(null);

  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);

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
      try {
        response = await getGlobalTaskCatalog();
      } catch (error: any) {
        if (error?.response?.status === 401) {
          await refreshAuth();
          response = await getGlobalTaskCatalog();
        } else {
          throw error;
        }
      }

      if (!response?.success || !response.data) {
        throw new Error('Catalog not available');
      }

      setCatalog(response.data);
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
    pageTexts?.successDescription,
    pageTexts?.successTitle,
    popups,
    refreshAuth,
    showError,
    showLoading,
    showSuccess,
  ]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  useEffect(() => {
    if (!selectedBundleId && catalog?.bundles?.length) {
      setSelectedBundleId(catalog.bundles[0]?.bundleId ?? null);
    }
  }, [catalog?.bundles, selectedBundleId]);

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
        const popupData = (popups as Record<string, any>)?.[response.code] || {
          title: pageTexts?.bundleSuccessTitle ?? 'Bundle loaded',
          description:
            pageTexts?.bundleSuccessDescription ??
            'The bundle details were loaded successfully.',
          close: popups.button?.close || 'Close',
        };
        showSuccess({
          response: {
            status: 200,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close,
          },
          onCancel: closeAlert,
        });
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

  const bundles = catalog?.bundles ?? [];
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
    recurrenceLabel: pageTexts?.bundles?.recurrenceLabel ?? 'Recurrence',
    areaLabel: pageTexts?.bundles?.areaLabel ?? 'Area',
    stepsLabel: pageTexts?.bundles?.stepsLabel ?? 'Steps',
    billablesLabel: pageTexts?.bundles?.billablesLabel ?? 'Billables',
    statusActive: pageTexts?.bundles?.statusActive ?? 'Active',
    statusInactive: pageTexts?.bundles?.statusInactive ?? 'Inactive',
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
    bundleDescriptionLabel:
      pageTexts?.details?.bundleDescriptionLabel ?? 'Description',
    recurrenceKeyLabel: pageTexts?.details?.recurrenceKeyLabel ?? 'Recurrence key',
    areaKeyLabel: pageTexts?.details?.areaKeyLabel ?? 'Area key',
    scheduleTitle: pageTexts?.details?.scheduleTitle ?? 'Schedule',
    scheduleFrequencyLabel:
      pageTexts?.details?.scheduleFrequencyLabel ?? 'Frequency',
    scheduleIntervalLabel:
      pageTexts?.details?.scheduleIntervalLabel ?? 'Interval (weeks)',
    scheduleAnchorLabel:
      pageTexts?.details?.scheduleAnchorLabel ?? 'Anchor week',
    scheduleNoteLabel: pageTexts?.details?.scheduleNoteLabel ?? 'Note',
    pricingTitle: pageTexts?.details?.pricingTitle ?? 'Pricing',
    pricingCurrencyLabel:
      pageTexts?.details?.pricingCurrencyLabel ?? 'Currency',
    pricingClientLabel:
      pageTexts?.details?.pricingClientLabel ?? 'Client gross',
    pricingPartnerLabel:
      pageTexts?.details?.pricingPartnerLabel ?? 'Partner gross',
    pricingTaxLabel: pageTexts?.details?.pricingTaxLabel ?? 'Tax rate',
    stepsTitle: pageTexts?.details?.stepsTitle ?? 'Steps',
    stepsEmpty: pageTexts?.details?.stepsEmpty ?? 'No steps available.',
    stepsRequirementLabel:
      pageTexts?.details?.stepsRequirementLabel ?? 'Requirement',
    stepsBillableLabel:
      pageTexts?.details?.stepsBillableLabel ?? 'Billable',
    stepsOrderLabel: pageTexts?.details?.stepsOrderLabel ?? 'Order',
    stepsBillableYes: pageTexts?.details?.stepsBillableYes ?? 'Yes',
    stepsBillableNo: pageTexts?.details?.stepsBillableNo ?? 'No',
    stepsLabel: pageTexts?.details?.stepsLabel ?? 'Steps',
    billablesLabel: pageTexts?.details?.billablesLabel ?? 'Billables',
    bundleStatusLabel: pageTexts?.details?.bundleStatusLabel ?? 'Bundle status',
    bundleLoading: pageTexts?.details?.bundleLoading ?? 'Loading bundle details...',
  };

  if (!catalog) {
    return (
      <main className={styles.main}>
        <section className={styles.section}>
          <header className={styles.header}>
            <h1>{pageTexts?.title ?? 'Global Task Catalog'}</h1>
            <p className={styles.subtitle}>
              {pageTexts?.subtitle ?? 'Totals and bundles in the shared catalog.'}
            </p>
          </header>
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
        <header className={styles.header}>
          <h1>{pageTexts?.title ?? 'Global Task Catalog'}</h1>
          <p className={styles.subtitle}>
            {pageTexts?.subtitle ?? 'Totals and bundles in the shared catalog.'}
          </p>
        </header>
        <div className={styles.scrollArea}>
          <GlobalTaskCatalogTotals totals={catalog.totals} texts={totalsTexts} />
          <GlobalTaskCatalogBundleList
            bundles={bundles}
            selectedBundleId={selectedBundleId}
            texts={bundleListTexts}
            onSelect={setSelectedBundleId}
          />
        </div>
      </section>
      <aside className={styles.panel}>
        <GlobalTaskCatalogDetails
          catalog={catalog}
          selectedBundle={selectedBundle}
          bundleLoading={bundleLoading}
          texts={detailsTexts}
          locale={language}
        />
      </aside>
    </main>
  );
};

export default GlobalTaskCatalogPage;
