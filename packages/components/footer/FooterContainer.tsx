'use client';

import { useI18n } from '@havenova/contexts/i18n';
import { useCookies } from '@havenova/contexts/cookies';
import { FooterView } from './FooterView';
import { FooterSkeleton } from './Footer.skeleton';

export function FooterContainer() {
  const { texts } = useI18n();
  const { openManager } = useCookies();

  const footer = texts?.footer;

  if (!footer) return <FooterSkeleton />;

  return <FooterView footer={footer} onOpenCookies={openManager} />;
}
