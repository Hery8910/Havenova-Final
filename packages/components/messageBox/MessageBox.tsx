import React from 'react';
import styles from './MessageBox.module.css';

interface MessageBoxProps {
  message: string;
  className: 'error' | 'info' | 'success';
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, className = 'info' }) => {
  // Elige la clase dinámica según el tipo

  return (
    <p className={styles[className]}>
      <em>{message}</em>
    </p>
  );
};

export default MessageBox;
