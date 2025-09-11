'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useCookies } from '../../contexts/CookiesContext';
import { useI18n } from '../../contexts/I18nContext';
import styles from './CookieBanner.module.css';
import { IoIosClose } from 'react-icons/io';
const CookieBanner = () => {
    const { prefs, showBanner, acceptAll, rejectAll, saveSelection, closeBanner } = useCookies();
    const { texts } = useI18n();
    const [stats, setStats] = useState(prefs.consent.statistics);
    const cookie = texts.components.cookieBanner;
    if (!prefs)
        return null;
    if (!showBanner)
        return null;
    return (_jsx("main", { className: `${styles.wrapper} card`, children: _jsxs("section", { className: `${styles.banner} card`, role: "dialog", "aria-live": "polite", "aria-label": "Cookie consent", children: [_jsxs("article", { className: styles.article, children: [_jsx("h3", { className: styles.title, children: cookie.title }), _jsx("p", { className: styles.description, children: cookie.description }), _jsxs("aside", { className: styles.controls, children: [_jsxs("div", { className: styles.switch_div, children: [_jsx("label", { className: styles.label, children: cookie.enableStats }), _jsxs("label", { className: styles.switch, children: [_jsx("input", { type: "checkbox", checked: stats, onChange: (e) => setStats(e.target.checked), "aria-label": cookie.enableStats }), _jsx("span", { className: styles.slider })] })] }), _jsxs("div", { className: styles.div, children: [_jsx("button", { className: "button_invert", onClick: () => saveSelection({ statistics: stats }), children: cookie.save }), _jsx("button", { className: "button_invert", onClick: rejectAll, children: cookie.rejectAll }), _jsx("button", { className: "button", onClick: acceptAll, children: cookie.acceptAll })] })] })] }), _jsx("button", { className: "button_close", onClick: closeBanner, "aria-label": cookie.close, children: _jsx(IoIosClose, {}) })] }) }));
};
export default CookieBanner;
