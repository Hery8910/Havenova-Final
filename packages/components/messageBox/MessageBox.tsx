import styles from './MessageBox.module.css';

interface MessageBoxProps {
  message: string;
  className: 'error' | 'info' | 'success';
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, className = 'info' }) => {
  return (
    <p className={styles[className]}>
      <em>{message}</em>
    </p>
  );
};

export default MessageBox;
