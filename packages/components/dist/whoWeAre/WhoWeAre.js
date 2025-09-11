import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from 'next/image';
import styles from './WhoWeAre.module.css';
const WhoWeAre = ({ weAre }) => {
    return (_jsxs("section", { className: styles.section, children: [_jsxs("header", { className: styles.header, children: [_jsx("h2", { children: weAre.title }), _jsx("p", { children: weAre.description })] }), _jsx("ul", { className: styles.ul, children: weAre.list.map((elem, index) => (_jsxs("li", { className: styles.li, children: [elem.title && _jsx("p", { className: styles.title_p, children: elem.title }), _jsxs("p", { className: `${styles.description_p} card`, children: [elem.description, ' ', _jsx(Image, { className: styles.image, src: "/svg/check.svg", priority: true, alt: "Check icon", width: 30, height: 30 })] })] }, index))) })] }));
};
export default WhoWeAre;
