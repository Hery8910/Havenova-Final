'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus } from 'react-icons/fi';
import styles from './page.module.css';
import {
  fallbackGlobalError,
  fallbackGlobalLoading,
  useAuth,
  useClient,
  useGlobalAlert,
  useI18n,
  useRequireRole,
} from '../../../../../../packages/contexts';
import { useLang } from '../../../../../../packages/hooks';
import { getPopup, href } from '../../../../../../packages/utils';
import {
  DashboardSearchInput,
  DashboardStatusFilters,
  DashboardLoadMore,
  ObjectDetails,
  ObjectForm,
  ObjectList,
  type DashboardStatusFilterItem,
} from '../../../../../../packages/components/dashboard';
import {
  BuildingDetail,
  BuildingListItem,
  ObjectFormValues,
  ObjectStatus,
} from '../../../../../../packages/types/object';
import {
  createBuilding,
  getBuildingById,
  listBuildings,
  lookupPropertyManagers,
  updateBuilding,
} from '../../../../../../packages/services';
import { PropertyManagerLookupItem } from '../../../../../../packages/types/propertyManager';

const PAGE_SIZE = 10;
const MANAGER_LIMIT = 12;

const EMPTY_FORM: ObjectFormValues = {
  propertyManagerId: '',
  objectNumber: '',
  street: '',
  streetNumber: '',
  postalCode: '',
  district: '',
  entrancesCount: '',
  floorCount: '',
  preferredCleaningWindowDay: '',
  preferredCleaningDay: '',
  cleaningSuppliesRoom: '',
  keyAccess: '',
  waterAccess: '',
  waterDisposal: '',
  ladderAvailable: '',
  electricityAccess: '',
  lightBulbChangeRequired: '',
  flooringType: '',
  onSiteContact: '',
  decisionMaker: '',
  cleaningInfo: '',
  status: 'active',
  notes: '',
};

const ObjectsPage = () => {
  const isAllowed = useRequireRole('admin');
  const { client } = useClient();
  const { auth, refreshAuth } = useAuth();
  const router = useRouter();
  const lang = useLang();
  const { texts } = useI18n();
  const popups = texts.popups;
  const pageTexts = texts.components?.dashboard?.pages?.objects;
  const { showLoading, showError, showSuccess, closeAlert } = useGlobalAlert();

  const [objects, setObjects] = useState<BuildingListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [queryInput, setQueryInput] = useState('');
  const [filters, setFilters] = useState<{ status?: ObjectStatus | ''; query?: string }>({
    status: '',
    query: '',
  });
  const [totals, setTotals] = useState({ total: 0, active: 0, inactive: 0 });
  const [activePanel, setActivePanel] = useState<
    | {
        mode: 'create' | 'edit';
        values: ObjectFormValues;
        managerLabel?: string;
        objectId?: string;
      }
    | {
        mode: 'details';
        objectId: string;
      }
    | null
  >(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<BuildingDetail | null>(null);
  const fetchKeyRef = useRef(0);
  const detailFetchKeyRef = useRef(0);

  useEffect(() => {
    if (!auth.isLogged) {
      router.push(href(lang, '/login'));
    }
  }, [auth.isLogged, lang, router]);

  const handleManagerSearch = useCallback(
    async (query: string): Promise<PropertyManagerLookupItem[]> => {
      if (!client?._id) return [];

      try {
        const data = await lookupPropertyManagers({
          clientId: client._id,
          search: query,
          limit: MANAGER_LIMIT,
        });
        return data.data || [];
      } catch (error: any) {
        let errorToHandle = error;
        const status = error?.response?.status;

        if (status === 401) {
          try {
            await refreshAuth();
            const retryData = await lookupPropertyManagers({
              clientId: client._id,
              search: query,
              limit: MANAGER_LIMIT,
            });
            return retryData.data || [];
          } catch (retryError: any) {
            errorToHandle = retryError;
          }
        }

        const errorKey = errorToHandle?.response?.data?.errorCode;
        const popupData = getPopup(popups, errorKey, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
        showError({
          response: {
            status: errorToHandle?.response?.status || 500,
            title: popupData.title,
            description: popupData.description || errorToHandle?.response?.data?.message,
            cancelLabel: popupData.close,
          },
          onCancel: closeAlert,
        });
        return [];
      }
    },
    [client?._id, closeAlert, popups, refreshAuth, showError]
  );

  const statusFilters: DashboardStatusFilterItem<ObjectStatus | ''>[] = [
    {
      label: pageTexts?.toolbar?.statusAll || 'All',
      value: '',
      total: totals.total,
    },
    {
      label: pageTexts?.toolbar?.statusActive || 'Active',
      value: 'active',
      total: totals.active,
    },
    {
      label: pageTexts?.toolbar?.statusInactive || 'Inactive',
      value: 'inactive',
      total: totals.inactive,
    },
  ];

  const hasNextPage = useMemo(() => {
    if (totals.total) return page * PAGE_SIZE < totals.total;
    return objects.length === PAGE_SIZE;
  }, [objects.length, page, totals.total]);

  const fetchObjects = useCallback(async () => {
    const fetchKey = ++fetchKeyRef.current;
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

    let shouldCloseAlert = true;

    try {
      const data = await listBuildings({
        page,
        limit: PAGE_SIZE,
        status: filters.status || undefined,
        search: filters.query?.trim() || undefined,
      });
      if (fetchKey !== fetchKeyRef.current) return;
      const list = data.data || [];
      setObjects((prev) => {
        const merged: BuildingListItem[] = page === 1 ? list : [...prev, ...list];
        const deduped = new Map<string, BuildingListItem>();
        merged.forEach((item: BuildingListItem) => {
          deduped.set(item.id, item);
        });
        const next = Array.from(deduped.values());
        setTotals({
          total: data.meta?.total ?? next.length,
          active:
            data.meta?.activeCount ??
            next.filter((item: BuildingListItem) => item.status === 'active').length,
          inactive:
            data.meta?.inactiveCount ??
            next.filter((item: BuildingListItem) => item.status === 'inactive').length,
        });
        return next;
      });
    } catch (error: any) {
      let errorToHandle = error;
      const status = error?.response?.status;

      if (status === 401) {
        try {
          await refreshAuth();
          const retryData = await listBuildings({
            page,
            limit: PAGE_SIZE,
            status: filters.status || undefined,
            search: filters.query?.trim() || undefined,
          });
          if (fetchKey !== fetchKeyRef.current) return;
          const list = retryData.data || [];
          setObjects((prev) => {
            const merged: BuildingListItem[] = page === 1 ? list : [...prev, ...list];
            const deduped = new Map<string, BuildingListItem>();
            merged.forEach((item: BuildingListItem) => {
              deduped.set(item.id, item);
            });
            const next = Array.from(deduped.values());
            setTotals({
              total: retryData.meta?.total ?? next.length,
              active:
                retryData.meta?.activeCount ??
                next.filter((item: BuildingListItem) => item.status === 'active').length,
              inactive:
                retryData.meta?.inactiveCount ??
                next.filter((item: BuildingListItem) => item.status === 'inactive').length,
            });
            return next;
          });
          return;
        } catch (retryError: any) {
          errorToHandle = retryError;
        }
      }

      const errorKey = errorToHandle?.response?.data?.errorCode;
      const popupData = getPopup(popups, errorKey, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
      shouldCloseAlert = false;
      closeAlert();
      showError({
        response: {
          status: errorToHandle?.response?.status || 500,
          title: popupData.title,
          description: popupData.description || errorToHandle?.response?.data?.message,
          cancelLabel: popupData.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setLoading(false);
      if (shouldCloseAlert) {
        closeAlert();
      }
    }
  }, [
    closeAlert,
    filters.query,
    filters.status,
    page,
    popups,
    refreshAuth,
    showError,
    showLoading,
  ]);

  useEffect(() => {
    fetchObjects();
  }, [fetchObjects]);

  const openCreate = () => {
    setActivePanel({ mode: 'create', values: EMPTY_FORM });
    setDetailData(null);
  };

  const openEdit = (object: BuildingDetail) => {
    setActivePanel({
      mode: 'edit',
      values: {
        propertyManagerId: object.propertyManagerId || '',
        objectNumber: object.objectNumber || '',
        street: object.street || '',
        streetNumber: object.streetNumber || '',
        postalCode: object.postalCode || '',
        district: object.district || '',
        entrancesCount: object.entrancesCount || '',
        floorCount: object.floorCount || '',
        preferredCleaningDay: object.preferredCleaningDay || '',
        cleaningSuppliesRoom: object.cleaningSuppliesRoom || '',
        preferredCleaningWindowDay: object.preferredCleaningWindowDay || '',
        keyAccess: object.keyAccess || '',
        waterAccess: object.waterAccess || '',
        waterDisposal: object.waterDisposal || '',
        ladderAvailable: object.ladderAvailable || '',
        electricityAccess: object.electricityAccess || '',
        lightBulbChangeRequired: object.lightBulbChangeRequired || '',
        flooringType: object.flooringType || '',
        onSiteContact: object.onSiteContact || '',
        decisionMaker: object.decisionMaker || '',
        cleaningInfo: object.cleaningInfo || '',
        status: object.status,
        notes: object.notes || '',
      },
      managerLabel: object.propertyManagerName || '',
      objectId: object.id,
    });
    setDetailData(null);
  };

  const closeForm = () => {
    setActivePanel(null);
    setDetailData(null);
  };

  const normalizeOptional = (value: string) => {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  };

  const handleSubmit = async (values: ObjectFormValues) => {
    if (!client?._id) return;

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
      const basePayload = {
        propertyManagerId: values.propertyManagerId.trim(),
        objectNumber: values.objectNumber.trim(),
        street: values.street.trim(),
        streetNumber: values.streetNumber.trim(),
        postalCode: values.postalCode.trim(),
        district: values.district.trim(),
        entrancesCount: normalizeOptional(values.entrancesCount),
        floorCount: normalizeOptional(values.floorCount),
        preferredCleaningWindowDay: values.preferredCleaningWindowDay,
        preferredCleaningDay: values.preferredCleaningDay,
        cleaningSuppliesRoom: normalizeOptional(values.cleaningSuppliesRoom),
        keyAccess: normalizeOptional(values.keyAccess),
        waterAccess: normalizeOptional(values.waterAccess),
        waterDisposal: normalizeOptional(values.waterDisposal),
        ladderAvailable: normalizeOptional(values.ladderAvailable),
        electricityAccess: normalizeOptional(values.electricityAccess),
        lightBulbChangeRequired: normalizeOptional(values.lightBulbChangeRequired),
        flooringType: normalizeOptional(values.flooringType),
        onSiteContact: normalizeOptional(values.onSiteContact),
        decisionMaker: normalizeOptional(values.decisionMaker),
        cleaningInfo: normalizeOptional(values.cleaningInfo),
        status: values.status,
        notes: normalizeOptional(values.notes),
      };

      if (activePanel?.mode === 'create') {
        try {
          await createBuilding({
            clientId: client._id,
            ...basePayload,
          });
        } catch (error: any) {
          if (error?.response?.status === 401) {
            await refreshAuth();
            await createBuilding({
              clientId: client._id,
              ...basePayload,
            });
          } else {
            throw error;
          }
        }
      }

      if (activePanel?.mode === 'edit' && activePanel.objectId) {
        try {
          await updateBuilding(activePanel.objectId, basePayload);
        } catch (error: any) {
          if (error?.response?.status === 401) {
            await refreshAuth();
            await updateBuilding(activePanel.objectId, basePayload);
          } else {
            throw error;
          }
        }
      }

      closeAlert();
      showSuccess({
        response: {
          status: 200,
          title:
            activePanel?.mode === 'create'
              ? pageTexts?.form?.successCreateTitle || 'Object created'
              : pageTexts?.form?.successEditTitle || 'Object updated',
          description:
            activePanel?.mode === 'create'
              ? pageTexts?.form?.successCreateDescription ||
                'The object has been created successfully.'
              : pageTexts?.form?.successEditDescription || 'The object has been updated.',
        },
        onCancel: closeAlert,
      });

      closeForm();
      await fetchObjects();
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
  };

  const handleSelectObject = async (objectId: string) => {
    const detailFetchKey = ++detailFetchKeyRef.current;
    setActivePanel({ mode: 'details', objectId });
    setDetailLoading(true);
    setDetailData(null);

    try {
      const data = await getBuildingById(objectId);
      if (detailFetchKey !== detailFetchKeyRef.current) return;
      setDetailData(data.data);
    } catch (error: any) {
      let errorToHandle = error;
      const status = error?.response?.status;

      if (status === 401) {
        try {
          await refreshAuth();
          const retryData = await getBuildingById(objectId);
          if (detailFetchKey !== detailFetchKeyRef.current) return;
          setDetailData(retryData.data);
          return;
        } catch (retryError: any) {
          errorToHandle = retryError;
        }
      }

      const errorKey = errorToHandle?.response?.data?.errorCode;
      const popupData = getPopup(popups, errorKey, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
      showError({
        response: {
          status: errorToHandle?.response?.status || 500,
          title: popupData.title,
          description: popupData.description || errorToHandle?.response?.data?.message,
          cancelLabel: popupData.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const listLoading = loading && objects.length === 0;
  const handleSearchApply = useCallback(() => {
    setFilters((prev) => ({ ...prev, query: queryInput.trim() }));
    setPage(1);
  }, [queryInput]);

  if (!isAllowed) return null;

  return (
    <section className={styles.main}>
      <section className={styles.section}>
        <header className={styles.header}>
          <button className={styles.primaryButton} onClick={openCreate}>
            <FiPlus />
            {pageTexts?.page?.createCta || 'Create object'}
          </button>
          <DashboardSearchInput
            query={queryInput}
            placeholder={
              pageTexts?.toolbar?.searchPlaceholder || 'Search by object nummer or adress'
            }
            onQueryChange={setQueryInput}
            onApply={handleSearchApply}
          />
          <DashboardStatusFilters
            items={statusFilters}
            activeValue={filters.status ?? ''}
            onChange={(value: ObjectStatus | '') => {
              setFilters((prev) => ({
                ...prev,
                status: value,
              }));
              setPage(1);
            }}
          />
        </header>
        <article className={styles.sectionArticle}>
          <ObjectList
            objects={objects}
            loading={listLoading}
            texts={{
              propertyManagerLabel: pageTexts?.table?.propertyManager || 'Manager',
              entrancesLabel: pageTexts?.table?.entrances || 'Entrances',
              loadingLabel: pageTexts?.table?.loading || 'Loading objects...',
              emptyLabel: pageTexts?.table?.empty || 'No objects found.',
              detailsLabel: pageTexts?.details?.title || 'Details',
            }}
            onSelect={handleSelectObject}
          />

          <DashboardLoadMore
            hasMore={hasNextPage}
            loading={loading}
            label={pageTexts?.pagination?.loadMoreLabel || 'Load more results'}
            onLoadMore={() => setPage((current) => current + 1)}
          />
        </article>
      </section>

      <aside className={styles.panel}>
        {activePanel?.mode === 'create' || activePanel?.mode === 'edit' ? (
          <ObjectForm
            mode={activePanel.mode}
            initialValues={activePanel.values}
            initialManagerLabel={activePanel.mode === 'edit' ? activePanel.managerLabel || '' : ''}
            onManagerSearch={handleManagerSearch}
            loading={loading}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        ) : (
          <ObjectDetails
            object={detailData}
            loading={detailLoading}
            texts={{
              title: pageTexts?.details?.title || 'Object details',
              editLabel: pageTexts?.details?.editLabel || pageTexts?.table?.edit || 'Edit',
              emptyState:
                pageTexts?.details?.emptyState ||
                pageTexts?.form?.emptyState ||
                'Select an object to view details.',
              loading: pageTexts?.details?.loading || 'Loading details...',
              objectNumber: pageTexts?.details?.objectNumber || 'Object number',
              address: pageTexts?.details?.address || 'Address',
              propertyManager: pageTexts?.details?.propertyManager || 'Manager',
              entrancesCount: pageTexts?.details?.entrancesCount || 'Entrances',
              floorCount: pageTexts?.details?.floorCount || 'Floors',
              preferredCleaningDay:
                pageTexts?.details?.preferredCleaningDay || 'Preferred window cleaning day',
              preferredCleaningWindowDay:
                pageTexts?.details?.preferredCleaningWindowDay || 'Fixed cleaning day',
              cleaningSuppliesRoom:
                pageTexts?.details?.cleaningSuppliesRoom || 'Cleaning supplies room',
              keyAccess: pageTexts?.details?.keyAccess || 'Key access',
              waterAccess: pageTexts?.details?.waterAccess || 'Water access',
              waterDisposal: pageTexts?.details?.waterDisposal || 'Water disposal',
              ladderAvailable: pageTexts?.details?.ladderAvailable || 'Ladder available',
              electricityAccess: pageTexts?.details?.electricityAccess || 'Electricity access',
              lightBulbChangeRequired:
                pageTexts?.details?.lightBulbChangeRequired || 'Light bulb change',
              flooringType: pageTexts?.details?.flooringType || 'Flooring type',
              onSiteContact: pageTexts?.details?.onSiteContact || 'On-site contact',
              decisionMaker: pageTexts?.details?.decisionMaker || 'Decision maker',
              cleaningInfo: pageTexts?.details?.cleaningInfo || 'Cleaning info',
              status: pageTexts?.details?.status || 'Status',
              notes: pageTexts?.details?.notes || 'Notes',
              createdAt: pageTexts?.details?.createdAt || 'Created',
              updatedAt: pageTexts?.details?.updatedAt || 'Updated',
            }}
            onEdit={openEdit}
          />
        )}
      </aside>
    </section>
  );
};

export default ObjectsPage;
