'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { resources, Locale, Messages } from '@havenova/i18n';

interface I18nContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  texts: Messages;
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
  const [texts, setTexts] = useState<Messages>(resources[initialLanguage]);

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
