import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './Modal.module.css';
const Modal = ({ show, onClose, iframeProps }) => {
    if (!show)
        return null;
    return (_jsx("div", { className: styles.modalOverlay, children: _jsxs("div", { className: styles.modalContent, children: [_jsx("button", { onClick: onClose, className: styles.closeButton, children: "X" }), _jsx("iframe", { width: iframeProps.width || '100%', height: iframeProps.height || 400, src: iframeProps.src, frameBorder: iframeProps.frameBorder ?? 0, scrolling: iframeProps.scrolling || 'auto', allowFullScreen: iframeProps.allowFullScreen ?? true, style: iframeProps.style, title: "Newsletter Subscription" })] }) }));
};
export default Modal;
