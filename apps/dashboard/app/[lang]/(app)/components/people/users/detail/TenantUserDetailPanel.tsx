import type { TenantUserDetail } from '@/packages/types';
import { PersonStatusBadge } from '../../shared';
import styles from './TenantUserDetailPanel.module.css';

type TenantUserDetailPanelProps = {
  locale: string;
  userClientId?: string;
  detail?: TenantUserDetail | null;
  isLoading?: boolean;
  error?: string | null;
};

export function TenantUserDetailPanel({
  locale,
  userClientId,
  detail = null,
  isLoading = false,
  error = null,
}: TenantUserDetailPanelProps) {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (!userClientId) {
    return (
      <section className={styles.root} aria-labelledby="tenant-user-detail-empty-title">
        <div className={styles.emptyState}>
          <p className={styles.eyebrow}>Detail</p>
          <h2 id="tenant-user-detail-empty-title" className={styles.emptyTitle}>
            Select a tenant user
          </h2>
          <p className={styles.emptyDescription}>
            This panel is reserved for the selected record. Once a user is selected from the list,
            this area can host profile data, invite actions, activity, and account state.
          </p>
        </div>

        <article className={styles.emptyCard}>
          <p className={styles.fieldLabel}>Expected structure</p>
          <p className={styles.fieldValue}>auth + userClient + optional profile</p>
          <p className={styles.fieldHint}>
            The right side stays stable while the left directory changes with filters and search.
          </p>
        </article>
      </section>
    );
  }

  if (isLoading) {
    return <p className={styles.description}>Loading tenant user detail…</p>;
  }

  if (error) {
    return (
      <section className={styles.root}>
        <article className={styles.errorCard}>
          <p className={styles.eyebrow}>Detail</p>
          <h2 className={styles.errorTitle}>Could not load tenant user.</h2>
          <p className={styles.errorText}>{error}</p>
        </article>
      </section>
    );
  }

  if (!detail) {
    return null;
  }

  return (
    <section className={styles.root} aria-labelledby="tenant-user-detail-title">
      <header className={styles.hero}>
        <p className={styles.eyebrow}>User detail</p>
        <h2 id="tenant-user-detail-title" className={styles.title}>
          {detail.profile?.name?.trim() || detail.email}
        </h2>
        <p className={styles.description}>
          Stable detail surface for the tenant user branch of the shared people family.
        </p>
        <div className={styles.statusRow}>
          <PersonStatusBadge
            status={detail.userClientStatus}
            isVerified={detail.isVerified}
            hasProfile={detail.hasProfile}
            profileCompleteness={detail.profileCompleteness}
          />
        </div>
      </header>

      <section className={styles.metaGrid} aria-label="Tenant user metadata">
        <article className={styles.metaCard}>
          <p className={styles.fieldLabel}>Email</p>
          <p className={styles.fieldValue}>{detail.email}</p>
        </article>
        <article className={styles.metaCard}>
          <p className={styles.fieldLabel}>Role</p>
          <p className={styles.fieldValue}>{detail.role}</p>
        </article>
        <article className={styles.metaCard}>
          <p className={styles.fieldLabel}>Created</p>
          <p className={styles.fieldValue}>{formatter.format(new Date(detail.createdAt))}</p>
        </article>
        <article className={styles.metaCard}>
          <p className={styles.fieldLabel}>Updated</p>
          <p className={styles.fieldValue}>{formatter.format(new Date(detail.updatedAt))}</p>
        </article>
      </section>

      <section className={styles.section} aria-labelledby="tenant-user-profile-section">
        <div>
          <p className={styles.sectionLabel}>Profile</p>
          <h2 id="tenant-user-profile-section" className={styles.sectionTitle}>
            Complement data
          </h2>
        </div>

        <div className={styles.detailsGrid}>
          <article className={styles.fieldCard}>
            <p className={styles.fieldLabel}>Name</p>
            <p className={styles.fieldValue}>{detail.profile?.name?.trim() || 'Pending profile'}</p>
          </article>
          <article className={styles.fieldCard}>
            <p className={styles.fieldLabel}>Phone</p>
            <p className={styles.fieldValue}>{detail.profile?.phone?.trim() || 'Not provided'}</p>
          </article>
          <article className={styles.fieldCard}>
            <p className={styles.fieldLabel}>Language</p>
            <p className={styles.fieldValue}>{detail.profile?.language || 'Not defined'}</p>
          </article>
          <article className={styles.fieldCard}>
            <p className={styles.fieldLabel}>Theme</p>
            <p className={styles.fieldValue}>{detail.profile?.theme || 'Not defined'}</p>
          </article>
        </div>
      </section>
    </section>
  );
}
