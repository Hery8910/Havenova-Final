'use client';

import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';

import styles from './ProfileHeader.module.css';
import { useProfile } from '@/packages/contexts/profile/ProfileContext';
import { useAuth } from '@/packages/contexts/auth/authContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';

export function ProfileHeader() {
  const { profile } = useProfile();
  const { auth } = useAuth();
  const { texts } = useI18n();
  const labels = texts.pages.user.profileHeader;

  const name = profile?.name || labels?.missingName;
  const email = auth?.email || '—';
  const verified = auth?.isVerified ?? 'Verifiziert';
  const avatar = profile?.profileImage || '/avatars/avatar-1.svg';
  const hasData = Boolean(name && email && verified);

  return (
    <header
      className={`${styles.header} card`}
      role="banner"
      aria-label={labels?.ariaLabel ?? 'User area'}
    >
      <article className={styles.avatarWrapper}>
        <Image className={styles.avatar} src={avatar} alt="" width={56} height={56} />
        <div className={styles.meta}>
          <p className={styles.name}>{name ?? labels?.missingName ?? '—'}</p>
          <p className={styles.email}>{email ?? '—'}</p>
          <span
            className={`${styles.badge} ${verified ? styles.verified : styles.unverified}`}
            role="status"
            aria-label={labels?.verifiedAria ?? 'Konto verifiziert'}
          >
            <FaCheckCircle />
            {labels?.verified ?? 'Verifiziert'}
          </span>
        </div>
      </article>
      <Image
        className={styles.heroImg}
        src="/images/pages/profile-header.webp"
        alt=""
        width={300}
        height={150}
        priority
      />
    </header>
  );
}
