'use client';

import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';

import styles from './ProfileHeader.module.css';
import { useAuth } from '../../../../../contexts/auth/authContext';
import { useI18n } from '../../../../../contexts/i18n/I18nContext';
import { useProfile } from '../../../../../contexts/profile/ProfileContext';

export function ProfileHeader() {
  const { profile } = useProfile();
  const { auth } = useAuth();
  const { texts } = useI18n();
  const profileTexts = texts?.pages?.client.user.profile;
  const labels = texts.pages.client.user.profileHeader;

  const greeting = labels?.greeting || 'Willkommen zurück,';
  const name = profile?.name || labels?.missingName;
  const verified = auth?.isVerified ?? 'Verifiziert';

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
    <div className={styles.wrapper} role="banner" aria-label={labels?.ariaLabel ?? 'User area'}>
      <aside className={styles.aside}>
        <p className={styles.greeting}>{greeting}</p>
      </aside>

      <article className={styles.article}>
        <Image
          src={normalizeAvatar(profile.profileImage) || '/avatars/avatar-5.png'}
          alt={avatarAlt}
          width={40}
          height={40}
          className={styles.image}
        />
        <div className={styles.info}>
          <h3 className={!name ? `${styles.name}` : `${styles.missingName}`}>
            {name ?? labels?.missingName ?? '—'}
          </h3>
          <span
            className={`${styles.badge} ${verified ? styles.verified : styles.unverified}`}
            role="status"
            aria-label={labels?.verifiedAria ?? 'Konto verifiziert'}
          >
            <FaCheckCircle aria-hidden="true" />
            {labels?.verified ?? 'Verifiziert'}
          </span>
        </div>
      </article>
    </div>
  );
}
