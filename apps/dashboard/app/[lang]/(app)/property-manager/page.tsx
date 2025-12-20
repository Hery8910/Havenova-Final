'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './page.module.css';
import { useClient } from '@/packages/contexts/client/ClientContext';
import {
  fallbackGlobalError,
  fallbackGlobalLoading,
  useAuth,
  useGlobalAlert,
  useI18n,
} from '@/packages/contexts';
import { getPopup } from '@/packages/utils/alertType';
import {
  createPropertyManager,
  getPropertyManagerById,
  listPropertyManagers,
  updatePropertyManager,
} from '@/packages/services/propertyManager';
import type {
  PropertyManager,
  PropertyManagerDetail,
  PropertyManagerStatus,
} from '@/packages/types/propertyManager';
import { IoSearch } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import PropertyManagerForm, { PropertyManagerFormValues } from './PropertyManagerForm';
import PropertyManagerList from './PropertyManagerList';
import PropertyManagerDetails from './PropertyManagerDetails';

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
  const { client } = useClient();
  const { refreshAuth } = useAuth();
  const { texts } = useI18n();
  const popups = texts.popups;
  const pageTexts = texts.components?.dashboard?.pages?.propertyManagers;
  const { showLoading, showError, showConfirm, showSuccess, closeAlert } = useGlobalAlert();

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

    try {
      const data = await listPropertyManagers({
        clientId: client._id,
        page,
        limit: PAGE_SIZE,
        status: filters.status || undefined,
        search: filters.query?.trim() || undefined,
      });
      const list = data.data || [];
      setManagers(list);
      setTotals(calculateTotals(list, data.meta?.total));
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
          setManagers(list);
          setTotals(calculateTotals(list, retryData.meta?.total));
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
      setLoading(false);
      closeAlert();
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

  const openCreate = () => {
    setActivePanel({ mode: 'create', values: EMPTY_FORM });
    setDetailData(null);
  };

  const openEdit = (manager: PropertyManager) => {
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

  const handleToggleStatus = (manager: PropertyManager) => {
    const nextStatus: PropertyManagerStatus = manager.status === 'active' ? 'inactive' : 'active';
    showConfirm({
      response: {
        status: 400,
        title:
          nextStatus === 'active'
            ? pageTexts?.confirm?.activateTitle || 'Activate manager?'
            : pageTexts?.confirm?.deactivateTitle || 'Deactivate manager?',
        description:
          nextStatus === 'active'
            ? pageTexts?.confirm?.activateDescription ||
              'This manager will regain access to the dashboard.'
            : pageTexts?.confirm?.deactivateDescription ||
              'This manager will lose access to the dashboard.',
        confirmLabel:
          nextStatus === 'active'
            ? pageTexts?.confirm?.confirmActivate || 'Activate'
            : pageTexts?.confirm?.confirmDeactivate || 'Deactivate',
        cancelLabel: pageTexts?.confirm?.cancel || 'Cancel',
      },
      onConfirm: async () => {
        closeAlert();
        setLoading(true);
        try {
          await updatePropertyManager(manager.id, { status: nextStatus });
          setManagers((prev) =>
            prev.map((item) => (item.id === manager.id ? { ...item, status: nextStatus } : item))
          );
          setTotals((prev) => {
            const activeDelta = nextStatus === 'active' ? 1 : -1;
            return {
              ...prev,
              active: Math.max(0, prev.active + activeDelta),
              inactive: Math.max(0, prev.inactive - activeDelta),
            };
          });
        } catch (error: any) {
          const errorKey = error?.response?.data?.errorCode;
          const popupData = getPopup(
            popups,
            errorKey,
            'GLOBAL_INTERNAL_ERROR',
            fallbackGlobalError
          );
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
          closeAlert();
        }
      },
      onCancel: closeAlert,
    });
  };

  return (
    <main className={styles.main}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.kicker}>
            {pageTexts?.page?.kicker || 'Property'}
          </span>
          <h1 className={styles.title}>
            {pageTexts?.page?.title || 'Property Managers'}
          </h1>
          <p className={styles.subtitle}>
            {pageTexts?.page?.subtitle ||
              'Manage contact details, access status, and building assignments for your team.'}
          </p>
        </div>
        <button className={styles.primaryButton} onClick={openCreate}>
          <FiPlus />
          {pageTexts?.page?.createCta || 'Create manager'}
        </button>
      </header>

      <div className={styles.content}>
        <section className={styles.card}>
          <div className={styles.toolbar}>
            <label className={styles.search}>
              <IoSearch />
              <input
                className={styles.input}
                name="search"
                id="search"
                type="text"
                value={queryInput}
                placeholder={
                  pageTexts?.toolbar?.searchPlaceholder || 'Search by name or email'
                }
                onChange={(event) => setQueryInput(event.target.value)}
              />
            </label>
            <select
              className={styles.select}
              value={filters.status || ''}
              onChange={(event) => {
                const value = event.target.value as PropertyManagerStatus | '';
                setFilters((prev) => ({
                  ...prev,
                  status: value,
                }));
                setPage(1);
              }}
            >
              <option value="">{pageTexts?.toolbar?.statusAll || 'All statuses'}</option>
              <option value="active">{pageTexts?.toolbar?.statusActive || 'Active'}</option>
              <option value="inactive">{pageTexts?.toolbar?.statusInactive || 'Inactive'}</option>
            </select>
            <button
              className={styles.button}
              onClick={() => {
                setFilters((prev) => ({ ...prev, query: queryInput.trim() }));
                setPage(1);
              }}
            >
              {pageTexts?.toolbar?.apply || 'Apply'}
            </button>
            <button
              className={styles.ghostButton}
              onClick={() => {
                setQueryInput('');
                setFilters({ status: '', query: '' });
                setPage(1);
              }}
            >
              {pageTexts?.toolbar?.reset || 'Reset'}
            </button>
            <div className={styles.statusSummary}>
              <span>
                {(pageTexts?.toolbar?.totalLabel || 'Total') + ': '} {totals.total}
              </span>
              <span>
                {(pageTexts?.toolbar?.activeLabel || 'Active') + ': '} {totals.active}
              </span>
              <span>
                {(pageTexts?.toolbar?.inactiveLabel || 'Inactive') + ': '} {totals.inactive}
              </span>
            </div>
          </div>

          <PropertyManagerList
            managers={managers}
            loading={loading}
            texts={{
              emailLabel: pageTexts?.table?.email || 'Email',
              buildingsLabel: pageTexts?.table?.buildings || 'Buildings',
              loadingLabel: pageTexts?.table?.loading || 'Loading property managers...',
              emptyLabel: pageTexts?.table?.empty || 'No property managers found.',
              editLabel: pageTexts?.table?.edit || 'Edit',
              activateLabel: pageTexts?.table?.activate || 'Activate',
              deactivateLabel: pageTexts?.table?.deactivate || 'Deactivate',
            }}
            onSelect={handleSelectManager}
            onEdit={openEdit}
            onToggleStatus={handleToggleStatus}
          />

          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              {pageTexts?.pagination?.prev || 'Previous'}
            </button>
            <span className={styles.pageLabel}>
              {(pageTexts?.pagination?.pageLabel || 'Page') + ' '} {page}
            </span>
            <button
              className={styles.paginationButton}
              disabled={!hasNextPage || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              {pageTexts?.pagination?.next || 'Next'}
            </button>
          </div>
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
                emptyState:
                  pageTexts?.details?.emptyState ||
                  pageTexts?.form?.emptyState ||
                  'Selecciona un manager para ver detalles',
                loading: pageTexts?.details?.loading || 'Loading details...',
                phone: pageTexts?.details?.phone || 'Phone',
                address: pageTexts?.details?.address || 'Address',
                preferredContact: pageTexts?.details?.preferredContact || 'Contact',
                createdAt: pageTexts?.details?.createdAt || 'Created',
                updatedAt: pageTexts?.details?.updatedAt || 'Updated',
                notes: pageTexts?.details?.notes || 'Notes',
                totalBuildings: pageTexts?.details?.totalBuildings || 'Total',
                activeBuildings: pageTexts?.details?.activeBuildings || 'Active',
                inactiveBuildings: pageTexts?.details?.inactiveBuildings || 'Inactive',
              }}
            />
          )}
        </aside>
      </div>
    </main>
  );
};

export default PropertyManagerPage;
