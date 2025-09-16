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

  // Detecta idioma inicial desde localStorage
  useEffect(() => {
    const storedLang = (localStorage.getItem('havenova_lang') as Locale) || initialLanguage;
    if (storedLang && storedLang !== language) {
      setLanguage(storedLang);
    }
  }, [initialLanguage]);

  // Actualiza idioma y textos cuando cambia `language`
  useEffect(() => {
    localStorage.setItem('havenova_lang', language);
    document.cookie = `lang=${language}; path=/;`;

    if (resources[language]) {
      setTexts(resources[language]);
    } else {
      console.warn(`⚠️ I18nProvider: No texts found for language "${language}"`);
    }
  }, [language]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'havenova_lang' && event.newValue) {
        const value = event.newValue as string;
        if (value === 'de' || value === 'en') {
          setLanguage(value); // ✅ ahora TS sabe que es un Locale
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <I18nContext.Provider value={{ language, setLanguage, texts }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
