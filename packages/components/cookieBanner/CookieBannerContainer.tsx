'use client';
import React, { useState } from 'react';
import { useCookies } from '@havenova/contexts/cookies';
import { useI18n } from '@havenova/contexts/i18n';
import { CookieBannerView } from './CookieBannerView';
import { CookieBannerSkeleton } from './CookieBanner.skeleton';

export function CookieBannerContainer() {
  const { prefs, showBanner, acceptAll, rejectAll, saveSelection, closeBanner, loading } =
    useCookies();
  const { texts } = useI18n();

  const [stats, setStats] = useState(prefs?.consent.statistics ?? false);
  const cookieTexts = texts?.components?.cookieBanner;

  if (!cookieTexts || !showBanner || loading) return null;

  return (
    <CookieBannerView
      texts={cookieTexts}
      stats={stats}
      onToggleStats={setStats}
      onSave={() => saveSelection({ statistics: stats })}
      onReject={rejectAll}
      onAccept={acceptAll}
      onClose={closeBanner}
    />
  );
}
