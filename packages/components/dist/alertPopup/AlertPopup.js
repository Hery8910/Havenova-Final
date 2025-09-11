'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from 'next/image';
import { useEffect, useRef, useCallback } from 'react';
import { IoIosClose } from 'react-icons/io';
import styles from './AlertPopup.module.css';
const AlertPopup = ({ type, title, description, onClose }) => {
    const containerRef = useRef(null);
    // ✅ Soporte para cerrar con Escape
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape' && onClose) {
            onClose();
        }
    }, [onClose]);
    // ✅ Montaje y limpieza del listener
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        // Opcional: enfocar el div para accesibilidad
        containerRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
    return (_jsx("section", { role: "alert", "aria-live": "assertive", "aria-labelledby": "alert-title", "aria-describedby": "alert-description", tabIndex: -1, ref: containerRef, className: `${styles.section} card`, style: {
            backgroundImage: type === 'success'
                ? 'url(/svg/success-bg.svg)'
                : type === 'error'
                    ? 'url(/svg/alert-bg.svg)'
                    : undefined,
        }, children: _jsxs("div", { className: styles.wraper, children: [_jsxs("main", { style: {
                        backgroundColor: type === 'success'
                            ? 'var(--bg-success)'
                            : type === 'error'
                                ? 'var(--bg-alert)'
                                : undefined,
                    }, className: styles.main, children: [_jsx(Image, { src: type === 'success' ? '/images/success.webp' : '/images/alert.webp', priority: true, alt: type === 'success' ? 'Success image' : 'Alert image', width: 300, height: 200, className: styles.image }), _jsxs("article", { className: styles.article, style: {
                                color: type === 'success'
                                    ? 'var(--color-success)'
                                    : type === 'error'
                                        ? 'var(--color-alert)'
                                        : undefined,
                            }, children: [_jsx("h4", { id: "alert-title", children: _jsx("strong", { children: title }) }), _jsx("p", { id: "alert-description", children: description })] })] }), onClose && (_jsx("button", { className: styles.button, onClick: onClose, "aria-label": "Close alert", children: _jsx(IoIosClose, {}) }))] }) }));
};
export default AlertPopup;
