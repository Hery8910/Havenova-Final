import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './ReviewStars.module.css';
const ReviewStars = ({ rating }) => {
    const totalStars = 5;
    const clampedRating = Math.max(0, Math.min(rating, totalStars));
    const percentage = (clampedRating / totalStars) * 100;
    return (_jsxs("div", { className: styles.div_stars, role: "img", "aria-label": `Valoración: ${clampedRating} de 5 estrellas`, children: [_jsx("div", { className: styles.div_gray, "aria-hidden": "true", children: Array.from({ length: totalStars }).map((_, index) => (_jsx(Star, { className: styles.svg_gray }, `gray-${index}`))) }), _jsx("div", { className: styles.div_yellow, style: { width: `${percentage}%` }, "aria-hidden": "true", children: Array.from({ length: totalStars }).map((_, index) => (_jsx(Star, { className: styles.svg_yellow }, `yellow-${index}`))) })] }));
};
export default ReviewStars;
// Icono SVG separado (reutilizable, accesible)
const Star = ({ className }) => (_jsx("svg", { className: className, fill: "inherit", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", focusable: "false", "aria-hidden": "true", children: _jsx("path", { d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 \n             9.19 8.63 2 9.24l5.46 4.73L5.82 21z" }) }));
