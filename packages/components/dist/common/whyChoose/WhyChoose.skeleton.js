import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/WhyChoose.skeleton.tsx
import styles from './WhyChoose.module.css';
export default function SkeletonWhyChoose() {
    const items = Array.from({ length: 4 });
    return (_jsxs("section", { className: styles.section, "aria-busy": "true", "aria-live": "polite", children: [_jsxs("header", { className: styles.header, children: [_jsx("div", { className: `${styles.skelH2} ${styles.animShimmer}` }), _jsx("div", { className: `${styles.skelP} ${styles.animShimmer}` })] }), _jsx("ul", { className: styles.ul, "aria-hidden": "true", children: items.map((_, i) => (_jsxs("li", { className: styles.li, children: [_jsx("div", { className: `${styles.skelIcon} ${styles.animShimmer}` }), _jsx("div", { className: `${styles.skelH3} ${styles.animShimmer}` })] }, i))) })] }));
}
