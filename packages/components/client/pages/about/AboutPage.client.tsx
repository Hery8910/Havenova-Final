'use client';

import { useI18n } from '../../../../contexts';
import { useLang } from '../../../../hooks';
import { AboutPageView } from './AboutPage.view';
import type { AboutPageTexts } from './about.types';

export function AboutPageClient() {
  const lang = useLang();
  const { texts } = useI18n();
  const about = texts?.pages?.client?.about as AboutPageTexts | undefined;

  return <AboutPageView about={about} lang={lang} />;
}
