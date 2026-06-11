'use client';

import { useCallback, useLayoutEffect, useState } from 'react';
import styles from './AppInstallSection.module.css';
import { href } from '../../../../../utils/navigation';
import { useAuth } from '../../../../../contexts';
import { AppInstalledCard } from './AppInstalledCard';
import { AppNotInstalledCard } from './AppNotInstalledCard';
import type {
  AppInstallSectionTexts,
  AppInstallState,
  AppNotInstalledState,
} from './AppInstallSection.types';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const INSTALL_FLAG_KEY = 'pwa-installed';
const INSTALL_COOKIE = `${INSTALL_FLAG_KEY}=true; path=/; max-age=31536000; samesite=lax`;

const getInstallFlag = () => {
  const hasLocalStorage =
    typeof window !== 'undefined' && window.localStorage?.getItem(INSTALL_FLAG_KEY) === 'true';
  const hasCookie =
    typeof document !== 'undefined' &&
    document.cookie
      ?.split(';')
      .map((cookie) => cookie.trim())
      .some((cookie) => cookie.startsWith(`${INSTALL_FLAG_KEY}=`) && cookie.endsWith('true'));
  return hasLocalStorage || hasCookie;
};

const setInstallFlag = () => {
  window.localStorage?.setItem(INSTALL_FLAG_KEY, 'true');
  document.cookie = INSTALL_COOKIE;
};

const clearInstallFlag = () => {
  window.localStorage?.removeItem(INSTALL_FLAG_KEY);
  document.cookie = `${INSTALL_FLAG_KEY}=; path=/; max-age=0; samesite=lax`;
};

const isStandaloneMode = () => {
  if (typeof window === 'undefined') return false;

  return Boolean(
    window.matchMedia?.('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone ||
      document.referrer.startsWith('android-app://')
  );
};

const isIosSafari = () => {
  if (typeof window === 'undefined') return false;

  const { userAgent, vendor, platform, maxTouchPoints } = window.navigator;
  const normalizedUserAgent = userAgent.toLowerCase();
  const isAppleMobile =
    /iphone|ipad|ipod/.test(normalizedUserAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1);
  const isWebkitBrowser = /safari/.test(normalizedUserAgent) && /apple/i.test(vendor);
  const isNonSafariBrowser = /crios|fxios|edgios|opios|opr\//.test(normalizedUserAgent);

  return isAppleMobile && isWebkitBrowser && !isNonSafariBrowser;
};

const getPlatformInstallState = (hasPrompt: boolean): Exclude<AppInstallState, 'installed'> => {
  if (isIosSafari()) {
    return 'ios-manual';
  }

  return hasPrompt ? 'installable' : 'unavailable';
};

const getInstalledRelatedApps = async () => {
  try {
    const relatedApps = await (
      navigator as Navigator & { getInstalledRelatedApps?: () => Promise<unknown[]> }
    ).getInstalledRelatedApps?.();
    return Array.isArray(relatedApps) && relatedApps.length > 0;
  } catch {
    return false;
  }
};

const resolveInstallState = async (
  hasPrompt: boolean
): Promise<AppInstallState> => {
  const hasStoredInstallFlag = getInstallFlag();
  const standalone = isStandaloneMode();
  if (standalone) {
    setInstallFlag();
    return 'installed';
  }

  const hasRelatedApps = await getInstalledRelatedApps();
  if (hasRelatedApps) {
    setInstallFlag();
    return 'installed';
  }

  // Keep the persisted flag as a weak positive signal unless the browser
  // explicitly exposes the install prompt again, which is a strong hint that
  // the app is no longer installed for this environment.
  if (hasStoredInstallFlag && !hasPrompt) {
    return 'installed';
  }

  if (hasStoredInstallFlag && hasPrompt) {
    clearInstallFlag();
  }

  return getPlatformInstallState(hasPrompt);
};

export default function AppInstallSection({
  texts,
  lang,
}: {
  texts?: AppInstallSectionTexts;
  lang: 'de' | 'en' | 'es';
}) {
  const { auth } = useAuth();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installState, setInstallState] = useState<AppInstallState>('unavailable');
  const [isResolved, setIsResolved] = useState(false);

  useLayoutEffect(() => {
    let active = true;

    const syncInstallState = async (promptAvailable: boolean) => {
      const nextState = await resolveInstallState(promptAvailable);
      if (!active) return;
      setInstallState(nextState);
      setIsResolved(true);
    };

    void syncInstallState(Boolean(installPrompt));

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const nextPrompt = event as BeforeInstallPromptEvent;
      setInstallPrompt(nextPrompt);
      setInstallState((current) => (current === 'installed' ? current : 'installable'));
      setIsResolved(true);
    };

    const handleAppInstalled = () => {
      setInstallFlag();
      setInstallState('installed');
      setInstallPrompt(null);
    };

    const handleLifecycleValidation = () => {
      void syncInstallState(Boolean(installPrompt));
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== INSTALL_FLAG_KEY) {
        return;
      }
      void syncInstallState(Boolean(installPrompt));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('visibilitychange', handleLifecycleValidation);
    window.addEventListener('pageshow', handleLifecycleValidation);
    window.addEventListener('focus', handleLifecycleValidation);
    window.addEventListener('storage', handleStorage);

    return () => {
      active = false;
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('visibilitychange', handleLifecycleValidation);
      window.removeEventListener('pageshow', handleLifecycleValidation);
      window.removeEventListener('focus', handleLifecycleValidation);
      window.removeEventListener('storage', handleStorage);
    };
  }, [installPrompt]);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) {
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (choice.outcome === 'accepted') {
      setInstallFlag();
      setInstallState('installed');
    }
  }, [installPrompt]);

  const installableTitle =
    texts?.appInstall?.installable?.title ?? 'Installiere Havenova auf deinem Gerät.';
  const installableDescription =
    texts?.appInstall?.installable?.description ??
    'Öffne Havenova schneller und halte den Zugriff auf deine Anfragen jederzeit direkt bereit.';
  const installableInfo =
    texts?.appInstall?.installable?.info ??
    'Du kannst die App direkt in diesem Browser installieren und mit nur einem Tipp öffnen.';
  const installableCtaLabel =
    texts?.appInstall?.installable?.cta?.label ?? 'App installieren';

  const iosManualTitle =
    texts?.appInstall?.iosManual?.title ?? 'Installiere Havenova auf deinem Gerät.';
  const iosManualDescription =
    texts?.appInstall?.iosManual?.description ??
    'Öffne Havenova schneller und halte den Zugriff auf deine Anfragen jederzeit direkt bereit.';
  const iosManualInfo =
    texts?.appInstall?.iosManual?.info ??
    'Tippe in Safari auf „Teilen“ und dann auf „Zum Home-Bildschirm“, um die App zu installieren.';

  const unavailableTitle =
    texts?.appInstall?.unavailable?.title ?? 'Erfahre, wie Havenova funktioniert.';
  const unavailableDescription =
    texts?.appInstall?.unavailable?.description ??
    'Sieh dir den Ablauf von Anfrage und Service an, um die Plattform Schritt für Schritt besser zu verstehen.';
  const unavailableCtaLabel =
    texts?.appInstall?.unavailable?.cta?.label ?? 'So funktioniert’s';
  const unavailableCtaHref =
    texts?.appInstall?.unavailable?.cta?.href ?? '/how-it-work';

  const loggedInTitle =
    texts?.appInstalled?.loggedIn?.title ?? 'Dein Profilbereich ist bereit.';
  const loggedInDescription =
    texts?.appInstalled?.loggedIn?.description ??
    'Öffne dein Profil, um deine Daten zu prüfen, Informationen zu aktualisieren und dein Konto zentral zu verwalten.';
  const loggedInCtas =
    texts?.appInstalled?.loggedIn?.ctas?.length
      ? texts.appInstalled.loggedIn.ctas
      : [
          {
            label: 'Zu meinem Profil',
            href: '/profile',
          },
        ];

  const guestTitle =
    texts?.appInstalled?.guest?.title ?? 'Dein Zugang zum Profil ist bereit.';
  const guestDescription =
    texts?.appInstalled?.guest?.description ??
    'Melde dich an oder erstelle ein Konto, um deine Daten zu speichern, dein Profil zu verwalten und schneller weiterzumachen.';
  const guestCtas =
    texts?.appInstalled?.guest?.ctas?.length
      ? texts.appInstalled.guest.ctas
      : [
          {
            label: 'Konto erstellen',
            href: '/user/register',
          },
          {
            label: 'Anmelden',
            href: '/user/login',
          },
        ];

  const installedContent =
    auth.isLogged
      ? {
          title: loggedInTitle,
          description: loggedInDescription,
          ctas: loggedInCtas.map((cta) => ({
            ...cta,
            href: href(lang, cta.href),
          })),
        }
      : {
          title: guestTitle,
          description: guestDescription,
          ctas: guestCtas.map((cta) => ({
            ...cta,
            href: href(lang, cta.href),
          })),
        };

  const notInstalledState: AppNotInstalledState =
    installState === 'installed' ? 'unavailable' : installState;
  const notInstalledContent =
    notInstalledState === 'installable'
      ? {
          title: installableTitle,
          description: installableDescription,
          info: installableInfo,
          cta: {
            label: installableCtaLabel,
          },
        }
      : notInstalledState === 'ios-manual'
        ? {
            title: iosManualTitle,
            description: iosManualDescription,
            info: iosManualInfo,
          }
        : {
            title: unavailableTitle,
            description: unavailableDescription,
            cta: {
              label: unavailableCtaLabel,
              href: href(lang, unavailableCtaHref),
            },
          };

  if (!isResolved) {
    return (
      <section className={styles.appInstall} aria-hidden="true">
        <div className={`${styles.appCard} ${styles.appSkeleton}`}>
          <div className={styles.titleBlock}>
            <span className={styles.skeletonTitle} />
            <span className={styles.skeletonTitleShort} />
          </div>
          <div className={styles.copyBlock}>
            <span className={styles.skeletonLine} />
            <span className={styles.skeletonLineShort} />
            <div className={styles.skeletonActions}>
              <span className={styles.skeletonButton} />
              <span className={styles.skeletonButtonAlt} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.appInstall} aria-labelledby="home-app-title">
      {installState === 'installed' ? (
        <AppInstalledCard content={installedContent} />
      ) : (
        <AppNotInstalledCard
          state={notInstalledState}
          content={notInstalledContent}
          onInstall={() => {
            void handleInstall();
          }}
        />
      )}
    </section>
  );
}
