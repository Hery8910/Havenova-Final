'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import styles from './Loading.module.css';
import Image from 'next/image';
import { useI18n } from '../../../contexts/I18nContext';
import { useUser } from '../../../contexts/UserContext';
export default function Loading() {
    const { user } = useUser();
    const { texts } = useI18n();
    const [theme, setTheme] = useState('light');
    const backgroundImage = theme === 'dark'
        ? '/images/logos/logo-vertical-dark.webp'
        : '/images/logos/logo-vertical-light.webp';
    useEffect(() => {
        if (user?.theme) {
            setTheme(user.theme);
        }
        else {
            // fallback a localStorage o un valor default
            const storedTheme = localStorage.getItem('theme') || 'light';
            setTheme(storedTheme);
        }
    }, [user]);
    return (_jsxs("main", { className: styles.loadingContainer, children: [_jsx(Image, { src: backgroundImage, alt: "Havenova Logo", width: 500, height: 500, className: styles.logo }), _jsxs("ul", { className: styles.ul, children: [_jsx("li", { className: styles.dot }), _jsx("li", { className: styles.dot }), _jsx("li", { className: styles.dot }), _jsx("li", { className: styles.dot })] })] }));
}
