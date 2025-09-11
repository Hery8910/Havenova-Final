'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const I18nContext = createContext(undefined);
export function I18nProvider({ children, initialLanguage, initialTexts, }) {
    const [language, setLanguage] = useState(initialLanguage);
    const [texts, setTexts] = useState(initialTexts);
    // Detecta idioma inicial desde localStorage
    useEffect(() => {
        const storedLang = localStorage.getItem('havenova_lang');
        if (storedLang && storedLang !== language) {
            setLanguage(storedLang);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        localStorage.setItem('havenova_lang', language);
        document.cookie = `lang=${language}; path=/;`;
        fetch(`/i18n/${language}.json`)
            .then((res) => res.json())
            .then((data) => {
            setTexts(data);
        })
            .catch((err) => {
            console.error('❌ I18nProvider: Error cargando textos', err);
            // En caso de error, mantenemos texts anteriores en vez de volver a initialTexts
        });
    }, [language]); // 👈 solo depende de language
    // Escuchar cambios de idioma desde otras pestañas o componentes
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'havenova_lang' && event.newValue) {
                setLanguage(event.newValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);
    return (_jsx(I18nContext.Provider, { value: { language, setLanguage, texts }, children: children }));
}
export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx)
        throw new Error('useI18n must be used within I18nProvider');
    return ctx;
}
