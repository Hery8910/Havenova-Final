import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/HomeHero.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './HomeHero.module.css';
const HomeHero = ({ headline1, headline2, subtitle, cta, image, priorityOnFirstViewport = true, }) => {
    return (_jsxs("section", { className: styles.section, "aria-labelledby": "home-hero-title", children: [_jsx("div", { className: styles.bgWrapper, children: _jsx(Image, { src: image, alt: "" // decorativo
                    , fill: true, sizes: "100vw", priority: priorityOnFirstViewport, fetchPriority: priorityOnFirstViewport ? 'high' : 'auto', className: styles.backgroundImage, quality: 75 }) }), _jsxs("div", { className: styles.main, children: [_jsxs("aside", { className: styles.aside, children: [_jsx("div", { className: styles.div, children: _jsxs("h1", { id: "home-hero-title", className: styles.h1, children: [_jsx("span", { className: styles.h1Line, children: headline1 }), _jsx("span", { className: styles.h1Line, children: headline2 })] }) }), _jsx("p", { className: styles.p, "aria-hidden": "true", children: "&" })] }), _jsx("p", { className: styles.description, children: subtitle }), _jsx(Link, { href: cta.href, className: "button", "aria-label": `${cta.label} – gehe zu ${cta.href}`, children: cta.label })] })] }));
};
export default HomeHero;
