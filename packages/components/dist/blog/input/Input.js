import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect } from 'react';
import styles from './Input.module.css';
export default function Input({ heading, value, onChange, onBlur, placeholder = 'Blog Title', maxLength = 120, height, }) {
    const textareaRef = useRef(null);
    // Ajuste automático de altura cuando el usuario escribe
    const handleInput = (e) => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = height ? height : 'auto';
            el.style.height = `${el.scrollHeight}px`;
        }
        onChange(e.currentTarget.value);
        onBlur(e.currentTarget.value);
    };
    // Ajuste automático de altura cuando el valor cambia desde fuera
    useEffect(() => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = height ? height : 'auto';
            el.style.height = `${el.scrollHeight}px`;
        }
    }, [value, height]);
    return (_jsx("textarea", { ref: textareaRef, className: `${styles.titleInput} ${styles[`${heading}`]}`, value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, rows: 1, maxLength: maxLength, onInput: handleInput, style: height ? { height } : undefined }));
}
