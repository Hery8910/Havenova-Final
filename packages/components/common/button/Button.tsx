import styles from './Button.module.css';

import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes, FaUpload, FaEdit } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';
import {
  MdOutlineAppRegistration,
  MdOutlineContactSupport,
  MdOutlineMarkEmailRead,
  MdPassword,
} from 'react-icons/md';
import { MdLogin } from 'react-icons/md';

export interface ButtonProps {
  cta: string;
  variant?: 'solid' | 'outline' | 'borderless';
  icon:
    | 'forward'
    | 'back'
    | 'confirm'
    | 'cancel'
    | 'open'
    | 'close'
    | 'upload'
    | 'download'
    | 'edit'
    | 'register'
    | 'login'
    | 'password'
    | 'contact';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
}

const icons: Record<string, JSX.Element> = {
  forward: <FaChevronRight />,
  back: <FaChevronLeft />,
  confirm: <FaCheck />,
  cancel: <FaTimes />,
  open: <FaChevronRight />,
  close: <FaTimes />,
  upload: <FaUpload />,
  download: <FiDownload />,
  edit: <FaEdit />,
  register: <MdOutlineAppRegistration />,
  login: <MdLogin />,
  password: <MdPassword />,
  contact: <MdOutlineContactSupport />,
  resendEmail: <MdOutlineMarkEmailRead />,
};

const Button: React.FC<ButtonProps> = ({
  cta,
  variant = 'solid',
  icon,
  disabled = false,
  type = 'button',
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${styles.button}  ${styles[`${variant}_${icon}`]} ${styles[variant]} ${
        disabled ? styles.disabled : ''
      }`}
      aria-label={cta}
    >
      {cta && <span className={styles.text}>{cta}</span>}
      {icon && <span className={`${styles.icon} ${styles[icon]}`}>{icons[icon]}</span>}
    </button>
  );
};

export default Button;
