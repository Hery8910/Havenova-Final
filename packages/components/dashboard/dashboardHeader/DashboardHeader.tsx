'use client';
import { usePathname } from 'next/navigation';
import { useAuth, useI18n, useWorker } from '../../../contexts';
import LanguageSwitcher from '../../languageSwitcher/LanguageSwitcher';
import ThemeToggler from '../../themeToggler/ThemeToggler';

import styles from './DashboardHeader.module.css';
import Image from 'next/image';

export default function DashboardHeader() {
  const { worker } = useWorker();
  const { auth } = useAuth();
  const pathname = usePathname();
  const { texts } = useI18n();
  const headerTexts = texts.components?.dashboard?.header || {};

  // Extrae la sección actual desde la URL (/lang/section/...)
  const segments = pathname.split('/');
  const currentSection = segments[2] || 'dashboard';
  const title =
    headerTexts[currentSection as keyof typeof headerTexts] || headerTexts.dashboard || '';

  return (
    <section className={`${styles.section} card--glass`}>
      <h4 className={styles.h4}>{title}</h4>
      <ul className={styles.ul}>
        <li className={styles.li}>
          <ThemeToggler />
        </li>
        <li className={styles.li}>
          <LanguageSwitcher />
        </li>
        <li className={styles.profilLi}>
          {worker.profileImage && (
            <Image
              className={styles.image}
              src={worker.profileImage}
              alt={`${worker.name}'s profile picture`}
              width={30}
              height={30}
            />
          )}
          <div className={styles.profileDiv}>
            <p className={styles.name}>{worker.name}</p>
            <p className={styles.role}>{auth.role}</p>
          </div>
        </li>
      </ul>
    </section>
  );
}
