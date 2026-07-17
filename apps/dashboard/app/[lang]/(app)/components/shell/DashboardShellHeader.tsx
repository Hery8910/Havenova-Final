'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import LanguageSwitcher from '../../../../../../../packages/components/languageSwitcher/LanguageSwitcher';
import { normalizeNavbarAvatar } from '../../../../../../../packages/components/client/navbar/navbar.helpers';
import { resolveDashboardHeaderMeta, type DashboardShellLang } from '../../dashboardShell';
import styles from './DashboardShellHeader.module.css';
import { useAdmin, useAuth } from '../../../../../../../packages/contexts';
import { useLang } from '../../../../../../../packages/hooks';
import { DashboardThemeControl } from './DashboardThemeControl';

export function DashboardShellHeader() {
  const { admin, setTheme } = useAdmin();
  const { auth } = useAuth();
  const pathname = usePathname();
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const lang = useLang() as DashboardShellLang;
  const meta = resolveDashboardHeaderMeta(pathname, lang);
  const profileName = admin?.name?.trim();
  const displayName = profileName || (lang === 'es' ? 'Admin' : 'Admin');
  const languageLabels =
    lang === 'es'
      ? {
          title: 'Idioma',
          openButtonLabel: 'Abrir selector de idioma',
          currentLanguageLabel: 'Idioma actual',
          closeButtonLabel: 'Cerrar selector de idioma',
          options: {
            de: {
              label: 'Deutsch',
              shortLabel: 'DE',
              switchLabel: 'Cambiar idioma a alemán',
            },
            en: {
              label: 'English',
              shortLabel: 'EN',
              switchLabel: 'Cambiar idioma a inglés',
            },
            es: {
              label: 'Español',
              shortLabel: 'ES',
              switchLabel: 'Cambiar idioma a español',
            },
          },
        }
      : lang === 'de'
        ? {
            title: 'Sprache',
            openButtonLabel: 'Sprachauswahl öffnen',
            currentLanguageLabel: 'Aktuelle Sprache',
            closeButtonLabel: 'Sprachauswahl schliessen',
            options: {
              de: {
                label: 'Deutsch',
                shortLabel: 'DE',
                switchLabel: 'Sprache auf Deutsch wechseln',
              },
              en: {
                label: 'English',
                shortLabel: 'EN',
                switchLabel: 'Sprache auf Englisch wechseln',
              },
              es: {
                label: 'Español',
                shortLabel: 'ES',
                switchLabel: 'Sprache auf Spanisch wechseln',
              },
            },
          }
        : {
            title: 'Language',
            openButtonLabel: 'Open language selector',
            currentLanguageLabel: 'Current language',
            closeButtonLabel: 'Close language selector',
            options: {
              de: {
                label: 'Deutsch',
                shortLabel: 'DE',
                switchLabel: 'Switch language to German',
              },
              en: {
                label: 'English',
                shortLabel: 'EN',
                switchLabel: 'Switch language to English',
              },
              es: {
                label: 'Español',
                shortLabel: 'ES',
                switchLabel: 'Switch language to Spanish',
              },
            },
          };
  const themeLabels =
    lang === 'es'
      ? {
          theme: 'Tema',
          darkMode: 'Modo oscuro',
          lightMode: 'Modo claro',
          switchToDark: 'Cambiar a modo oscuro',
          switchToLight: 'Cambiar a modo claro',
        }
      : lang === 'de'
        ? {
            theme: 'Thema',
            darkMode: 'Dunkelmodus',
            lightMode: 'Hellmodus',
            switchToDark: 'Zu Dunkelmodus wechseln',
            switchToLight: 'Zu Hellmodus wechseln',
          }
        : {
            theme: 'Theme',
            darkMode: 'Dark mode',
            lightMode: 'Light mode',
            switchToDark: 'Switch to Dark mode',
            switchToLight: 'Switch to Light mode',
          };
  const theme = admin?.theme === 'dark' ? 'dark' : 'light';
  const normalizedAvatarSrc = useMemo(
    () => normalizeNavbarAvatar(admin?.profileImage),
    [admin?.profileImage]
  );
  const shouldUseAvatarImage = Boolean(normalizedAvatarSrc && !hasAvatarError);

  useEffect(() => {
    setHasAvatarError(false);
  }, [normalizedAvatarSrc]);

  return (
    <section className={styles.section} aria-labelledby="dashboard-shell-header-title">
      <div className={styles.titleBlock}>
        <p className={styles.routeLabel}>{meta.routeLabel}</p>
        <h1 id="dashboard-shell-header-title" className={styles.title}>
          {meta.title}
        </h1>
      </div>

      <div className={styles.actions}>
        <LanguageSwitcher
          triggerDisplay="icon"
          dropdownPlacement="bottom"
          labels={languageLabels}
        />

        <DashboardThemeControl
          theme={theme}
          labels={themeLabels}
          onThemeChange={(nextTheme) => {
            void setTheme(nextTheme);
          }}
        />

        <div className={styles.profileSummary} aria-label={meta.profileButton}>
          {shouldUseAvatarImage ? (
            <Image
              className={styles.image}
              src={normalizedAvatarSrc}
              alt={profileName ? `${profileName} profile picture` : meta.profileButton}
              width={40}
              height={40}
              onError={() => setHasAvatarError(true)}
            />
          ) : (
            <span className={styles.avatarFallback} aria-hidden="true">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
          )}

          <div className={styles.profileBlock}>
            <p className={styles.name}>{displayName}</p>
            <p className={styles.role}>{auth.role ?? 'admin'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
