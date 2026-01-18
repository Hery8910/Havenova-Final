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

const setInstallFlag = () => {
  window.localStorage?.setItem(INSTALL_FLAG_KEY, 'true');
  document.cookie = INSTALL_COOKIE;
};

const clearInstallFlag = () => {
  window.localStorage?.removeItem(INSTALL_FLAG_KEY);
  document.cookie = `${INSTALL_FLAG_KEY}=; path=/; max-age=0; samesite=lax`;
};

export function AppInstallSection({
  texts,
  lang,
}: {
  texts: {
    kicker: string;
    title: string;
    description: string;
    primaryCta: { label: string; installedLabel: string };
    secondaryCta: { label: string };
    features: string[];
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
      setIsInstalled(Boolean(isStandalone));
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
        const relatedApps = await (
          navigator as Navigator & { getInstalledRelatedApps?: () => Promise<unknown[]> }
        ).getInstalledRelatedApps?.();
        if (!relatedApps) {
          return;
        }
        if (relatedApps.length > 0) {
          setInstallFlag();
          setIsInstalled(true);
        } else {
          clearInstallFlag();
          setIsInstalled(false);
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
  console.log(installPrompt, isInstalled);

  const canInstall = Boolean(installPrompt) && !isInstalled;
  const isUnavailable = !isInstalled && !canInstall;
  const primaryLabel = isInstalled ? texts.primaryCta.installedLabel : texts.primaryCta.label;

  return (
    <section className={styles.appInstall} aria-labelledby="home-app-title">
      <div
        className={`${styles.appCard} card`}
        data-state={isInstalled ? 'installed' : isUnavailable ? 'unavailable' : 'available'}
      >
        <div className={styles.appContent}>
          <span className={styles.kicker}>{texts.kicker}</span>
          <h2 id="home-app-title">{texts.title}</h2>
          <p className={styles.sectionSubtitle}>{texts.description}</p>
        </div>
        <div className={styles.appCtas}>
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
            {texts.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
