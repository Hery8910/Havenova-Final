'use client';

import { formatUserAddress } from '../../../../../../types';
import { useProfile } from '../../../../../../contexts/profile/ProfileContext';
import type { UserAddress } from '../../../../../../types';
import type { ProfileSummaryRow } from '../types';
import { UserProfileDetailsForm, type UserProfileDetailsFormProps } from '../form';
import styles from './UserProfileDetailsSummary.module.css';
import { useAuth, useI18n } from '../../../../../../contexts';
import { useMemo } from 'react';
import Image from 'next/image';
import AvatarSelector from '../../avatarSelector/AvatarSelector';
import { formatNumericDate } from '../../../../../../utils/date/dateUtils';
import { ProfileCompletionBadge } from '../../profileCompletionBadge';

interface UserProfileDetailsSummaryProps {
  onEdit: () => void;
}

export function UserProfileDetailsSummary({ onEdit }: UserProfileDetailsSummaryProps) {
  const { auth } = useAuth();
  const { profile } = useProfile();
  const { texts } = useI18n();
  const profileTexts = texts?.pages?.client.user.profile;
  const detailTexts = texts?.pages?.client?.user?.profile?.details;
  const labels = texts.pages.client.user.profileHeader;

  const name = profile?.name || labels?.missingName;
  const emptyValue = detailTexts?.emptyValue ?? 'Not provided';
  const secondaryAddressLabel = detailTexts?.labels?.additionalAddress ?? 'Additional address';
  const isComplete = !profile.name || !profile.phone || !profile.primaryAddress;
  const summaryRows = useMemo<ProfileSummaryRow[]>(
    () => [
      {
        key: 'name',
        label: detailTexts?.labels?.name ?? 'Name',
        value: profile?.name?.trim() || emptyValue,
        isMuted: !profile?.name?.trim(),
      },
      {
        key: 'email',
        label: detailTexts?.labels?.email ?? 'Email',
        value: auth?.email?.trim() || emptyValue,
        isMuted: !auth?.email?.trim(),
      },
      {
        key: 'phone',
        label: detailTexts?.labels?.phone ?? 'Phone',
        value: profile?.phone?.trim() || emptyValue,
        isMuted: !profile?.phone?.trim(),
      },
      {
        key: 'primary-address',
        label: detailTexts?.labels?.primaryAddress ?? 'Primary address',
        value: profile?.primaryAddress ? formatUserAddress(profile.primaryAddress) : emptyValue,
        isMuted: !profile?.primaryAddress,
        address: profile?.primaryAddress,
      },
      ...(profile?.savedAddresses ?? []).map((entry, index) => ({
        key: `saved-address-${index}`,
        label: entry.label?.trim() || `${secondaryAddressLabel} ${index + 1}`,
        value: formatUserAddress(entry.address) || emptyValue,
        isMuted: !formatUserAddress(entry.address),
        address: entry.address,
      })),
    ],
    [
      auth?.email,
      detailTexts?.labels?.email,
      detailTexts?.labels?.name,
      detailTexts?.labels?.phone,
      detailTexts?.labels?.primaryAddress,
      emptyValue,
      profile?.name,
      profile?.phone,
      profile?.primaryAddress,
      profile?.savedAddresses,
      secondaryAddressLabel,
    ]
  );
  const avatarAlt = profile.name
    ? `${profile.name} avatar`
    : (profileTexts?.manageAccount ?? 'User avatar');
  const memberSinceDate = profile?.createdAt ? formatNumericDate(profile.createdAt) : '';
  const normalizeAvatar = (value?: string) => {
    if (!value) return '';
    if (value.startsWith('/')) return value;
    try {
      const parsed = new URL(value);
      if (parsed.pathname.startsWith('/avatars/')) return parsed.pathname;
    } catch {
      // ignore invalid URLs and return as-is
    }
    return value;
  };

  return (
    <section className={styles.card} aria-labelledby="profile-details-title">
      <header className={styles.header}>
        <h3 className={styles.title}>{detailTexts?.eyebrow}</h3>

        <button
          type="button"
          className={`button-edit ${!isComplete ? `` : `${styles.notCompleted}`}`}
          onClick={onEdit}
          aria-label={detailTexts?.editButton}
        >
          {detailTexts?.editButton}
        </button>
      </header>
      <div className={styles.wrapper}>
        <article className={styles.article}>
          <div className={styles.imageWrapper}>
            <AvatarSelector />
            <Image
              src={normalizeAvatar(profile.profileImage) || '/avatars/avatar-5.png'}
              alt={avatarAlt}
              width={100}
              height={100}
              className={styles.image}
            />
          </div>
          <h3 className={!profile.name ? `${styles.emptyName}` : `${styles.name}`}>{name}</h3>
          <p>
            {profileTexts?.memberSince} {memberSinceDate}
          </p>
        </article>
        <table className={styles.table} aria-label={detailTexts?.tableAriaLabel}>
          <tbody>
            {summaryRows.map((row, index) => (
              <tr
                key={row.key}
                className={`${styles.tableRow} ${index % 2 === 0 ? styles.tableRowEven : ''}`}
              >
                <th scope="row" className={styles.tableHeader}>
                  {row.label}
                </th>
                <td className={`${styles.tableCell} ${row.isMuted ? styles.muted : ''}`}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <aside className={`${styles.aside} ${isComplete ? `${styles.notCompletedAside}` : ''}`}>
        <div className={styles.asideWrapper}>
          <p className={`${styles.info} type-body-sm`}>* {labels?.completion.info}</p>
          {isComplete && (
            <button
              type="button"
              className={`${styles.notCompletedAsideButton} button-edit`}
              onClick={onEdit}
              aria-label={detailTexts?.editButton}
            >
              {detailTexts?.editButton}
            </button>
          )}
        </div>
        <ProfileCompletionBadge profile={profile} texts={labels?.completion} />
      </aside>
    </section>
  );
}
