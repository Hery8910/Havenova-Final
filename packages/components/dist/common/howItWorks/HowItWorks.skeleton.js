import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/WorkFlow.skeleton.tsx
import styles from './HowItWorks.module.css';
const lines = Array.from({ length: 3 });
export default function SkeletonHowItWorks() {
    return (_jsxs("section", { className: `${styles.section} ${styles.skeletonSection}`, "aria-busy": "true", "aria-live": "polite", children: [_jsxs("header", { className: styles.header, children: [_jsx("div", { className: `${styles.skelBlock} ${styles.skelH2}` }), _jsx("div", { className: `${styles.skelBlock} ${styles.skelH3}` })] }), _jsx("ol", { className: styles.ol, "aria-hidden": "true", children: lines.map((_, i) => (_jsxs("li", { className: styles.li, children: [_jsx("div", { className: `${styles.skelMedia}` }), _jsxs("article", { className: `${styles.article} card`, children: [_jsx("div", { className: `${styles.skelBlock} ${styles.skelH4}` }), _jsx("div", { className: `${styles.skelBlock} ${styles.skelP}` }), _jsx("div", { className: `${styles.skelBlock} ${styles.skelP} ${styles.skelPshort}` })] })] }, i))) }), _jsx("div", { className: `${styles.skelBlock} ${styles.skelDesc}` }), _jsx("div", { className: `${styles.skelBtn}`, role: "presentation" })] }));
}
