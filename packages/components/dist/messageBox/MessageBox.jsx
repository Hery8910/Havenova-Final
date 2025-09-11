import React from 'react';
import styles from './MessageBox.module.css';
const MessageBox = ({ message, className = 'info' }) => {
    // Elige la clase dinámica según el tipo
    return (<p className={styles[className]}>
      <em>{message}</em>
    </p>);
};
export default MessageBox;
