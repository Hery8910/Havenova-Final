'use client';

import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';

import styles from './ProfileHeader.module.css';
import { ProfileCompletionBadge } from '../profileCompletionBadge/ProfileCompletionBadge';
import { useAuth, useI18n, useProfile } from '../../../contexts';
import AvatarSelector from '../avatarSelector/AvatarSelector';

export function ProfileHeader() {
  const { profile } = useProfile();
  const { auth } = useAuth();
  const { texts } = useI18n();
  const profileTexts = texts?.pages?.client.user.profile;
  const labels = texts.pages.client.user.profileHeader;

  const name = profile?.name || labels?.missingName;
  const email = auth?.email || '—';
  const verified = auth?.isVerified ?? 'Verifiziert';
  const avatar = profile?.profileImage || '/avatars/avatar-1.png';

  const avatarAlt = profile.name
    ? `${profile.name} avatar`
    : (profileTexts?.manageAccount ?? 'User avatar');
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
    <header
      className={`${styles.header} card`}
      role="banner"
      aria-label={labels?.ariaLabel ?? 'User area'}
    >
      <div className={styles.wrapper}>
        <aside className={styles.aside}>
          <Image
            src={normalizeAvatar(profile.profileImage) || '/avatars/avatar-5.png'}
            alt={avatarAlt}
            width={100}
            height={100}
            className={styles.image}
          />
          <AvatarSelector />
        </aside>

        <article className={styles.article}>
          <span
            className={`${styles.badge} ${verified ? styles.verified : styles.unverified}`}
            role="status"
            aria-label={labels?.verifiedAria ?? 'Konto verifiziert'}
          >
            <FaCheckCircle aria-hidden="true" />
            {labels?.verified ?? 'Verifiziert'}
          </span>
          <p className={styles.name}>{name ?? labels?.missingName ?? '—'}</p>
          <p className={styles.email}>{email ?? '—'}</p>
          <p className={styles.email}>
            {profileTexts?.memberSince}{' '}
            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ''}
          </p>
        </article>
      </div>
      <ProfileCompletionBadge profile={profile} texts={labels?.completion} />
    </header>
  );
}
