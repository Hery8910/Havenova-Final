import { DirectoryFilters, DirectoryIntro, DirectoryList, DirectorySummary } from '../../../components/directory';
import { MasterDetailPage } from '../../../components/masterDetail';
import { TenantUserDirectoryItem } from '../../../components/people/users';
import type { UsersPageViewProps } from '../page.types';
import styles from './UsersPageView.module.css';

export function UsersPageView({
  detail,
  detailLabel,
  directoryItems,
  directoryError = null,
  directoryHint,
  directorySectionLabel,
  directoryTitle,
  emptyDescription,
  emptyTitle,
  filters,
  header,
  isDirectoryLoading = false,
  mode,
  navigationLabel,
  onOpenInvite,
  onRetryDirectory,
  onSearchChange,
  onSelectChange,
  onSelectUser,
  selectedUserClientId,
  summaryItems,
  tenantUserLocale,
}: UsersPageViewProps) {
  return (
    <MasterDetailPage
      navigation={
        <div className={styles.navigation}>
          <section className={styles.header}>
            <div className={styles.headerTop}>
              <DirectoryIntro
                eyebrow={header.eyebrow}
                title={header.title}
                description={header.description}
              />
              <div className={styles.headerActions}>
                <button
                  type="button"
                  className={`button button--primary ${styles.headerButton}`}
                  onClick={onOpenInvite}
                >
                  {header.primaryActionLabel}
                </button>
              </div>
            </div>
            <p className={styles.modeHint}>
              {mode === 'invite'
                ? 'The right panel is currently showing the invite flow.'
                : 'Select a record from the directory to keep the detail panel in sync.'}
            </p>
          </section>

          <DirectorySummary items={summaryItems} />

          <DirectoryFilters
            searchLabel={filters.searchLabel}
            searchPlaceholder={filters.searchPlaceholder}
            searchValue={filters.searchValue}
            onSearchChange={onSearchChange}
            selectLabel={filters.selectLabel}
            selectValue={filters.selectValue}
            selectOptions={filters.selectOptions}
            onSelectChange={onSelectChange}
          />

          <DirectoryList
            sectionLabel={directorySectionLabel}
            title={directoryTitle}
            hint={directoryHint}
            items={directoryItems}
            isLoading={isDirectoryLoading}
            error={directoryError}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            onRetry={onRetryDirectory}
            renderItem={(item) => (
              <TenantUserDirectoryItem
                key={item.userClientId}
                item={item}
                locale={tenantUserLocale}
                isActive={selectedUserClientId === item.userClientId}
                onSelect={onSelectUser}
              />
            )}
          />
        </div>
      }
      detail={detail}
      navigationLabel={navigationLabel}
      detailLabel={detailLabel}
    />
  );
}
