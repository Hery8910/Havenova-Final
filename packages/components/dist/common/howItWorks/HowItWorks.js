import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/WorkFlow.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './HowItWorks.module.css';
const HowItWorks = ({ title, subtitle, description, steps, cta }) => {
    return (_jsxs("section", { className: styles.section, "aria-labelledby": "howitworks-title", children: [_jsxs("header", { className: styles.header, children: [_jsx("h2", { id: "howitworks-title", children: title }), _jsx("h3", { className: styles.h3, children: subtitle })] }), _jsx("ol", { className: styles.ol, children: steps.map((step, idx) => (_jsxs("li", { className: styles.li, children: [_jsxs("figure", { children: [_jsx(Image, { className: styles.image, src: step.image.src, alt: step.image.alt, width: 350, height: 200, sizes: "(min-width: 1025px) 400px, (min-width: 768px) 350px, 90vw", loading: "lazy", decoding: "async" }), _jsx("figcaption", { className: "sr-only", children: step.image.alt })] }), _jsxs("article", { className: `${styles.article} card`, "aria-labelledby": `how-step-${idx}`, children: [_jsx("h4", { className: styles.h4, id: `how-step-${idx}`, children: step.title }), _jsx("p", { children: step.description })] })] }, `${idx}-${step.title}`))) }), _jsx("p", { className: styles.p, children: description }), _jsx(Link, { href: cta.href, className: "button", "aria-label": `${cta.label} – How it works`, children: cta.label })] }));
};
export default HowItWorks;
