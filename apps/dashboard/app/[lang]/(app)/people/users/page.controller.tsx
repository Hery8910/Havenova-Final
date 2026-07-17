'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useLang } from '@/packages/hooks';
import { useI18n } from '@/packages/contexts';
import {
  getTenantUserDirectoryDetail,
  getTenantUsersDirectoryPage,
  getTenantUsersDirectorySummary,
} from '@/packages/services';
import type {
  AppLanguage,
  TenantUserDirectoryDetail,
  TenantUserDirectoryEntry,
  TenantUsersDirectoryPage,
  TenantUsersDirectorySummary,
} from '@/packages/types';
import {
  buildUsersSummary,
  createUsersPageCopy,
  parseUsersSearchState,
  parseUsersStatus,
  resolveUsersPageMode,
  USERS_PAGE_QUERY_KEYS,
} from './page.copy';
import { UsersPageDetailRouter } from './components/UsersPageDetailRouter';
import { UsersPageView } from './components/UsersPageView';
import type {
  UsersPageControllerProps,
  UsersPageMode,
  UsersPageSearchState,
  UsersPageStatusFilter,
} from './page.types';

const DIRECTORY_LIMIT = 25;
const SEARCH_DEBOUNCE_MS = 300;
const MAX_RESTORE_PAGES = 8;

const normalizeSelected = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeSearch = (value?: string | null): string => value?.trim() ?? '';

const dedupeDirectoryItems = (pages: TenantUsersDirectoryPage[]): TenantUserDirectoryEntry[] => {
  const seen = new Set<string>();
  const items: TenantUserDirectoryEntry[] = [];

  for (const page of pages) {
    for (const item of page.items) {
      if (seen.has(item.entryId)) {
        continue;
      }

      seen.add(item.entryId);
      items.push(item);
    }
  }

  return items;
};

type DirectoryCacheEntry = {
  pages: TenantUsersDirectoryPage[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function PeopleUsersPageController({
  initialMode,
  initialSelectedEntryId,
  initialSearchState,
}: UsersPageControllerProps) {
  const lang = useLang() as AppLanguage;
  const { texts } = useI18n();
  const usersPageCopy = useMemo(
    () => createUsersPageCopy(texts.pages.dashboard.usersDirectory.copy),
    [texts.pages.dashboard.usersDirectory.copy]
  );
  const directoryErrorTitle = usersPageCopy.feedback.errorTitle;
  const detailErrorTitle = usersPageCopy.panels.detail.errorTitle;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const routeSelectedEntryId = useMemo(() => {
    return normalizeSelected(
      searchParams.get(USERS_PAGE_QUERY_KEYS.selected) ??
        searchParams.get(USERS_PAGE_QUERY_KEYS.legacySelected) ??
        initialSelectedEntryId
    );
  }, [initialSelectedEntryId, searchParams]);

  const routeMode = useMemo<UsersPageMode>(() => {
    return resolveUsersPageMode(
      searchParams.get(USERS_PAGE_QUERY_KEYS.mode),
      routeSelectedEntryId,
      initialMode
    );
  }, [initialMode, routeSelectedEntryId, searchParams]);

  const routeSearchState = useMemo<UsersPageSearchState>(() => {
    if (!searchParams.toString()) {
      return initialSearchState;
    }

    return parseUsersSearchState({
      search: searchParams.get(USERS_PAGE_QUERY_KEYS.search),
      status: searchParams.get(USERS_PAGE_QUERY_KEYS.status),
    });
  }, [initialSearchState, searchParams]);

  const [search, setSearch] = useState(initialSearchState.search);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearchState.search);
  const [status, setStatus] = useState<UsersPageStatusFilter>(initialSearchState.status);
  const [summary, setSummary] = useState<TenantUsersDirectorySummary | null>(null);
  const [summaryReloadToken, setSummaryReloadToken] = useState(0);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState(false);
  const [directoryReloadToken, setDirectoryReloadToken] = useState(0);
  const [pages, setPages] = useState<TenantUsersDirectoryPage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isDirectoryInitialLoading, setIsDirectoryInitialLoading] = useState(true);
  const [isDirectoryRefreshing, setIsDirectoryRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [directoryError, setDirectoryError] = useState<string | null>(null);
  const [detail, setDetail] = useState<TenantUserDirectoryDetail | null>(null);
  const [detailReloadToken, setDetailReloadToken] = useState(0);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const directoryItems = useMemo(() => dedupeDirectoryItems(pages), [pages]);
  const directoryItemsCountRef = useRef(0);
  const normalizedDebouncedSearch = normalizeSearch(debouncedSearch);
  const shouldFetchSearch =
    normalizedDebouncedSearch.length === 0 || normalizedDebouncedSearch.length >= 2;
  const remoteSearch =
    normalizedDebouncedSearch.length >= 2 ? normalizedDebouncedSearch : undefined;
  const directoryQueryKey = `${remoteSearch ?? ''}\u0000${status}`;
  const directoryQueryKeyRef = useRef(directoryQueryKey);
  const directoryCacheRef = useRef(new Map<string, DirectoryCacheEntry>());
  const directoryEntryRefs = useRef(new Map<string, HTMLButtonElement>());
  const pendingEntryRestoreRef = useRef<string | undefined>(routeSelectedEntryId);
  const previousSelectedEntryRef = useRef<string | undefined>(routeSelectedEntryId);
  const restorePageAttemptsRef = useRef(0);
  const isLoadingMoreRef = useRef(false);
  const loadNextDirectoryPageRef = useRef<() => void>(() => undefined);

  directoryQueryKeyRef.current = directoryQueryKey;
  const summaryCopy = texts.pages.dashboard.usersDirectory.summary;

  const cacheDirectoryPages = useCallback(
    (
      queryKey: string,
      cachedPages: TenantUsersDirectoryPage[],
      cachedNextCursor: string | null,
      cachedHasNextPage: boolean
    ) => {
      directoryCacheRef.current.set(queryKey, {
        pages: cachedPages,
        nextCursor: cachedNextCursor,
        hasNextPage: cachedHasNextPage,
      });
    },
    []
  );

  const registerDirectoryEntryElement = useCallback(
    (entryId: string, element: HTMLButtonElement | null) => {
      if (element) {
        directoryEntryRefs.current.set(entryId, element);
        return;
      }

      directoryEntryRefs.current.delete(entryId);
    },
    []
  );

  useEffect(() => {
    directoryItemsCountRef.current = directoryItems.length;
  }, [directoryItems.length]);

  useEffect(() => {
    if (!routeSelectedEntryId) {
      pendingEntryRestoreRef.current = undefined;
      previousSelectedEntryRef.current = undefined;
      restorePageAttemptsRef.current = 0;
      return;
    }

    if (previousSelectedEntryRef.current !== routeSelectedEntryId) {
      pendingEntryRestoreRef.current = routeSelectedEntryId;
      previousSelectedEntryRef.current = routeSelectedEntryId;
      restorePageAttemptsRef.current = 0;
    }
  }, [routeMode, routeSelectedEntryId]);

  useEffect(() => {
    const entryId = pendingEntryRestoreRef.current;
    if (!entryId || entryId !== routeSelectedEntryId) {
      return;
    }

    const entryElement = directoryEntryRefs.current.get(entryId);
    if (!entryElement) {
      if (
        hasNextPage &&
        !isDirectoryRefreshing &&
        !isLoadingMoreRef.current &&
        restorePageAttemptsRef.current < MAX_RESTORE_PAGES
      ) {
        restorePageAttemptsRef.current += 1;
        loadNextDirectoryPageRef.current();
      }

      return;
    }

    entryElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    entryElement.focus({ preventScroll: true });
    pendingEntryRestoreRef.current = undefined;
    restorePageAttemptsRef.current = 0;
  }, [directoryItems, hasNextPage, isDirectoryRefreshing, routeMode, routeSelectedEntryId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(normalizeSearch(search));
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const legacySelected = normalizeSelected(
      searchParams.get(USERS_PAGE_QUERY_KEYS.legacySelected)
    );
    const nextSelected = normalizeSelected(searchParams.get(USERS_PAGE_QUERY_KEYS.selected));

    if (!legacySelected || nextSelected) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete(USERS_PAGE_QUERY_KEYS.legacySelected);
    params.set(USERS_PAGE_QUERY_KEYS.selected, `user:${legacySelected}`);

    if (!params.get(USERS_PAGE_QUERY_KEYS.mode)) {
      params.set(USERS_PAGE_QUERY_KEYS.mode, 'detail');
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const nextSearch = normalizeSearch(routeSearchState.search);
    if (search !== nextSearch) {
      setSearch(nextSearch);
    }

    if (status !== routeSearchState.status) {
      setStatus(routeSearchState.status);
    }
  }, [routeSearchState, search, status]);

  useEffect(() => {
    const nextSearch = normalizeSearch(debouncedSearch);
    const currentSearch = normalizeSearch(searchParams.get(USERS_PAGE_QUERY_KEYS.search));
    const currentStatus = parseUsersStatus(searchParams.get(USERS_PAGE_QUERY_KEYS.status));

    if (currentSearch === nextSearch && currentStatus === status) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete(USERS_PAGE_QUERY_KEYS.legacySelected);

    if (nextSearch) {
      params.set(USERS_PAGE_QUERY_KEYS.search, nextSearch);
    } else {
      params.delete(USERS_PAGE_QUERY_KEYS.search);
    }

    if (status === 'all') {
      params.delete(USERS_PAGE_QUERY_KEYS.status);
    } else {
      params.set(USERS_PAGE_QUERY_KEYS.status, status);
    }

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [debouncedSearch, pathname, router, searchParams, status]);

  useEffect(() => {
    let cancelled = false;

    const loadSummary = async () => {
      setIsSummaryLoading(true);
      setSummaryError(false);

      try {
        const nextSummary = await getTenantUsersDirectorySummary();

        if (!cancelled) {
          setSummary(nextSummary);
        }
      } catch {
        if (!cancelled) {
          setSummary(null);
          setSummaryError(true);
        }
      } finally {
        if (!cancelled) {
          setIsSummaryLoading(false);
        }
      }
    };

    void loadSummary();

    return () => {
      cancelled = true;
    };
  }, [summaryReloadToken]);

  useEffect(() => {
    if (!shouldFetchSearch) {
      setPages([]);
      setNextCursor(null);
      setHasNextPage(false);
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
      setIsDirectoryInitialLoading(false);
      setIsDirectoryRefreshing(false);
      setDirectoryError(null);
      return;
    }

    const abortController = new AbortController();

    const loadDirectory = async () => {
      const cachedDirectory = directoryCacheRef.current.get(directoryQueryKey);
      const hasExistingItems = cachedDirectory
        ? dedupeDirectoryItems(cachedDirectory.pages).length > 0
        : directoryItemsCountRef.current > 0;

      if (cachedDirectory) {
        setPages(cachedDirectory.pages);
        setNextCursor(cachedDirectory.nextCursor);
        setHasNextPage(cachedDirectory.hasNextPage);
      }

      setDirectoryError(null);
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
      setIsDirectoryInitialLoading(!hasExistingItems);
      setIsDirectoryRefreshing(hasExistingItems);

      try {
        const page = await getTenantUsersDirectoryPage({
          q: remoteSearch,
          status,
          limit: DIRECTORY_LIMIT,
          signal: abortController.signal,
        });

        cacheDirectoryPages(directoryQueryKey, [page], page.nextCursor, page.hasNextPage);
        setPages([page]);
        setNextCursor(page.nextCursor);
        setHasNextPage(page.hasNextPage);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        setPages([]);
        setNextCursor(null);
        setHasNextPage(false);
        setDirectoryError(getErrorMessage(error, directoryErrorTitle));
      } finally {
        if (!abortController.signal.aborted) {
          setIsDirectoryInitialLoading(false);
          setIsDirectoryRefreshing(false);
        }
      }
    };

    void loadDirectory();

    return () => {
      abortController.abort();
    };
  }, [
    directoryReloadToken,
    directoryQueryKey,
    cacheDirectoryPages,
    directoryErrorTitle,
    normalizedDebouncedSearch,
    remoteSearch,
    shouldFetchSearch,
    status,
  ]);

  useEffect(() => {
    if (routeMode !== 'detail' || !routeSelectedEntryId) {
      setDetail(null);
      setDetailError(null);
      setIsDetailLoading(false);
      return;
    }

    const abortController = new AbortController();

    const loadDetail = async () => {
      setIsDetailLoading(true);
      setDetailError(null);

      try {
        const nextDetail = await getTenantUserDirectoryDetail(
          routeSelectedEntryId,
          abortController.signal
        );

        setDetail(nextDetail);
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        setDetail(null);
        setDetailError(getErrorMessage(error, detailErrorTitle));
      } finally {
        if (!abortController.signal.aborted) {
          setIsDetailLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      abortController.abort();
    };
  }, [detailErrorTitle, detailReloadToken, routeMode, routeSelectedEntryId]);

  const updateRouteState = useCallback(
    (nextMode: UsersPageMode, nextSelectedEntryId?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete(USERS_PAGE_QUERY_KEYS.legacySelected);

      if (nextMode === 'empty') {
        params.delete(USERS_PAGE_QUERY_KEYS.mode);
        params.delete(USERS_PAGE_QUERY_KEYS.selected);
      } else {
        params.set(USERS_PAGE_QUERY_KEYS.mode, nextMode);

        if (nextSelectedEntryId) {
          params.set(USERS_PAGE_QUERY_KEYS.selected, nextSelectedEntryId);
        } else {
          params.delete(USERS_PAGE_QUERY_KEYS.selected);
        }
      }

      const nextQuery = params.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const refreshDirectory = useCallback(() => {
    setDirectoryReloadToken((current) => current + 1);
  }, []);

  const refreshSummary = useCallback(() => {
    setSummaryReloadToken((current) => current + 1);
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (
      !hasNextPage ||
      !nextCursor ||
      isLoadingMore ||
      isLoadingMoreRef.current ||
      isDirectoryRefreshing
    ) {
      return;
    }

    const requestedDirectoryQueryKey = directoryQueryKey;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      const page = await getTenantUsersDirectoryPage({
        q: remoteSearch,
        status,
        cursor: nextCursor,
        limit: DIRECTORY_LIMIT,
      });

      if (directoryQueryKeyRef.current === requestedDirectoryQueryKey) {
        const nextPages = [...pages, page];
        cacheDirectoryPages(
          requestedDirectoryQueryKey,
          nextPages,
          page.nextCursor,
          page.hasNextPage
        );
        setPages(nextPages);
        setNextCursor(page.nextCursor);
        setHasNextPage(page.hasNextPage);
      }
    } catch (error) {
      if (directoryQueryKeyRef.current === requestedDirectoryQueryKey) {
        setDirectoryError(getErrorMessage(error, directoryErrorTitle));
      }
    } finally {
      if (directoryQueryKeyRef.current === requestedDirectoryQueryKey) {
        isLoadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [
    cacheDirectoryPages,
    directoryErrorTitle,
    directoryQueryKey,
    hasNextPage,
    isDirectoryRefreshing,
    isLoadingMore,
    nextCursor,
    pages,
    remoteSearch,
    status,
  ]);

  loadNextDirectoryPageRef.current = () => {
    void handleLoadMore();
  };

  const handleSelectEntry = (entryId: string) => updateRouteState('detail', entryId);

  const handleReturnFromDetail = useCallback(() => {
    pendingEntryRestoreRef.current = routeSelectedEntryId;

    const params = new URLSearchParams(searchParams.toString());

    params.delete(USERS_PAGE_QUERY_KEYS.legacySelected);
    params.set(USERS_PAGE_QUERY_KEYS.mode, 'empty');

    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [pathname, router, routeSelectedEntryId, searchParams]);

  const handleRetryList = () => {
    setDirectoryError(null);
    refreshDirectory();
  };

  const resetSelectionForQuery = () => {
    if (routeSelectedEntryId) {
      updateRouteState('empty');
    }
  };

  const handleSearchChange = (value: string) => {
    resetSelectionForQuery();
    setSearch(value);
  };

  const handleSummarySelect = (nextStatus: UsersPageStatusFilter) => {
    resetSelectionForQuery();
    setStatus(nextStatus);
  };

  const summaryItems = useMemo(
    () => buildUsersSummary(summary, summaryCopy),
    [summary, summaryCopy]
  );

  return (
    <UsersPageView
      detail={
        <UsersPageDetailRouter
          copy={usersPageCopy.panels}
          locale={lang}
          mode={routeMode}
          selectedEntryId={routeSelectedEntryId}
          detail={detail}
          isLoading={isDetailLoading}
          error={detailError}
          onDetailRefresh={() => setDetailReloadToken((current) => current + 1)}
          onReturnFromDetail={handleReturnFromDetail}
        />
      }
      detailLabel={usersPageCopy.detail.detailLabel}
      directoryFeedback={usersPageCopy.feedback}
      directoryItemCopy={usersPageCopy.directoryItem}
      directoryItems={directoryItems}
      directoryError={directoryError}
      directoryHint={
        normalizeSearch(search).length === 1
          ? usersPageCopy.feedback.searchMinimumLabel
          : usersPageCopy.list.hint
      }
      directorySectionLabel={usersPageCopy.list.sectionLabel}
      directoryTitle={usersPageCopy.list.title}
      emptyTitle={usersPageCopy.list.emptyTitle}
      emptyDescription={usersPageCopy.list.emptyDescription}
      noResultsTitle={usersPageCopy.list.noResultsTitle}
      noResultsDescription={usersPageCopy.list.noResultsDescription}
      filters={{
        ariaLabel: usersPageCopy.filters.ariaLabel,
        searchLabel: usersPageCopy.filters.searchLabel,
        searchPlaceholder: usersPageCopy.filters.searchPlaceholder,
        searchValue: search,
        selectLabel: usersPageCopy.filters.selectLabel,
        selectOptions: usersPageCopy.statusOptions.filter(
          (option) => option.value === 'all' || option.value === 'invitations'
        ),
        selectValue: status,
      }}
      hasNextPage={hasNextPage}
      isDirectoryLoading={isDirectoryInitialLoading}
      isDirectoryRefreshing={isDirectoryRefreshing}
      isLoadingMore={isLoadingMore}
      isSummaryLoading={isSummaryLoading}
      mode={routeMode}
      navigationLabel={usersPageCopy.detail.navigationLabel}
      onLoadMore={handleLoadMore}
      onRegisterEntryElement={registerDirectoryEntryElement}
      onRetryDirectory={handleRetryList}
      onRetrySummary={refreshSummary}
      onSearchChange={handleSearchChange}
      onSelectChange={(value) => handleSummarySelect(parseUsersStatus(value))}
      onSelectEntry={handleSelectEntry}
      onSummarySelect={handleSummarySelect}
      selectedEntryId={routeSelectedEntryId}
      summaryItems={summaryItems}
      summaryError={summaryError}
      summaryFeedback={{
        loadingLabel: summaryCopy.loading,
        errorLabel: summaryCopy.error,
        retryLabel: summaryCopy.retry,
      }}
    />
  );
}
