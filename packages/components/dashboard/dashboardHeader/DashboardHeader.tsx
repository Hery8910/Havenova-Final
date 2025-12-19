'use client';
import { usePathname } from 'next/navigation';
import { useI18n, useProfile } from '../../../contexts';
import LanguageSwitcher from '../../languageSwitcher/LanguageSwitcher';
import ThemeToggler from '../../themeToggler/ThemeToggler';

import styles from './DashboardHeader.module.css';
import Image from 'next/image';

export default function DashboardHeader() {
  const { profile } = useProfile();
  const pathname = usePathname();
  const { texts } = useI18n();
  const headerTexts = texts.components?.dashboard?.header || {};

  // Extrae la sección actual desde la URL (/lang/section/...)
  const segments = pathname.split('/');
  const currentSection = segments[2] || 'dashboard';
  const title =
    headerTexts[currentSection as keyof typeof headerTexts] || headerTexts.dashboard || '';

  return (
    <section className={styles.section}>
      <h4 className={styles.h4}>{title}</h4>
      <ul className={styles.ul}>
        <li className={styles.li}>
          <ThemeToggler />
        </li>
        <li className={styles.li}>
          <LanguageSwitcher />
        </li>
        <li className={styles.li}>
          {profile.profileImage && (
            <Image
              className={styles.image}
              src={profile.profileImage}
              alt={`${profile.name}'s profile picture`}
              width={40}
              height={40}
            />
          )}
          <p>{profile.name}</p>
        </li>
      </ul>
    </section>
  );
}
