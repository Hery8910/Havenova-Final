import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './ServicesPreview.module.css';
import Image from 'next/image';
import Link from 'next/link';
const ServicesPreview = ({ title, subtitle, description, items, cta, theme, }) => {
    const bgSrc = theme === 'dark'
        ? '/svg/background/service-background-light.svg'
        : '/svg/background/service-background-dark.svg';
    return (_jsxs("section", { className: styles.section, "aria-labelledby": "servicespreview-title", children: [_jsx("div", { className: styles.bgWrapper, "aria-hidden": "true", children: _jsx(Image, { src: bgSrc, alt: "", fill: true, sizes: "100vw", loading: "lazy", fetchPriority: "auto", className: styles.backgroundImage }) }), _jsx("h2", { id: "servicespreview-title", className: styles.h2, children: title }), _jsx("h3", { className: styles.h3, children: subtitle }), _jsx("ul", { className: styles.ul, children: items.map((item, idx) => (_jsxs("li", { className: styles.li, children: [_jsx("figure", { className: styles.figure, children: _jsx(Image, { className: styles.icon, src: item.image.src, alt: "", width: 100, height: 100, loading: "lazy", decoding: "async", sizes: "100px" }) }), _jsx("h4", { className: styles.h4, children: item.title })] }, `${idx}-${item.title}`))) }), _jsx("p", { className: styles.p, children: description }), _jsx(Link, { href: cta.href, className: "button", "aria-label": `${cta.label} – gehe zu ${cta.href}`, children: cta.label })] }));
};
export default ServicesPreview;
