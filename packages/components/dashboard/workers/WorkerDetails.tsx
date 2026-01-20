'use client';

import styles from './WorkerDetails.module.css';
import { formatMessageAge } from '../../../utils';
import type { WorkerDetailData } from '../../../types/worker/workerTypes';
import Image from 'next/image';
import { useI18n } from '../../../contexts/i18n/I18nContext';
import { StatusBadge } from '../statusBadge';

interface WorkerDetailsProps {
  worker: WorkerDetailData | null;
  loading?: boolean;
  title?: string;
  emptyLabel?: string;
  loadingLabel?: string;
}

const WorkerDetails = ({
  worker,
  loading = false,
  title,
  emptyLabel,
  loadingLabel,
}: WorkerDetailsProps) => {
  const { texts, language } = useI18n();
  const detailTexts = texts.components?.dashboard?.pages?.employees?.details;
  const relativeTime = texts.date?.relative;

  const resolvedTitle = title ?? detailTexts?.title ?? 'Worker details';
  const resolvedEmpty = emptyLabel ?? detailTexts?.emptyLabel ?? 'Select a worker to see details.';
  const resolvedLoading = loadingLabel ?? detailTexts?.loadingLabel ?? 'Loading worker details...';
  const phoneLabel = detailTexts?.phoneLabel ?? 'Phone';
  const addressLabel = detailTexts?.addressLabel ?? 'Address';
  const languageLabel = detailTexts?.languageLabel ?? 'Language';
  const userStatusLabel = detailTexts?.userStatusLabel ?? 'User status';
  const verifiedLabel = detailTexts?.verifiedLabel ?? 'Verified';
  const roleLabel = detailTexts?.roleLabel ?? 'Role';
  const accessStatusLabel = detailTexts?.accessStatusLabel ?? 'Access status';
  const createdLabel = detailTexts?.createdLabel ?? 'Created';
  const updatedLabel = detailTexts?.updatedLabel ?? 'Updated';
  const extraLabel = detailTexts?.extraLabel ?? 'Extra';
  const yesLabel = detailTexts?.yesLabel ?? 'Yes';
  const noLabel = detailTexts?.noLabel ?? 'No';
  if (loading) {
    return (
      <section className={styles.section}>
        <p className="text-label">{resolvedTitle}</p>
        <p className={styles.empty}>{resolvedLoading}</p>
      </section>
    );
  }

  if (!worker) {
    return (
      <section className={styles.section}>
        <p className="text-label">{resolvedTitle}</p>
        <p className={styles.empty}>{resolvedEmpty}</p>
      </section>
    );
  }

  const avatarSrc = worker.profileImage || '/avatars/avatar-1.png';
  const extraContent = worker.extra ? JSON.stringify(worker.extra, null, 2) : null;

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.headerDiv}>
          <StatusBadge label={worker.status} isActive={worker.isVerified} />
          <span className={styles.badge}>{worker.jobTitle || '-'}</span>
        </div>
        <aside className={styles.avatarWrap}>
          {avatarSrc && (
            <Image
              className={styles.avatar}
              src={avatarSrc}
              alt={`${worker.name}'s profile picture`}
              width={72}
              height={72}
            />
          )}
          <div className={styles.identity}>
            <h2 className={styles.name}>{worker.name || '-'}</h2>
            <p className={styles.email}>{worker.email || '-'}</p>
          </div>
        </aside>
      </header>

      <ul className={styles.infoUl}>
        <li key={phoneLabel} className={styles.infoCard}>
          <p className="text-label">{phoneLabel}</p>
          <p className={styles.infoValue}>{worker.phone || '-'}</p>
        </li>
        <li key={phoneLabel} className={styles.infoCard}>
          <p className="text-label">{addressLabel}</p>
          <p className={styles.infoValue}>{worker.address || '-'}</p>
        </li>
        <li key={phoneLabel} className={styles.infoCard}>
          <p className="text-label">{languageLabel}</p>
          <p className={styles.infoValue}>{worker.language || '-'}</p>
        </li>
        <li key={userStatusLabel} className={styles.infoCard}>
          <p className="text-label">{userStatusLabel}</p>
          <p className={styles.infoValue}>{worker.status || '-'}</p>
        </li>
        <li key={verifiedLabel} className={styles.infoCard}>
          <p className="text-label">{verifiedLabel}</p>
          <p className={styles.infoValue}>
            {worker.isVerified === undefined ? '-' : worker.isVerified ? yesLabel : noLabel}
          </p>
        </li>
        <li key={roleLabel} className={styles.infoCard}>
          <p className="text-label">{roleLabel}</p>
          <p className={styles.infoValue}>{worker.role || '-'}</p>
        </li>
        <li key={accessStatusLabel} className={styles.infoCard}>
          <p className="text-label">{accessStatusLabel}</p>
          <p className={styles.infoValue}>{worker.status || '-'}</p>
        </li>

        <li key={createdLabel} className={styles.infoCard}>
          <p className="text-label">{createdLabel}</p>
          <p className={styles.infoValue}>
            {worker.createdAt
              ? formatMessageAge(worker.createdAt, { relativeTime, locale: language })
              : '-'}
          </p>
        </li>
        <li key={updatedLabel} className={styles.infoCard}>
          <p className="text-label">{updatedLabel}</p>
          <p className={styles.infoValue}>
            {worker.updatedAt
              ? formatMessageAge(worker.updatedAt, { relativeTime, locale: language })
              : '-'}
          </p>
        </li>
      </ul>
    </section>
  );
};

export default WorkerDetails;
