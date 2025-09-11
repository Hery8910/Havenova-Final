'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './Footer.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '../../contexts/I18nContext';
import { useCookies } from '../../contexts/CookiesContext';
const Footer = () => {
    const { texts } = useI18n();
    const { openManager } = useCookies();
    const footer = texts.footer;
    return (_jsxs("footer", { className: styles.footer, children: [_jsxs("header", { className: styles.header, children: [_jsx(Link, { className: styles.logo, href: "/", children: _jsx(Image, { className: styles.logo, src: "/svg/logo-white.svg", alt: "Havenova Logo", width: 350, height: 150 }) }), _jsx("ul", { className: styles.ul, children: footer.contact.map((elem, index) => (_jsxs("li", { className: styles.contact_li, children: [elem.image ? (_jsx(Image, { className: styles.image, src: elem.image, alt: "Icon", width: 25, height: 25 })) : (_jsx("p", { children: elem.label })), _jsx("p", { children: elem.data })] }, index))) })] }), _jsxs("main", { className: styles.main, children: [_jsx("ul", { className: styles.ul, children: footer.havenova.map((elem, index) => (_jsx("li", { className: styles.li, children: _jsx(Link, { href: elem.href, children: _jsx("p", { children: elem.label }) }) }, index))) }), _jsx("ul", { className: styles.ul, children: footer.services.map((elem, index) => (_jsx("li", { className: styles.li, children: _jsx(Link, { href: elem.href, children: _jsx("p", { children: elem.label }) }) }, index))) }), _jsxs("ul", { className: styles.ul, children: [footer.legal.map((elem, index) => (_jsx("li", { className: styles.li, children: _jsx(Link, { href: elem.href, children: _jsx("p", { children: elem.label }) }) }, index))), _jsx("li", { className: styles.li, children: _jsx("button", { className: styles.cookie_button, onClick: openManager, children: "Cookies Preference" }) })] })] }), _jsxs("p", { className: styles.cta, children: ["2025 - ", _jsx("strong", { children: "Havenova" }), ". Powered by", ' ', _jsxs(Link, { href: '/#', children: [_jsx("strong", { children: "Maped Solutions" }), "."] })] })] }));
};
export default Footer;
