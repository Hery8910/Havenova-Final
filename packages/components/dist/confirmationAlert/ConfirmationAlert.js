'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './ConfirmationAlert.module.css';
const ConfirmationAlert = ({ title, message, animationData, confirmLabel = 'Confirm', cancelLabel = 'Cancel', extraClass = '', onConfirm, onCancel, }) => {
    return (_jsx("main", { className: styles.section_main, children: _jsxs("article", { className: styles.section_article, children: [_jsx("h4", { className: styles.title, children: title }), _jsx("p", { className: styles.message, children: message }), _jsxs("div", { className: styles.button_group, children: [_jsx("button", { className: styles.cancel_button, onClick: onCancel, children: cancelLabel }), _jsx("button", { className: extraClass ? styles[`${extraClass}_button`] : styles.confirm_button, onClick: onConfirm, children: confirmLabel })] })] }) }));
};
export default ConfirmationAlert;
