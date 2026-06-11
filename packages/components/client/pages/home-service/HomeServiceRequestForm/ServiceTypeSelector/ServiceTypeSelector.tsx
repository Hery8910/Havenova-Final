import type { HomeServiceKind } from '../homeServiceTypes';
import { useId } from 'react';
import styles from './ServiceTypeSelector.module.css';

type Props = {
  texts: {
    label: string;
    options: Record<HomeServiceKind, { title: string }>;
  };
  value: HomeServiceKind | '';
  error?: string;
  serviceTypeOrder: HomeServiceKind[];
  onChange: (value: HomeServiceKind) => void;
};

export default function ServiceTypeSelector({
  texts,
  value,
  error,
  serviceTypeOrder,
  onChange,
}: Props) {
  const errorId = useId();

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{texts.label}</legend>
      <ul className={styles.serviceGrid}>
        {serviceTypeOrder.map((type) => (
          <li key={type} className={styles.serviceItem}>
            <button
              type="button"
              className={`button button--outline ${styles.serviceButton} ${value === type ? styles.active : ''} ${
                error ? styles.fieldControlError : ''
              }`}
              aria-pressed={value === type}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              onClick={() => onChange(type)}
            >
              <span className={styles.serviceTitle}>{texts.options[type].title}</span>
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
