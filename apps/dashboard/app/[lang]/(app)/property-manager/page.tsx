'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './page.module.css';

import { FiPlus } from 'react-icons/fi';
import { type PropertyManagerFormValues } from '../../../../../../packages/components/dashboard/propertyManagers/propertyManagerForm/PropertyManagerForm';
import {
  fallbackGlobalError,
  fallbackGlobalLoading,
  useAuth,
  useClient,
  useGlobalAlert,
  useI18n,
  useRequireRole,
} from '../../../../../../packages/contexts';
import {
  PropertyManager,
  PropertyManagerDetail,
  PropertyManagerStatus,
} from '../../../../../../packages/types';
import { getPopup, href } from '../../../../../../packages/utils';
import {
  createPropertyManager,
  getPropertyManagerById,
  listPropertyManagers,
  updatePropertyManager,
} from '../../../../../../packages/services';
import {
  DashboardSearchInput,
  DashboardStatusFilters,
  DashboardLoadMore,
  PropertyManagerDetails,
  PropertyManagerForm,
  PropertyManagerList,
  type DashboardStatusFilterItem,
} from '../../../../../../packages/components/dashboard';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../../../../packages/hooks';

const PAGE_SIZE = 10;

const EMPTY_FORM: PropertyManagerFormValues = {
  name: '',
  email: '',
  phone: '',
  address: '',
  status: 'active',
  preferredContactMethod: 'none',
  notes: '',
};

const PropertyManagerPage = () => {
  const isAllowed = useRequireRole('admin');
  const { client } = useClient();
  const { auth, refreshAuth } = useAuth();
  const router = useRouter();
  const lang = useLang();

  const { texts } = useI18n();
  const popups = texts.popups;
  const pageTexts = texts.components?.dashboard?.pages?.propertyManagers;
  const { showLoading, showError, showSuccess, closeAlert } = useGlobalAlert();

  const [managers, setManagers] = useState<PropertyManager[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [queryInput, setQueryInput] = useState('');
  const [filters, setFilters] = useState<{ status?: PropertyManagerStatus | ''; query?: string }>({
    status: '',
    query: '',
  });
  const [totals, setTotals] = useState({ total: 0, active: 0, inactive: 0 });
  const [activePanel, setActivePanel] = useState<
    | {
        mode: 'create' | 'edit';
        values: PropertyManagerFormValues;
        managerId?: string;
      }
    | {
        mode: 'details';
        managerId: string;
      }
    | null
  >(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<PropertyManagerDetail | null>(null);

  if (!isAllowed) return null;

  const statusFilters: DashboardStatusFilterItem<PropertyManagerStatus | ''>[] = [
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
    return managers.length === PAGE_SIZE;
  }, [managers.length, page, totals.total]);

  const calculateTotals = (items: PropertyManager[], totalCount?: number) => {
    const active = items.filter((manager) => manager.status === 'active').length;
    const inactive = items.filter((manager) => manager.status === 'inactive').length;
    return {
      total: totalCount ?? items.length,
      active,
      inactive,
    };
  };

  const fetchManagers = useCallback(async () => {
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

    let shouldCloseAlert = true;

    try {
      const data = await listPropertyManagers({
        clientId: client._id,
        page,
        limit: PAGE_SIZE,
        status: filters.status || undefined,
        search: filters.query?.trim() || undefined,
      });
      const list = data.data || [];
      setManagers((prev) => {
        const next = page === 1 ? list : [...prev, ...list];
        setTotals(calculateTotals(next, data.meta?.total));
        return next;
      });
    } catch (error: any) {
      let errorToHandle = error;
      const status = error?.response?.status;

      if (status === 401) {
        try {
          await refreshAuth();
          const retryData = await listPropertyManagers({
            clientId: client._id,
            page,
            limit: PAGE_SIZE,
            status: filters.status || undefined,
            search: filters.query?.trim() || undefined,
          });
          const list = retryData.data || [];
          setManagers((prev) => {
            const next = page === 1 ? list : [...prev, ...list];
            setTotals(calculateTotals(next, retryData.meta?.total));
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
    client?._id,
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
    fetchManagers();
  }, [fetchManagers]);

  useEffect(() => {
    if (!auth.isLogged) {
      router.push(href(lang, '/login'));
    }
  }, [auth.isLogged, lang, router]);

  const openCreate = () => {
    setActivePanel({ mode: 'create', values: EMPTY_FORM });
    setDetailData(null);
  };

  const openEdit = (manager: PropertyManager | PropertyManagerDetail) => {
    setActivePanel({
      mode: 'edit',
      values: {
        name: manager.name || '',
        email: manager.email || '',
        phone: manager.phone || '',
        address: manager.address || '',
        status: manager.status,
        preferredContactMethod: manager.preferredContactMethod || 'none',
        notes: manager.notes || '',
      },
      managerId: manager.id,
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

  const handleSubmit = async (values: PropertyManagerFormValues) => {
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
      const payload = {
        name: values.name.trim(),
        status: values.status,
        email: normalizeOptional(values.email),
        phone: normalizeOptional(values.phone),
        address: normalizeOptional(values.address),
        preferredContactMethod: values.preferredContactMethod,
        notes: normalizeOptional(values.notes),
      };

      if (activePanel?.mode === 'create') {
        await createPropertyManager({
          clientId: client._id,
          ...payload,
        });
      }

      if (activePanel?.mode === 'edit' && activePanel.managerId) {
        await updatePropertyManager(activePanel.managerId, payload);
      }

      closeAlert();
      showSuccess({
        response: {
          status: 200,
          title:
            activePanel?.mode === 'create'
              ? pageTexts?.form?.successCreateTitle || 'Manager created'
              : pageTexts?.form?.successEditTitle || 'Manager details updated',
          description:
            activePanel?.mode === 'create'
              ? pageTexts?.form?.successCreateDescription ||
                'The property manager has been added successfully.'
              : pageTexts?.form?.successEditDescription ||
                'The property manager has been updated successfully.',
        },
        onCancel: closeAlert,
      });

      closeForm();
      await fetchManagers();
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

  const handleSelectManager = async (managerId: string) => {
    if (!client?._id) return;
    setActivePanel({ mode: 'details', managerId });
    setDetailLoading(true);
    setDetailData(null);

    try {
      const data = await getPropertyManagerById(managerId);
      setDetailData(data.data);
    } catch (error: any) {
      let errorToHandle = error;
      const status = error?.response?.status;

      if (status === 401) {
        try {
          await refreshAuth();
          const retryData = await getPropertyManagerById(managerId);
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

  const listLoading = loading && managers.length === 0;
  const handleSearchApply = useCallback(() => {
    setFilters((prev) => ({ ...prev, query: queryInput.trim() }));
    setPage(1);
  }, [queryInput]);

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <header className={styles.header}>
          <button className={styles.primaryButton} onClick={openCreate}>
            <FiPlus />
            {pageTexts?.page?.createCta || 'Create manager'}
          </button>
          <DashboardSearchInput
            query={queryInput}
            placeholder={pageTexts?.toolbar?.searchPlaceholder || 'Search by name or email'}
            onQueryChange={setQueryInput}
            onApply={handleSearchApply}
          />
          <DashboardStatusFilters
            items={statusFilters}
            activeValue={filters.status ?? ''}
            onChange={(value: PropertyManagerStatus | '') => {
              setFilters((prev) => ({
                ...prev,
                status: value,
              }));
              setPage(1);
            }}
          />
        </header>

        <PropertyManagerList
          managers={managers}
          loading={listLoading}
          texts={{
            emailLabel: pageTexts?.table?.email || 'Email',
            buildingsLabel: pageTexts?.table?.buildings || 'Buildings',
            loadingLabel: pageTexts?.table?.loading || 'Loading property managers...',
            emptyLabel: pageTexts?.table?.empty || 'No property managers found.',
            detailsLabel: pageTexts?.details?.title || 'Details',
          }}
          onSelect={handleSelectManager}
        />

        <DashboardLoadMore
          hasMore={hasNextPage}
          loading={loading}
          label={pageTexts?.pagination?.loadMoreLabel || 'Cargar mas resultados'}
          onLoadMore={() => setPage((current) => current + 1)}
        />
      </section>

      <aside className={styles.panel}>
        {activePanel?.mode === 'create' || activePanel?.mode === 'edit' ? (
          <PropertyManagerForm
            mode={activePanel.mode}
            initialValues={activePanel.values}
            loading={loading}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        ) : (
          <PropertyManagerDetails
            manager={detailData}
            loading={detailLoading}
            texts={{
              title: pageTexts?.details?.title || 'Manager details',
              editLabel: pageTexts?.details?.editLabel || pageTexts?.table?.edit || 'Edit',
              emptyState:
                pageTexts?.details?.emptyState ||
                pageTexts?.form?.emptyState ||
                'Selecciona un manager para ver detalles',
              loading: pageTexts?.details?.loading || 'Loading details...',
              phone: pageTexts?.details?.phone || 'Phone',
              address: pageTexts?.details?.address || 'Address',
              preferredContact: pageTexts?.details?.preferredContact || 'Contact',
              contactOptions: {
                email: pageTexts?.details?.contactOptions?.email || 'Email',
                phone: pageTexts?.details?.contactOptions?.phone || 'Phone',
                none: pageTexts?.details?.contactOptions?.none || 'No preference',
              },
              createdAt: pageTexts?.details?.createdAt || 'Created',
              updatedAt: pageTexts?.details?.updatedAt || 'Updated',
              notes: pageTexts?.details?.notes || 'Notes',
              buildings: pageTexts?.details?.buildings || 'Buildings',
              totalBuildings: pageTexts?.details?.totalBuildings || 'Total',
              activeBuildings: pageTexts?.details?.activeBuildings || 'Active',
              inactiveBuildings: pageTexts?.details?.inactiveBuildings || 'Inactive',
            }}
            onEdit={openEdit}
          />
        )}
      </aside>
    </main>
  );
};

export default PropertyManagerPage;
