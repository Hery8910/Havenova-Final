// components/I18nInitializer.tsx
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { I18nProvider } from '../../contexts/I18nContext';
import deTexts from '../../../apps/public/public/i18n/de.json';
import enTexts from '../../../apps/public/public/i18n/en.json';
export default function I18nInitializer({ children }) {
    const [lang, setLang] = useState('de');
    const [texts, setTexts] = useState(deTexts);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const storedLang = localStorage.getItem('havenova_lang') || 'de';
        setLang(storedLang);
        setTexts(storedLang === 'de' ? deTexts : enTexts);
        setReady(true);
    }, []);
    if (!ready)
        return null; // Evita parpadeo con idioma incorrecto
    return (_jsx(I18nProvider, { initialLanguage: lang, initialTexts: texts, children: children }));
}
