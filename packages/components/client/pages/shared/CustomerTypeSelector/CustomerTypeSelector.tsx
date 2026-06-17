import type { CustomerType } from '../../../../../types/services';
import styles from './CustomerTypeSelector.module.css';
import { useId } from 'react';

type Props = {
  label: string;
  options: Record<CustomerType, string>;
  value: CustomerType | '';
  error?: string;
  onChange: (value: CustomerType) => void;
};

export default function CustomerTypeSelector({ label, options, value, error, onChange }: Props) {
  const errorId = useId();

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{label}</legend>
      <ul className={styles.toggleGrid}>
        {(Object.keys(options) as CustomerType[]).map((type) => (
          <li key={type} className={styles.li}>
            <button
              type="button"
              className={` button button--outline ${styles.choiceButton} ${value === type ? styles.active : ''} ${
                error ? styles.fieldControlError : ''
              }`}
              aria-pressed={value === type}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              onClick={() => onChange(type)}
            >
              {options[type]}
            </button>
          </li>
        ))}
      </ul>
      <span className={styles.error} id={error ? errorId : undefined} aria-live="polite">
        {error || ''}
      </span>
    </fieldset>
  );
}
