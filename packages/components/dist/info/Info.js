'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styles from './Info.module.css';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';
const Info = ({ direction, info, image }) => {
    const [open, setOpen] = useState(false);
    if (!info)
        return null;
    return (_jsxs("main", { className: styles.main, children: [_jsx("button", { className: styles.open, onClick: () => setOpen((pre) => !pre), children: _jsx(AiOutlineQuestionCircle, {}) }), open && (_jsxs("article", { className: `${styles.article} ${styles[`${direction}`]}`, children: [_jsxs("div", { className: styles.div, children: [_jsx("p", { children: info.question }), _jsx("button", { className: styles.close, onClick: () => setOpen(false), children: _jsx(IoClose, {}) })] }), _jsx("p", { children: info.answer }), image && (_jsx(Image, { className: styles.image, src: image.url, priority: true, alt: image.alt, width: 600, height: 200 }))] }))] }));
};
export default Info;
