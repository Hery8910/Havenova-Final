'use client';

import { IoAdd } from 'react-icons/io5';
import styles from './WorkerCreateButton.module.css';

interface WorkerCreateButtonProps {
  label: string;
  helper?: string;
  onClick: () => void;
  disabled?: boolean;
}

const WorkerCreateButton = ({ label, helper, onClick, disabled }: WorkerCreateButtonProps) => {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <span className={styles.iconWrap}>
        <IoAdd aria-hidden="true" />
      </span>
      <span className={styles.textWrap}>
        <span className={styles.label}>{label}</span>
        {helper && <span className={styles.helper}>{helper}</span>}
      </span>
    </button>
  );
};

export default WorkerCreateButton;
