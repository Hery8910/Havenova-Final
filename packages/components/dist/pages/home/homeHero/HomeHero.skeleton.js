import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/HomeHero.skeleton.tsx
import styles from './HomeHero.module.css';
const HomeHeroSkeleton = () => {
    return (_jsxs("section", { className: styles.section, "aria-busy": "true", "aria-live": "polite", children: [_jsx("div", { className: `${styles.fakeBackground} ${styles.animShimmer}` }), _jsxs("div", { className: styles.main, children: [_jsxs("aside", { className: styles.aside, children: [_jsxs("div", { className: styles.div, children: [_jsx("div", { className: `${styles.skeletonText} ${styles.animShimmer}` }), _jsx("div", { className: `${styles.skeletonText} ${styles.animShimmer}` })] }), _jsx("div", { className: `${styles.skeletonCircle} ${styles.animShimmer}` })] }), _jsx("div", { className: `${styles.skeletonSubtitle} ${styles.animShimmer}` }), _jsx("div", { className: `${styles.skeletonButton} ${styles.animShimmer}`, role: "presentation" })] })] }));
};
export default HomeHeroSkeleton;
