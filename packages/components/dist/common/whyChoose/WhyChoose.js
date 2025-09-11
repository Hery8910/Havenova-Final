import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './WhyChoose.module.css';
import Image from 'next/image';
const WhyChoose = ({ title, description, points }) => {
    return (_jsxs("section", { className: styles.section, "aria-labelledby": "why-choose-title", "aria-describedby": "why-choose-desc", children: [_jsxs("header", { className: styles.header, children: [_jsx("h2", { id: "why-choose-title", className: styles.h2, children: title }), _jsx("p", { id: "why-choose-desc", className: styles.desc, children: description })] }), _jsx("ul", { className: styles.ul, children: points.map((point) => (_jsxs("li", { className: styles.li, children: [_jsx("figure", { className: styles.figure, "aria-hidden": "true", children: _jsx(Image, { className: styles.icon, src: point.image.src, alt: "", width: 80, height: 80, loading: "lazy", decoding: "async", sizes: "80px" }) }), _jsx("h3", { className: styles.h3, children: point.title })] }, point.title))) })] }));
};
export default WhyChoose;
