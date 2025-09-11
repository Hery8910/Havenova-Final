import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from 'next/image';
import styles from './Mission.module.css';
const Mission = ({ mission }) => {
    return (_jsxs("section", { className: styles.section, children: [_jsxs("article", { className: styles.article, children: [_jsx("h2", { children: mission.title }), _jsx("p", { children: mission.description })] }), _jsx(Image, { className: styles.image, src: mission.image, priority: true, alt: mission.alt, width: 280, height: 280 })] }));
};
export default Mission;
