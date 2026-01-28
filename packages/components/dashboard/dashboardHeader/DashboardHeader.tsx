'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useI18n, useWorker } from '../../../contexts';
import LanguageSwitcher from '../../languageSwitcher/LanguageSwitcher';
import ThemeToggler from '../../themeToggler/ThemeToggler';

import styles from './DashboardHeader.module.css';
import Image from 'next/image';
import { useLang } from '../../../hooks';

export default function DashboardHeader() {
  const { worker } = useWorker();
  const { auth } = useAuth();
  const pathname = usePathname();
  const lang = useLang();
  const router = useRouter();
  const { texts } = useI18n();
  const headerTexts = texts.components?.dashboard?.header || {};
  const dashboardTexts = texts.components?.dashboard || {};
  const sectionTitleId = 'dashboard-header-title';

  // Extrae la sección actual desde la URL (/lang/section/...)
  const segments = pathname.split('/');
  const currentSection = segments[2] || 'dashboard';
  const title =
    headerTexts[currentSection as keyof typeof headerTexts] || headerTexts.dashboard || '';
  const profileLabel = dashboardTexts.profileButton || headerTexts.profile || 'Profile';
  const profileName = worker?.name?.trim();
  const profileButtonLabel = profileName ? `${profileLabel}: ${profileName}` : profileLabel;

  return (
    <section className={`${styles.section} card--glass`} aria-labelledby={sectionTitleId}>
      <h4 id={sectionTitleId} className={styles.h4}>
        {title}
      </h4>
      <button
        type="button"
        onClick={() => router.push(`/${lang}/profile`)}
        className={styles.button}
        aria-label={profileButtonLabel}
      >
        {worker.profileImage && (
          <Image
            className={styles.image}
            src={worker.profileImage}
            alt={
              profileName ? `${profileName}'s profile picture` : `${profileLabel} picture`
            }
            width={45}
            height={45}
          />
        )}
        <div className={styles.profileDiv}>
          <p className={styles.name}>{worker.name}</p>
          <p className={styles.role}>{auth.role}</p>
        </div>
      </button>
    </section>
  );
}
