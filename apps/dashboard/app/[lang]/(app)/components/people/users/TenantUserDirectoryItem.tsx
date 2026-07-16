import { forwardRef } from 'react';

import type { TenantUserDirectoryEntry } from '@/packages/types';
import { PersonStatusBadge } from '../shared';
import styles from './TenantUserDirectoryItem.module.css';
import type { UsersDirectoryItemCopy } from '../../../people/users/page.types';

type TenantUserDirectoryItemProps = {
  item: TenantUserDirectoryEntry;
  copy: UsersDirectoryItemCopy;
  locale: string;
  isActive?: boolean;
  onSelect: (entryId: string) => void;
};

const formatCopy = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

const resolveStatus = (item: TenantUserDirectoryEntry, copy: UsersDirectoryItemCopy) => {
  if (item.kind === 'invitation') {
    return item.invitationStatus === 'expired'
      ? { label: copy.statuses.expired, tone: 'expired' as const }
      : { label: copy.statuses.invited, tone: 'invited' as const };
  }

  if (item.accountStatus === 'locked') {
    return { label: copy.statuses.locked, tone: 'locked' as const };
  }

  if (item.accountStatus === 'inactive') {
    return { label: copy.statuses.inactive, tone: 'inactive' as const };
  }

  return { label: copy.statuses.active, tone: 'active' as const };
};

const formatDate = (value: string | null, locale: string) => {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

const buildMeta = (item: TenantUserDirectoryEntry, locale: string, copy: UsersDirectoryItemCopy) => {
  const meta: string[] = [];
  const attentionReason = item.attentionReasons[0];

  if (attentionReason) {
    meta.push(copy.attentionReasons[attentionReason]);
  }

  const nextAppointment = formatDate(item.relationshipSummary.nextAppointmentAt, locale);
  if (nextAppointment) {
    meta.push(formatCopy(copy.nextAppointmentTemplate, { date: nextAppointment }));
  }

  if (item.relationshipSummary.requests.active > 0) {
    meta.push(formatCopy(copy.activeRequestsTemplate, { count: item.relationshipSummary.requests.active }));
  }

  if (item.relationshipSummary.requests.total > 0) {
    meta.push(formatCopy(copy.totalRequestsTemplate, { count: item.relationshipSummary.requests.total }));
  }

  const lastCompletedService = formatDate(item.relationshipSummary.lastCompletedServiceAt, locale);
  if (lastCompletedService) {
    meta.push(formatCopy(copy.lastServiceTemplate, { date: lastCompletedService }));
  }

  if (!meta.length) {
    meta.push(copy.noRequestsFallback);
  }

  return meta.slice(0, 3).join(' · ');
};

export const TenantUserDirectoryItem = forwardRef<HTMLButtonElement, TenantUserDirectoryItemProps>(
  function TenantUserDirectoryItem({ item, copy, locale, isActive = false, onSelect }, ref) {
  const status = resolveStatus(item, copy);

  return (
    <button
      ref={ref}
      type="button"
      className={[styles.button, isActive ? styles.active : ''].filter(Boolean).join(' ')}
      aria-current={isActive ? 'true' : undefined}
      onClick={() => onSelect(item.entryId)}
    >
      <div className={styles.content}>
        <div className={styles.identity}>
          <p className={styles.name}>{item.displayName?.trim() || copy.pendingProfileFallback}</p>
          <p className={styles.meta}>{item.email}</p>
          <p className={styles.meta}>{buildMeta(item, locale, copy)}</p>
        </div>

        <div className={styles.statusColumn}>
          <PersonStatusBadge status={status.tone} label={status.label} />
        </div>
      </div>
    </button>
  );
  }
);
