'use client';

import { useState } from 'react';

import { normalizeNavbarAvatar } from '@/packages/components/client/navbar/navbar.helpers';
import type { TenantUserDirectoryDetail, TenantUserInvitationStatus } from '@/packages/types';
import { PersonStatusBadge } from '../../shared';
import styles from './TenantUserDetailPanel.module.css';
import type { UsersDetailPanelCopy } from '../../../../people/users/page.types';

type TenantUserDetailPanelProps = {
  copy: UsersDetailPanelCopy['detail'];
  locale: string;
  entryId?: string;
  detail?: TenantUserDirectoryDetail | null;
  isLoading?: boolean;
  error?: string | null;
  feedback?: string | null;
  invitationAction?: 'resend' | 'revoke' | null;
  onRetry?: () => void;
  onReturnToDirectory: () => void;
  onResendInvitation: (invitationId: string) => Promise<void>;
  onRevokeInvitation: (invitationId: string) => Promise<void>;
};

const formatCopy = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

function getAvatarInitials(value: string) {
  const words = value
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length >= 2) {
    return `${words[0]?.[0] ?? ''}${words[1]?.[0] ?? ''}`.toUpperCase();
  }

  return value.slice(0, 2).toUpperCase();
}

const formatDate = (value: string | null | undefined, locale: string, fallback: string) => {
  if (!value) {
    return fallback;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

const resolveDetailStatus = (detail: TenantUserDirectoryDetail, copy: UsersDetailPanelCopy['detail']) => {
  if (detail.kind === 'invitation') {
    return detail.invitation?.status === 'expired'
      ? { label: copy.statusLabels.expired, tone: 'expired' as const }
      : { label: copy.statusLabels.invited, tone: 'invited' as const };
  }

  if (detail.access?.accountStatus === 'locked') {
    return { label: copy.statusLabels.locked, tone: 'locked' as const };
  }

  if (detail.access?.accountStatus === 'inactive') {
    return { label: copy.statusLabels.inactive, tone: 'inactive' as const };
  }

  return { label: copy.statusLabels.active, tone: 'active' as const };
};

const getInvitationStatusLabel = (status: TenantUserInvitationStatus, copy: UsersDetailPanelCopy['detail']) =>
  status === 'expired' ? copy.invitationStatusLabels.expired : copy.invitationStatusLabels.pending;

export function TenantUserDetailPanel({
  copy,
  locale,
  entryId,
  detail = null,
  isLoading = false,
  error = null,
  feedback = null,
  invitationAction = null,
  onRetry,
  onReturnToDirectory,
  onResendInvitation,
  onRevokeInvitation,
}: TenantUserDetailPanelProps) {
  const [isRevokeConfirmationOpen, setIsRevokeConfirmationOpen] = useState(false);

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

  if (isLoading) {
    return (
      <section className={styles.root} aria-live="polite">
        <p className={styles.emptyDescription}>{copy.loadingLabel}</p>
      </section>
    );
  }

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

  if (!detail) {
    return null;
  }

  const displayName = detail.identity.displayName?.trim() || copy.pendingProfileFallback;
  const avatarSrc = normalizeNavbarAvatar(detail.identity.profileImage ?? undefined);
  const avatarAlt = detail.identity.displayName?.trim() || detail.identity.email;
  const avatarInitials = getAvatarInitials(displayName || detail.identity.email);
  const status = resolveDetailStatus(detail, copy);
  const attentionReasons =
    detail.access?.attentionReasons ?? detail.invitation?.attentionReasons ?? [];
  const invitation = detail.invitation;
  const isInvitationActionSubmitting = invitationAction !== null;

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
        <div className={styles.identityMain}>
          {avatarSrc ? (
            <img src={avatarSrc} alt={avatarAlt} className={styles.avatarImage} />
          ) : (
            <div className={styles.avatarFallback} aria-hidden="true">
              {avatarInitials}
            </div>
          )}

          <div className={styles.identityCopy}>
            <div className={styles.titleBlock}>
              <h2 id="tenant-user-detail-title" className={styles.title}>
                {displayName}
              </h2>
              <p className={styles.email}>{detail.identity.email}</p>
              {detail.identity.phone ? <p className={styles.email}>{detail.identity.phone}</p> : null}
            </div>

            <div className={styles.statusRow}>
              <PersonStatusBadge status={status.tone} label={status.label} />
              {attentionReasons.map((reason) => (
                <PersonStatusBadge
                  key={reason}
                  status="attention"
                  label={copy.attentionReasons[reason]}
                />
              ))}
            </div>
          </div>
        </div>

        <dl className={styles.identityMeta}>
          <div className={styles.metaItem}>
            <dt className={styles.fieldLabel}>{copy.statusLabel}</dt>
            <dd className={styles.metaValue}>{status.label}</dd>
          </div>
          <div className={styles.metaItem}>
            <dt className={styles.fieldLabel}>{copy.createdLabel}</dt>
            <dd className={styles.metaValue}>
              {formatDate(detail.createdAt, locale, copy.missingValueFallback)}
            </dd>
          </div>
          <div className={styles.metaItem}>
            <dt className={styles.fieldLabel}>{copy.emailLabel}</dt>
            <dd className={styles.metaValue}>{detail.identity.email}</dd>
          </div>
        </dl>
      </header>

      {feedback ? (
        <p className={styles.emptyDescription} aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <dl className={styles.dataList}>
        <div className={styles.row}>
          <dt className={styles.fieldLabel}>{copy.profileLabel}</dt>
          <dd className={styles.fieldValue}>
            {detail.profile?.exists ? copy.availableLabel : copy.missingValueFallback}
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.fieldLabel}>{copy.languageLabel}</dt>
          <dd className={styles.fieldValue}>{detail.profile?.language ?? copy.missingValueFallback}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.fieldLabel}>{copy.requestsLabel}</dt>
          <dd className={styles.fieldValue}>
            {formatCopy(copy.requestsSummaryTemplate, {
              total: detail.relationshipSummary.requests.total,
              active: detail.relationshipSummary.requests.active,
            })}
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.fieldLabel}>{copy.nextAppointmentLabel}</dt>
          <dd className={styles.fieldValue}>
            {formatDate(
              detail.relationshipSummary.nextAppointmentAt,
              locale,
              copy.missingValueFallback
            )}
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.fieldLabel}>{copy.lastCompletedServiceLabel}</dt>
          <dd className={styles.fieldValue}>
            {formatDate(
              detail.relationshipSummary.lastCompletedServiceAt,
              locale,
              copy.missingValueFallback
            )}
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.fieldLabel}>{copy.workOrdersLabel}</dt>
          <dd className={styles.fieldValue}>
            {detail.relationshipSummary.workOrders
              ? `${detail.relationshipSummary.workOrders.total} total / ${detail.relationshipSummary.workOrders.active} active`
              : copy.workOrdersUnavailableLabel}
          </dd>
        </div>
      </dl>

      {invitation ? (
        <section className={styles.root} aria-labelledby="tenant-user-invitation-title">
          <h3 id="tenant-user-invitation-title" className={styles.errorTitle}>
            {copy.invitationLabel}
          </h3>
          <dl className={styles.dataList}>
            <div className={styles.row}>
              <dt className={styles.fieldLabel}>{copy.statusLabel}</dt>
              <dd className={styles.fieldValue}>{getInvitationStatusLabel(invitation.status, copy)}</dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.fieldLabel}>{copy.invitationExpiresLabel}</dt>
              <dd className={styles.fieldValue}>
                {formatDate(invitation.expiresAt, locale, copy.missingValueFallback)}
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.fieldLabel}>{copy.invitationLastSentLabel}</dt>
              <dd className={styles.fieldValue}>
                {formatDate(invitation.lastSentAt, locale, copy.missingValueFallback)}
              </dd>
            </div>
            <div className={styles.row}>
              <dt className={styles.fieldLabel}>{copy.invitationSendCountLabel}</dt>
              <dd className={styles.fieldValue}>{invitation.sendCount}</dd>
            </div>
          </dl>
          <div className={styles.statusRow}>
            {detail.availableActions.resendInvitation ? (
              <button
                type="button"
                className="button button--outline"
                disabled={isInvitationActionSubmitting}
                onClick={() => void onResendInvitation(invitation.invitationId)}
              >
                {invitationAction === 'resend'
                  ? copy.resendingInvitationLabel
                  : copy.resendInvitationLabel}
              </button>
            ) : null}
            {detail.availableActions.revokeInvitation ? (
              <button
                type="button"
                className="button button--outline"
                disabled={isInvitationActionSubmitting}
                onClick={() => setIsRevokeConfirmationOpen(true)}
              >
                {invitationAction === 'revoke'
                  ? copy.revokingInvitationLabel
                  : copy.revokeInvitationLabel}
              </button>
            ) : null}
          </div>
          {isRevokeConfirmationOpen ? (
            <section className={styles.confirmation} aria-labelledby="tenant-user-revoke-title">
              <h4 id="tenant-user-revoke-title" className={styles.errorTitle}>
                {copy.revokeConfirmationTitle}
              </h4>
              <p className={styles.emptyDescription}>{copy.revokeConfirmationDescription}</p>
              <div className={styles.statusRow}>
                <button
                  type="button"
                  className="button button--outline"
                  disabled={isInvitationActionSubmitting}
                  onClick={() => setIsRevokeConfirmationOpen(false)}
                >
                  {copy.revokeConfirmationCancelLabel}
                </button>
                <button
                  type="button"
                  className="button button--primary"
                  disabled={isInvitationActionSubmitting}
                  onClick={() => void onRevokeInvitation(invitation.invitationId)}
                >
                  {invitationAction === 'revoke'
                    ? copy.revokingInvitationLabel
                    : copy.revokeConfirmationConfirmLabel}
                </button>
              </div>
            </section>
          ) : null}
        </section>
      ) : null}
    </section>
  );
}
