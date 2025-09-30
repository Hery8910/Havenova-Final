'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { resources, Locale } from '@havenova/i18n';

interface I18nContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  texts: Record<string, any>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  initialLanguage = 'de',
}: {
  children: React.ReactNode;
  initialLanguage?: Locale;
}) {
  const [language, setLanguage] = useState<Locale>(initialLanguage);
  const [texts, setTexts] = useState(resources[initialLanguage] || {});

  useEffect(() => {
    if (resources[language]) {
      setTexts(resources[language]);
    }
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, texts }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
