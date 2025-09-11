'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './Card.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IoIosArrowForward } from 'react-icons/io';
const Card = ({ cards }) => {
    const router = useRouter();
    const handleClick = (card) => {
        if (card.link) {
            router.push(card.link);
        }
    };
    return (_jsx("ul", { className: styles.ul, children: cards.map((card, index) => (_jsxs("li", { className: `${styles.li} card ${index % 2 === 0 ? styles.right : styles.left} ${card.link ? styles.link : ''}`, onClick: () => handleClick(card), children: [_jsx("h4", { children: card.title }), _jsx("p", { children: card.description }), _jsx(Image, { className: styles.image, src: card.image.src, priority: true, alt: card.image.alt || 'Image', width: 90, height: 90 }), card.link && (_jsxs("p", { className: styles.p, children: ["Order now ", _jsx(IoIosArrowForward, {})] }))] }, index))) }));
};
export default Card;
