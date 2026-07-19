import { DirectoryFilters, DirectoryList, DirectorySummary } from '../../../components/directory';
import { MasterDetailPage } from '../../../components/masterDetail';
import { TenantUserDirectoryItem } from '../../../components/people/users';
import type { UsersPageViewProps } from '../page.types';
import styles from './UsersPageView.module.css';

export function UsersPageView({
  detail,
  detailLabel,
  directoryFeedback,
  directoryItems,
  directoryError = null,
  directoryHint,
  directoryItemCopy,
  directorySectionLabel,
  directoryTitle,
  emptyDescription,
  emptyTitle,
  filters,
  hasNextPage = false,
  isDirectoryLoading = false,
  isDirectoryRefreshing = false,
  isLoadingMore = false,
  isSummaryLoading = false,
  mode,
  navigationLabel,
  noResultsDescription,
  noResultsTitle,
  onLoadMore,
  onRegisterEntryElement,
  onRetryDirectory,
  onRetrySummary,
  onSearchChange,
  onSelectChange,
  onSelectEntry,
  onSummarySelect,
  selectedEntryId,
  summaryItems,
  summaryError = false,
  summaryFeedback,
}: UsersPageViewProps) {
  const renderedSummaryItems = summaryItems.map((item) => ({
    ...item,
    isActive: filters.selectValue === item.status,
    onSelect: () => onSummarySelect(item.status),
  }));

  return (
    <MasterDetailPage
      mobileView={mode === 'empty' ? 'navigation' : 'detail'}
      navigation={
        <div className={styles.navigation}>
          <section className={styles.overview} aria-label="Page overview">
            <DirectorySummary items={renderedSummaryItems} />
            {isSummaryLoading ? (
              <p className={styles.summaryFeedback} aria-live="polite">
                {summaryFeedback.loadingLabel}
              </p>
            ) : null}
            {summaryError ? (
              <div className={styles.summaryFeedback} role="status">
                <span>{summaryFeedback.errorLabel}</span>
                {onRetrySummary ? (
                  <button type="button" className="button button--outline" onClick={onRetrySummary}>
                    {summaryFeedback.retryLabel}
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className={styles.filtersSection}>
            <DirectoryFilters
              ariaLabel={filters.ariaLabel}
              searchLabel={filters.searchLabel}
              searchPlaceholder={filters.searchPlaceholder}
              searchValue={filters.searchValue}
              onSearchChange={onSearchChange}
              selectLabel={filters.selectLabel}
              selectValue={filters.selectValue}
              selectOptions={filters.selectOptions}
              onSelectChange={onSelectChange}
            />
          </section>

          <section className={styles.directorySection}>
            <DirectoryList
              variant="primary"
              sectionLabel={directorySectionLabel}
              title={directoryTitle}
              hint={directoryHint}
              items={directoryItems}
              isLoading={isDirectoryLoading}
              error={directoryError}
              loadingLabel={directoryFeedback.loadingLabel}
              errorTitle={directoryFeedback.errorTitle}
              retryLabel={directoryFeedback.retryLabel}
              emptyTitle={emptyTitle}
              emptyDescription={emptyDescription}
              noResultsTitle={
                filters.searchValue || filters.selectValue !== 'all' ? noResultsTitle : undefined
              }
              noResultsDescription={
                filters.searchValue || filters.selectValue !== 'all'
                  ? noResultsDescription
                  : undefined
              }
              endOfResultsLabel={directoryFeedback.endOfResultsLabel}
              onRetry={onRetryDirectory}
              onLoadMore={onLoadMore}
              hasNextPage={hasNextPage}
              isLoadingMore={isLoadingMore}
              isRefreshing={isDirectoryRefreshing}
              loadingMoreLabel={directoryFeedback.loadingMoreLabel}
              loadMoreFallbackLabel={directoryFeedback.loadMoreFallbackLabel}
              renderItem={(item) => (
                <TenantUserDirectoryItem
                  key={item.entryId}
                  ref={(element) => onRegisterEntryElement(item.entryId, element)}
                  item={item}
                  copy={directoryItemCopy}
                  isActive={selectedEntryId === item.entryId}
                  onSelect={onSelectEntry}
                />
              )}
            />
          </section>
        </div>
      }
      detail={detail}
      navigationLabel={navigationLabel}
      detailLabel={detailLabel}
    />
  );
}
