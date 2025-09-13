'use client';
import { useEffect, useState } from 'react';
import { I18nProvider } from './I18nContext';

export default function I18nInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<'de' | 'en'>('de');

  useEffect(() => {
    const storedLang = (localStorage.getItem('havenova_lang') as 'de' | 'en') || 'de';
    setLang(storedLang);
    setReady(true);
  }, []);

  if (!ready) return null;

  return <I18nProvider initialLanguage={lang}>{children}</I18nProvider>;
}
