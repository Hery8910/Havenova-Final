import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import Image from 'next/image';
import styles from './WelcomeOfferBanner.module.css';
const WelcomeOfferBanner = ({ header, description, cta, image, priorityOnFirstViewport = false, }) => {
    return (_jsxs("section", { className: styles.section, "aria-labelledby": "offer-banner-title", "aria-describedby": "offer-banner-desc", children: [_jsx("figure", { className: styles.figure, children: _jsx(Image, { className: styles.image, src: image.src, alt: image.alt, width: 500, height: 500, sizes: "(min-width: 1025px) 450px, 300px", priority: priorityOnFirstViewport, fetchPriority: priorityOnFirstViewport ? 'high' : 'auto' }) }), _jsxs("div", { className: styles.main, children: [_jsx("h2", { id: "offer-banner-title", className: styles.h2, children: header }), _jsx("p", { id: "offer-banner-desc", className: styles.p, children: description }), _jsx(Link, { href: cta.href, className: "button", "aria-label": `${cta.label} – gehe zu ${cta.href}`, children: cta.label })] })] }));
};
export default WelcomeOfferBanner;
