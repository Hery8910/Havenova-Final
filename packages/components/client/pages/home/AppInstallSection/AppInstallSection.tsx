'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './AppInstallSection.module.css';
import { href } from '../../../../../utils/navigation';

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
    document.cookie?.split('; ').some((cookie) => cookie === `${INSTALL_FLAG_KEY}=true`);
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

export default function AppInstallSection({
  texts,
  lang,
}: {
  texts: {
    appInstall: {
      kicker: string;
      title: string;
      description: string;
      primaryCta: { label: string; installedLabel: string };
      secondaryCta: { label: string };
      features: string[];
    };
    appInstalled: {
      kicker: string;
      title: string;
      description: string;
      primaryCta: { label: string };
    };
  };
  lang: 'de' | 'en';
}) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(display-mode: standalone)');

    const checkInstalled = () => {
      const isStandalone =
        mediaQuery?.matches || (window.navigator as { standalone?: boolean }).standalone;
      if (isStandalone) {
        setInstallFlag();
      }
      setIsInstalled(Boolean(isStandalone) || getInstallFlag());
    };

    checkInstalled();

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallFlag();
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    mediaQuery?.addEventListener?.('change', checkInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery?.removeEventListener?.('change', checkInstalled);
    };
  }, []);

  useEffect(() => {
    const checkRelatedApps = async () => {
      try {
        if (getInstallFlag()) {
          setIsInstalled(true);
          return;
        }
        const relatedApps = await (
          navigator as Navigator & { getInstalledRelatedApps?: () => Promise<unknown[]> }
        ).getInstalledRelatedApps?.();
        if (!relatedApps) {
          return;
        }
        if (relatedApps.length > 0) {
          setInstallFlag();
          setIsInstalled(true);
        }
      } catch {
        // Ignore unsupported or blocked APIs.
      }
    };
    checkRelatedApps();
  }, []);

  const secondaryHref = href(lang, '/how-it-work');
  const handleInstall = useCallback(async () => {
    if (!installPrompt) {
      window.location.assign(secondaryHref);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (choice.outcome === 'accepted') {
      setInstallFlag();
      setIsInstalled(true);
    }
  }, [installPrompt, secondaryHref]);

  const canInstall = Boolean(installPrompt) && !isInstalled;
  const isUnavailable = !isInstalled && !canInstall;
  const primaryLabel = isInstalled
    ? texts.appInstall.primaryCta.installedLabel
    : texts.appInstall.primaryCta.label;
  const activeTexts = isInstalled ? texts.appInstalled : texts.appInstall;

  return (
    <section className={styles.appInstall} aria-labelledby="home-app-title">
      <div
        className={`${styles.appCard} card`}
        data-state={isInstalled ? 'installed' : isUnavailable ? 'unavailable' : 'available'}
      >
        <div className={styles.appContent}>
          <span className={styles.kicker}>{activeTexts.kicker}</span>
          <h2 id="home-app-title">{activeTexts.title}</h2>
          <p className={styles.sectionSubtitle}>{activeTexts.description}</p>
        </div>
        <div className={styles.appCtas}>
          {isInstalled ? (
            <Link className={`${styles.ctaPrimaryInstall} button`} href={secondaryHref}>
              {texts.appInstalled.primaryCta.label}
            </Link>
          ) : (
            <>
              <button
                type="button"
                className={`${
                  canInstall ? styles.ctaPrimaryInstall : styles.ctaPrimaryUnavailable
                } button`}
                onClick={canInstall ? handleInstall : undefined}
                disabled={isInstalled}
                aria-disabled={isInstalled}
              >
                {primaryLabel}
              </button>
              <Link className={`${styles.ctaGhost} button_invert`} href={secondaryHref}>
                {texts.appInstall.secondaryCta.label}
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
