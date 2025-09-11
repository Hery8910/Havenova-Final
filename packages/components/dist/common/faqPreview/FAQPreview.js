'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './FAQPreview.module.css';
import { useI18n } from '../../../contexts/I18nContext';
import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import Link from 'next/link';
const FAQPreview = () => {
    const [open, setOpen] = useState(null);
    const handleClick = (index) => {
        setOpen((prev) => (prev === index ? null : index));
    };
    const { texts } = useI18n();
    const faq = texts?.pages?.home?.faq;
    if (!faq) {
        return (_jsx("section", { className: styles.section, children: _jsx("div", { className: styles.skeleton, style: { width: '100%', height: 504, background: '#eee' } }) }));
    }
    return (_jsxs("section", { className: styles.section, children: [_jsx("header", { children: _jsx("h2", { children: faq.title }) }), _jsx("ul", { className: styles.ul, children: faq.items.map((question, index) => (_jsxs("li", { className: styles.li, onClick: () => handleClick(index), children: [_jsxs("h4", { className: styles.h4, children: [question.question, _jsx(LuPlus, { className: `${styles.icon} ${open === index ? styles.open : ''}` })] }), open === index && _jsx("p", { className: styles.p, children: question.answer })] }, index))) }), _jsxs("aside", { className: styles.aside, children: [_jsx("h2", { children: faq.cta.title }), _jsx("h4", { className: styles.description, children: faq.cta.description }), _jsx(Link, { href: faq.cta.href, className: "button", children: faq.cta.label })] })] }));
};
export default FAQPreview;
