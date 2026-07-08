import type { ReactNode } from 'react';
import styles from './RequestQuantityStepper.module.css';

interface RequestQuantityStepperProps {
  value: ReactNode;
  label: string;
  decrementLabel: string;
  incrementLabel: string;
  onDecrement: () => void;
  onIncrement: () => void;
  error?: boolean;
  describedBy?: string;
  decrementIcon?: ReactNode;
  incrementIcon?: ReactNode;
}

export default function RequestQuantityStepper({
  value,
  label,
  decrementLabel,
  incrementLabel,
  onDecrement,
  onIncrement,
  error = false,
  describedBy,
  decrementIcon = '-',
  incrementIcon = '+',
}: RequestQuantityStepperProps) {
  return (
    <div
      className={`${styles.counter} ${error ? styles.counterError : ''}`}
      role="group"
      aria-label={label}
      aria-describedby={describedBy}
    >
      <button
        type="button"
        className={`button button--outline ${styles.counterButton}`}
        onClick={onDecrement}
        aria-label={decrementLabel}
      >
        {decrementIcon}
      </button>
      <output className={styles.counterValue} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className={`button button--outline ${styles.counterButton}`}
        onClick={onIncrement}
        aria-label={incrementLabel}
      >
        {incrementIcon}
      </button>
    </div>
  );
}
