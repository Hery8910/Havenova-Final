'use client';

import { useI18n } from '../../../../contexts';
import { useLang } from '../../../../hooks';
import { HomePageView } from './HomePage.view';
import type { HomePageTexts } from './home.types';

export function HomePageClient() {
  const lang = useLang();
  const { texts } = useI18n();
  const home = texts?.pages?.client?.home as HomePageTexts | undefined;

  return <HomePageView home={home} lang={lang} />;
}
