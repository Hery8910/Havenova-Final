import { jsx as _jsx } from "react/jsx-runtime";
import styles from './MessageBox.module.css';
const MessageBox = ({ message, className = 'info' }) => {
    // Elige la clase dinámica según el tipo
    return (_jsx("p", { className: styles[className], children: _jsx("em", { children: message }) }));
};
export default MessageBox;
