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
          iosCta: { label: string; hint: string };
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
  const [isIosManualInstall, setIsIosManualInstall] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = isStandaloneMode();
      const hasInstallFlag = getInstallFlag();

      if (isStandalone && !hasInstallFlag) {
        setInstallFlag();
      }

      const installed = isStandalone || hasInstallFlag;
      setIsInstalled(installed);
      setIsIosManualInstall(isIosSafari() && !installed);
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
    window.addEventListener('visibilitychange', checkInstalled);
    window.addEventListener('pageshow', checkInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('visibilitychange', checkInstalled);
      window.removeEventListener('pageshow', checkInstalled);
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
    if (isIosManualInstall) {
      return;
    }

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
  }, [installPrompt, isIosManualInstall, secondaryHref]);

  const canInstall = Boolean(installPrompt) && !isInstalled;
  const canInstallOnIos = isIosManualInstall && !isInstalled;
  const primaryLabel = isInstalled
    ? texts.appInstall.primaryCta.installedLabel
    : canInstallOnIos
      ? texts.appInstall.iosCta.label
    : texts.appInstall.primaryCta.label;
  const activeTexts = isInstalled ? texts.appInstalled : texts.appInstall;

  return (
    <section className={styles.appInstall} aria-labelledby="home-app-title">
      <div
        className={`${styles.appCard} glass-panel--base`}
        data-state={isInstalled ? 'installed' : canInstall || canInstallOnIos ? 'available' : 'unavailable'}
      >
        <div className={styles.appContent}>
          <span className={`${styles.kicker} type-label`}>{activeTexts.kicker}</span>
          <h2 id="home-app-title" className="type-title-xl">{activeTexts.title}</h2>
          <p className={`${styles.sectionSubtitle} type-body-lg`}>{activeTexts.description}</p>
        </div>
        <div className={styles.appCtas}>
          {isInstalled ? (
            <Link className={`${styles.ctaSecondary} button`} href={secondaryHref}>
              {texts.appInstalled.primaryCta.label}
            </Link>
          ) : (
            <>
              {(canInstall || canInstallOnIos) && (
                <button
                  type="button"
                  className={`${styles.ctaPrimaryInstall} button`}
                  onClick={handleInstall}
                >
                  {primaryLabel}
                </button>
              )}
              <Link className={`${styles.ctaSecondary} button`} href={secondaryHref}>
                {texts.appInstall.secondaryCta.label}
              </Link>
            </>
          )}
        </div>
        {canInstallOnIos && (
          <p className={`${styles.installHint} type-body-sm`}>{texts.appInstall.iosCta.hint}</p>
        )}
      </div>
    </section>
  );
}
