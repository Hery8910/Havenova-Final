import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './WelcomeOfferBanner.module.css';
const SkeletonWelcomeOfferBanner = () => {
    return (_jsxs("section", { className: `${styles.section} ${styles.skeletonCard}`, "aria-busy": "true", "aria-live": "polite", children: [_jsx("div", { className: `${styles.image} ${styles.skelMedia} ${styles.animShimmer}`, "aria-hidden": "true" }), _jsxs("div", { className: styles.main, children: [_jsx("div", { className: `${styles.skeletonText} ${styles.animShimmer}` }), _jsx("div", { className: `${styles.skeletonTextSm} ${styles.animShimmer}` }), _jsx("div", { className: `${styles.skeletonTextSm} ${styles.animShimmer}` }), _jsx("div", { className: `${styles.skeletonButton} ${styles.animShimmer}`, role: "presentation" })] })] }));
};
export default SkeletonWelcomeOfferBanner;
