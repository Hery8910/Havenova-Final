import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from 'next/link';
import styles from './Cta.module.css';
import Image from 'next/image';
const Cta = ({ cta }) => {
    return (_jsxs("section", { className: styles.section, children: [_jsxs("article", { className: styles.article, children: [_jsx("h2", { children: cta.title }), _jsx("p", { children: cta.description }), _jsx(Link, { className: "button", href: cta.link, children: cta.cta })] }), _jsx(Image, { className: styles.image, src: cta.image, priority: true, alt: cta.alt, width: 280, height: 280 })] }));
};
export default Cta;
