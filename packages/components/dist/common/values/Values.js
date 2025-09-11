'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './Values.module.css';
import { useI18n } from '../../../contexts/I18nContext';
import { useUser } from '../../../contexts/UserContext';
import { useEffect, useState } from 'react';
const Values = () => {
    const { texts } = useI18n();
    const values = texts?.components?.values;
    const { user } = useUser();
    const [theme, setTheme] = useState('light');
    const backgroundImage = theme === 'dark'
        ? "url('/images/values-background-dark.png')"
        : "url('/images/values-background-light.png')";
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
    if (!values) {
        return (_jsx("section", { className: styles.section, children: _jsx("div", { className: styles.skeleton, style: { width: '100%', height: 504, background: '#eee' } }) }));
    }
    return (_jsxs("section", { className: styles.section, style: {
            backgroundImage,
        }, children: [_jsx("header", { className: styles.header, children: _jsx("h2", { children: values.title }) }), _jsx("ul", { className: styles.ul, children: values.list.map((item, idx) => {
                    return (_jsxs("li", { className: styles.li, children: [_jsxs("h2", { className: styles.num, children: ["0", idx + 1, "."] }), _jsx("h2", { className: styles.li_h2, children: item.label }), _jsx("p", { className: styles.li_p, children: item.description })] }, idx));
                }) })] }));
};
export default Values;
