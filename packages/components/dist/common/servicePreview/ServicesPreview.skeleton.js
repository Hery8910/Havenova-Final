import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ServicesPreview.skeleton.tsx
import styles from './ServicesPreview.module.css';
export default function SkeletonServicesPreview() {
    const items = Array.from({ length: 6 });
    return (_jsxs("section", { className: styles.section, "aria-busy": "true", "aria-live": "polite", children: [_jsxs("div", { className: styles.bgWrapper, "aria-hidden": "true", children: [_jsx("div", { className: `${styles.backgroundImage} ${styles.skelBg}` }), _jsx("div", { className: styles.bgOverlay })] }), _jsx("div", { className: `${styles.skelH2} ${styles.animShimmer}` }), _jsx("div", { className: `${styles.skelH3} ${styles.animShimmer}` }), _jsx("ul", { className: styles.ul, "aria-hidden": "true", children: items.map((_, i) => (_jsxs("li", { className: styles.li, children: [_jsx("div", { className: `${styles.skelIcon} ${styles.animShimmer}` }), _jsx("div", { className: `${styles.skelH4} ${styles.animShimmer}` })] }, i))) }), _jsx("div", { className: `${styles.skelDesc} ${styles.animShimmer}` }), _jsx("div", { className: `${styles.skelBtn} ${styles.animShimmer}`, role: "presentation" })] }));
}
