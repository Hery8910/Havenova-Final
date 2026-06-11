'use client';

import { useI18n } from '../../../../contexts';
import { useLang } from '../../../../hooks';
import { HowItWorksPageView } from './HowItWorksPage.view';
import type { HowItWorksPageTexts } from './howItWorks.types';

export function HowItWorksPageClient() {
  const lang = useLang();
  const { texts } = useI18n();
  const howItWorks = texts?.pages?.client?.howItWorks as HowItWorksPageTexts | undefined;

  return <HowItWorksPageView howItWorks={howItWorks} lang={lang} />;
}
