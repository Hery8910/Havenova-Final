'use client';

import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';
import AvatarSelector from '../../../avatarSelector/AvatarSelector';
import { ProfileCompletionBadge } from '../../../profileCompletionBadge';
import type { UserClientProfile } from '../../../../../../../types';
import styles from './UserProfileIdentityCard.module.css';

export interface UserProfileIdentityCardProps {
  profile: UserClientProfile;
  name: string;
  avatarAlt: string;
  isVerified: boolean;
  verifiedLabel: string;
  verifiedAriaLabel: string;
  memberSinceLabel: string;
  memberSinceDate: string;
  showCompletionInfo: boolean;
  completionInfo: string;
  completionTexts?: {
    title?: string;
    info?: string;
    progressAriaLabel?: string;
    percentageAriaLabel?: string;
  };
}

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

export function UserProfileIdentityCard({
  profile,
  name,
  avatarAlt,
  isVerified,
  verifiedLabel,
  verifiedAriaLabel,
  memberSinceLabel,
  memberSinceDate,
  showCompletionInfo,
  completionInfo,
  completionTexts,
}: UserProfileIdentityCardProps) {
  const hasName = Boolean(profile.name?.trim());

  return (
    <section className={styles.card} aria-labelledby="profile-identity-title">
      {showCompletionInfo ? (
        <p className={`${styles.info} type-body-sm`}>* {completionInfo}</p>
      ) : null}
      <div className={styles.wapper}>
        <header className={styles.header}>
          <div className={styles.headerWapper}>
            <AvatarSelector />
            <Image
              src={normalizeAvatar(profile.profileImage) || '/avatars/avatar-5.png'}
              alt={avatarAlt}
              width={100}
              height={100}
              className={styles.image}
            />
          </div>
          <article className={styles.article}>
            <h3
              id="profile-identity-title"
              className={`type-title-md ${hasName ? styles.name : styles.emptyName}`}
            >
              {name}
            </h3>
            <span
              className={`${styles.badge} ${isVerified ? styles.verified : styles.unverified}`}
              role="status"
              aria-label={verifiedAriaLabel}
            >
              <FaCheckCircle aria-hidden="true" />
              {verifiedLabel}
            </span>
            <p className={styles.memberSince}>
              {memberSinceLabel} {memberSinceDate}
            </p>
          </article>
        </header>

        <ProfileCompletionBadge
          profile={profile}
          texts={completionTexts}
          emphasis="subtle-when-complete"
        />
      </div>
    </section>
  );
}
