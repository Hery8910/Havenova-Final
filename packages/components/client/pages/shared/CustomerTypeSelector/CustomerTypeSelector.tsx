import { CleaningCustomerType } from '../../../../../types/services';
import styles from './CustomerTypeSelector.module.css';

type Props = {
  label: string;
  helper?: string;
  options: Record<CleaningCustomerType, string>;
  value: CleaningCustomerType | '';
  error?: string;
  onChange: (value: CleaningCustomerType) => void;
};

export default function CustomerTypeSelector({
  label,
  helper,
  options,
  value,
  error,
  onChange,
}: Props) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{label}</legend>
      {helper ? <p className={styles.helper}>{helper}</p> : null}
      <ul className={styles.toggleGrid}>
        {(Object.keys(options) as CleaningCustomerType[]).map((type) => (
          <li key={type}>
            <button
              type="button"
              className={`${styles.choiceButton} ${value === type ? styles.active : ''}`}
              aria-pressed={value === type}
              onClick={() => onChange(type)}
            >
              {options[type]}
            </button>
          </li>
        ))}
      </ul>
      <span className={styles.error} aria-live="polite">
        {error || ''}
      </span>
    </fieldset>
  );
}
