'use client';
import React, { useEffect, useId, useRef, useState } from 'react';
import { useCookies } from '@havenova/contexts/cookies';
import { useI18n } from '@havenova/contexts/i18n';
import { CookieBannerView } from './CookieBannerView';

export function CookieBannerContainer() {
  const { prefs, showBanner, acceptAll, rejectAll, saveSelection, closeBanner, loading } =
    useCookies();
  const { texts } = useI18n();

  const [stats, setStats] = useState(prefs?.consent.statistics ?? false);
  const [isRendered, setIsRendered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const settingsId = useId();
  const cookieTexts = texts?.components?.client.cookieBanner;

  useEffect(() => {
    setStats(prefs?.consent.statistics ?? false);
  }, [prefs?.consent.statistics]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (loading) return;

    if (showBanner) {
      setIsRendered(true);
      const frame = window.requestAnimationFrame(() => setIsOpen(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setIsOpen(false);
    const timeoutId = window.setTimeout(() => setIsRendered(false), 240);
    return () => window.clearTimeout(timeoutId);
  }, [loading, showBanner]);

  useEffect(() => {
    if (!isRendered) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeBanner();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isRendered, closeBanner]);

  if (!cookieTexts || loading || !isRendered) return null;

  return (
    <CookieBannerView
      texts={cookieTexts}
      isOpen={isOpen}
      dialogRef={dialogRef}
      titleId={titleId}
      descriptionId={descriptionId}
      settingsId={settingsId}
      stats={stats}
      onToggleStats={setStats}
      onSave={() => saveSelection({ statistics: stats })}
      onReject={rejectAll}
      onAccept={acceptAll}
      onClose={closeBanner}
    />
  );
}
