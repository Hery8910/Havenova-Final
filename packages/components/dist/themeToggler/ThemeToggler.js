'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useClient } from '../../contexts/ClientContext';
import { applyBrandingToDOM } from '../../utils/applyBrandingToDOM';
import styles from './ThemeToggler.module.css';
import { useUser } from '../../contexts/UserContext';
import Image from 'next/image';
const ThemeToggler = () => {
    const { user, updateUserTheme } = useUser();
    const { client } = useClient();
    // Usar el theme global del usuario, no local
    const theme = user?.theme || 'light';
    useEffect(() => {
        // Cada vez que cambia el theme, actualiza el DOM y branding
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (client?.branding?.[theme]) {
            applyBrandingToDOM(client.branding[theme], client.typography);
        }
    }, [theme, client?.branding, client?.typography]);
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        updateUserTheme(newTheme);
        // NO SETEES el useState local ni el DOM aquí, eso se hará en el useEffect de arriba al actualizar el contexto
    };
    return (_jsx("button", { className: `${styles.toggleButton} ${theme === 'dark' ? styles.dark : ''}`, onClick: toggleTheme, "aria-label": "Toggle theme", children: _jsxs("div", { className: styles.iconsWrapper, children: [_jsx("span", { className: styles.moon, children: _jsx(Image, { className: styles.logo, src: "/svg/moon.svg", alt: "Moon icon", width: 30, height: 30 }) }), _jsx("span", { className: styles.sun, children: _jsx(Image, { className: styles.logo, src: "/svg/sun.svg", alt: "Sun icon", width: 30, height: 30 }) })] }) }));
};
export default ThemeToggler;
