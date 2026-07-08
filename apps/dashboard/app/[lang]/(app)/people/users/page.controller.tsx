'use client';

import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useLang } from '@/packages/hooks';
import { getTenantUserDetail, getTenantUsers } from '@/packages/services';
import type { TenantUserDetail, TenantUserListItem, TenantUserStatus } from '@/packages/types';
import {
  buildUsersSummary,
  resolveUsersPageMode,
  USERS_PAGE_QUERY_KEYS,
  usersPageCopy,
  usersStatusOptions,
} from './page.copy';
import { UsersPageDetailRouter } from './components/UsersPageDetailRouter';
import { UsersPageView } from './components/UsersPageView';
import type { UsersPageControllerProps, UsersPageMode } from './page.types';

const normalizeSelected = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export default function PeopleUsersPageController({
  initialMode,
  initialSelectedUserClientId,
}: UsersPageControllerProps) {
  const lang = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | TenantUserStatus>('all');
  const [reloadToken, setReloadToken] = useState(0);
  const [items, setItems] = useState<TenantUserListItem[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [isListLoading, setIsListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [detail, setDetail] = useState<TenantUserDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);

  const selectedUserClientId = useMemo(() => {
    const nextSelected = normalizeSelected(
      searchParams.get(USERS_PAGE_QUERY_KEYS.selected) ??
        searchParams.get(USERS_PAGE_QUERY_KEYS.legacySelected) ??
        initialSelectedUserClientId
    );

    return nextSelected;
  }, [initialSelectedUserClientId, searchParams]);

  const mode = useMemo<UsersPageMode>(() => {
    return resolveUsersPageMode(
      searchParams.get(USERS_PAGE_QUERY_KEYS.mode),
      selectedUserClientId,
      initialMode
    );
  }, [initialMode, searchParams, selectedUserClientId]);

  useEffect(() => {
    const legacySelected = normalizeSelected(searchParams.get(USERS_PAGE_QUERY_KEYS.legacySelected));
    const nextSelected = normalizeSelected(searchParams.get(USERS_PAGE_QUERY_KEYS.selected));

    if (!legacySelected || nextSelected) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete(USERS_PAGE_QUERY_KEYS.legacySelected);
    params.set(USERS_PAGE_QUERY_KEYS.selected, legacySelected);

    if (!params.get(USERS_PAGE_QUERY_KEYS.mode)) {
      params.set(USERS_PAGE_QUERY_KEYS.mode, 'detail');
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      setIsListLoading(true);
      setListError(null);

      try {
        const response = await getTenantUsers({
          page: 1,
          limit: 20,
          search: deferredSearch,
          status: status === 'all' ? undefined : status,
        });

        if (cancelled) {
          return;
        }

        setItems(response.data);
        setMeta(response.meta);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setItems([]);
        setListError(error instanceof Error ? error.message : 'Could not load tenant users.');
      } finally {
        if (!cancelled) {
          setIsListLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, [deferredSearch, reloadToken, status]);

  useEffect(() => {
    if (mode !== 'detail' || !selectedUserClientId) {
      setDetail(null);
      setDetailError(null);
      setIsDetailLoading(false);
      return;
    }

    let cancelled = false;

    const loadDetail = async () => {
      setIsDetailLoading(true);
      setDetailError(null);

      try {
        const nextDetail = await getTenantUserDetail(selectedUserClientId);

        if (cancelled) {
          return;
        }

        setDetail(nextDetail);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setDetail(null);
        setDetailError(error instanceof Error ? error.message : 'Could not load tenant user.');
      } finally {
        if (!cancelled) {
          setIsDetailLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [mode, selectedUserClientId]);

  const updateRouteState = (nextMode: UsersPageMode, nextSelectedUserClientId?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete(USERS_PAGE_QUERY_KEYS.legacySelected);

    if (nextMode === 'empty') {
      params.delete(USERS_PAGE_QUERY_KEYS.mode);
      params.delete(USERS_PAGE_QUERY_KEYS.selected);
    } else {
      params.set(USERS_PAGE_QUERY_KEYS.mode, nextMode);

      if (nextSelectedUserClientId) {
        params.set(USERS_PAGE_QUERY_KEYS.selected, nextSelectedUserClientId);
      } else {
        params.delete(USERS_PAGE_QUERY_KEYS.selected);
      }
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  const handleSelectUser = (userClientId: string) => {
    updateRouteState('detail', userClientId);
  };

  const handleOpenInvite = () => {
    updateRouteState('invite');
  };

  const handleReturnToDirectory = () => {
    updateRouteState('empty');
  };

  const handleRetryList = () => {
    setListError(null);
    setReloadToken((current) => current + 1);
  };

  const summaryItems = useMemo(
    () =>
      buildUsersSummary({
        total: meta.total,
        items,
      }),
    [items, meta.total]
  );

  return (
    <UsersPageView
      detail={
        <UsersPageDetailRouter
          locale={lang}
          mode={mode}
          selectedUserClientId={selectedUserClientId}
          detail={detail}
          isLoading={isDetailLoading}
          error={detailError}
          onReturnToDirectory={handleReturnToDirectory}
        />
      }
      detailLabel={usersPageCopy.detail.detailLabel}
      directoryItems={items}
      directoryError={listError}
      directoryHint={usersPageCopy.list.hint}
      directorySectionLabel={usersPageCopy.list.sectionLabel}
      directoryTitle={usersPageCopy.list.title}
      emptyTitle={usersPageCopy.list.emptyTitle}
      emptyDescription={usersPageCopy.list.emptyDescription}
      filters={{
        searchLabel: usersPageCopy.filters.searchLabel,
        searchPlaceholder: usersPageCopy.filters.searchPlaceholder,
        searchValue: search,
        selectLabel: usersPageCopy.filters.selectLabel,
        selectOptions: usersStatusOptions,
        selectValue: status,
      }}
      header={{
        eyebrow: usersPageCopy.intro.eyebrow,
        title: usersPageCopy.intro.title,
        description: usersPageCopy.intro.description,
        primaryActionLabel: usersPageCopy.intro.primaryActionLabel,
      }}
      isDirectoryLoading={isListLoading}
      mode={mode}
      navigationLabel={usersPageCopy.detail.navigationLabel}
      onOpenInvite={handleOpenInvite}
      onRetryDirectory={handleRetryList}
      onSearchChange={setSearch}
      onSelectChange={(value) => setStatus(value as 'all' | TenantUserStatus)}
      onSelectUser={handleSelectUser}
      selectedUserClientId={selectedUserClientId}
      summaryItems={summaryItems}
      tenantUserLocale={lang}
    />
  );
}
