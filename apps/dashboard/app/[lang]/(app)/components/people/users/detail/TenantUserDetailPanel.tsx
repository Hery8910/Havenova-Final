'use client';

import type {
  TenantUserDirectoryAddress,
  TenantUserDirectoryDetail,
  TenantUserInvitationStatus,
} from '@/packages/types';
import styles from './TenantUserDetailPanel.module.css';
import type { UsersDetailPanelCopy } from '../../../../people/users/page.types';

type TenantUserDetailPanelProps = {
  copy: UsersDetailPanelCopy['detail'];
  locale: string;
  entryId?: string;
  detail?: TenantUserDirectoryDetail | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onReturnToDirectory: () => void;
};

const formatDate = (value: string | null | undefined, locale: string, fallback: string) => {
  if (!value) return fallback;

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

const invitationLabel = (
  status: TenantUserInvitationStatus,
  copy: UsersDetailPanelCopy['detail']
) =>
  status === 'expired' ? copy.invitationStatusLabels.expired : copy.invitationStatusLabels.pending;

const formatAddress = (address: TenantUserDirectoryAddress | null) => {
  if (!address) return null;

  return [
    [address.street, address.streetNumber].filter(Boolean).join(' '),
    [address.postalCode, address.district].filter(Boolean).join(' '),
    address.floor ? address.floor : null,
  ]
    .filter(Boolean)
    .join(', ');
};

export function TenantUserDetailPanel({
  copy,
  locale,
  entryId,
  detail = null,
  isLoading = false,
  error = null,
  onRetry,
  onReturnToDirectory,
}: TenantUserDetailPanelProps) {
  if (!entryId) {
    return (
      <section className={styles.root} aria-labelledby="tenant-user-detail-empty-title">
        <div className={styles.emptyState}>
          <p className={styles.eyebrow}>{copy.emptyEyebrow}</p>
          <h2 id="tenant-user-detail-empty-title" className={styles.emptyTitle}>
            {copy.emptyTitle}
          </h2>
          <p className={styles.emptyDescription}>{copy.emptyDescription}</p>
        </div>
      </section>
    );
  }

  if (isLoading)
    return (
      <section className={styles.root} aria-live="polite">
        <p className={styles.emptyDescription}>{copy.loadingLabel}</p>
      </section>
    );

  if (error) {
    return (
      <section className={styles.root}>
        <article className={styles.errorCard}>
          <p className={styles.eyebrow}>{copy.errorEyebrow}</p>
          <h2 className={styles.errorTitle}>{copy.errorTitle}</h2>
          <p className={styles.errorText}>{error}</p>
          {onRetry ? (
            <button type="button" className="button button--outline" onClick={onRetry}>
              {copy.retryLabel}
            </button>
          ) : null}
        </article>
      </section>
    );
  }

  if (!detail) return null;

  const displayName = detail.identity.displayName?.trim() || copy.pendingProfileFallback;
  const invitation = detail.invitation;
  const profile = detail.kind === 'user' ? detail.profile : null;
  const isInvitation = detail.kind === 'invitation';
  const address = profile?.primaryAddress ? formatAddress(profile.primaryAddress) : null;
  const profileHasMissingFields = profile?.exists && (!profile.language || !address);

  return (
    <section className={styles.root} aria-labelledby="tenant-user-detail-title">
      <button
        type="button"
        className={`button button--outline ${styles.mobileBackAction}`}
        onClick={onReturnToDirectory}
      >
        {copy.returnToDirectoryLabel}
      </button>
      <header className={styles.identity}>
        <p className={styles.eyebrow}>
          {isInvitation ? copy.invitationEyebrow : copy.personEyebrow}
        </p>
        <div className={styles.identityMain}>
          <div className={styles.identityCopy}>
            <h2 id="tenant-user-detail-title" className={styles.title}>
              {displayName}
            </h2>
            <p className={styles.email}>{detail.identity.email}</p>
          </div>
        </div>
      </header>

      <section className={styles.contentSection} aria-labelledby="tenant-user-identity-title">
        <h3 id="tenant-user-identity-title" className={styles.sectionTitle}>
          {isInvitation ? copy.proposedIdentityLabel : copy.identityLabel}
        </h3>
        {isInvitation ? (
          <p className={styles.sectionDescription}>{copy.proposedIdentityDescription}</p>
        ) : null}
        <dl className={styles.dataList}>
          <div className={styles.row}>
            <dt className={styles.fieldLabel}>{copy.emailLabel}</dt>
            <dd className={styles.fieldValue}>{detail.identity.email}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.fieldLabel}>{copy.phoneLabel}</dt>
            <dd className={styles.fieldValue}>
              {detail.identity.phone || copy.missingValueFallback}
            </dd>
          </div>
        </dl>
      </section>

      {!isInvitation ? (
        <section className={styles.contentSection} aria-labelledby="tenant-user-profile-title">
          <h3 id="tenant-user-profile-title" className={styles.sectionTitle}>
            {copy.profileLabel}
          </h3>
          {!profile?.exists ? (
            <p className={styles.sectionDescription}>{copy.profileNotCreatedDescription}</p>
          ) : (
            <>
              {profileHasMissingFields ? (
                <p className={styles.sectionDescription}>{copy.profileIncompleteDescription}</p>
              ) : null}
              <dl className={styles.dataList}>
                <div className={styles.row}>
                  <dt className={styles.fieldLabel}>{copy.languageLabel}</dt>
                  <dd className={styles.fieldValue}>
                    {profile.language
                      ? copy.languageLabels[profile.language]
                      : copy.missingValueFallback}
                  </dd>
                </div>
                <div className={styles.row}>
                  <dt className={styles.fieldLabel}>{copy.addressLabel}</dt>
                  <dd className={styles.fieldValue}>{address || copy.missingValueFallback}</dd>
                </div>
              </dl>
            </>
          )}
        </section>
      ) : null}
      {invitation ? (
        <section className={styles.contentSection} aria-labelledby="tenant-user-invitation-title">
          <h3 id="tenant-user-invitation-title" className={styles.sectionTitle}>
            {copy.invitationLabel}
          </h3>
          <dl className={styles.dataList}>
            <div className={styles.row}>
              <dt className={styles.fieldLabel}>{copy.statusLabel}</dt>
              <dd className={styles.fieldValue}>{invitationLabel(invitation.status, copy)}</dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.fieldLabel}>{copy.invitationExpiresLabel}</dt>
              <dd className={styles.fieldValue}>
                {formatDate(invitation.expiresAt, locale, copy.missingValueFallback)}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}
    </section>
  );
}
