'use client';
import { useEffect, useState } from 'react';
import type { Locale } from '@havenova/i18n';
import { I18nProvider } from './I18nContext';

export default function I18nInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<Locale>('de');

  useEffect(() => {
    const storedLang = localStorage.getItem('havenova_lang');
    const nextLang: Locale =
      storedLang === 'de' || storedLang === 'en' || storedLang === 'es' ? storedLang : 'de';
    setLang(nextLang);
    setReady(true);
  }, []);

  if (!ready) return null;

  return <I18nProvider initialLanguage={lang}>{children}</I18nProvider>;
}
