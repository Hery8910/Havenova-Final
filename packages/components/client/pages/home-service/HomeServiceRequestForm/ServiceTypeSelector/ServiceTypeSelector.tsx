import type { HomeServiceKind } from '../homeServiceTypes';
import styles from './ServiceTypeSelector.module.css';

type Props = {
  texts: {
    label: string;
    helper: string;
    options: Record<HomeServiceKind, { title: string; description: string }>;
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
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{texts.label}</legend>
      <p className={styles.helper}>{texts.helper}</p>
      <ul className={styles.serviceGrid}>
        {serviceTypeOrder.map((type) => (
          <li key={type}>
            <button
              type="button"
              className={`${styles.serviceButton} ${value === type ? styles.active : ''}`}
              aria-pressed={value === type}
              onClick={() => onChange(type)}
            >
              <span className={styles.serviceTitle}>{texts.options[type].title}</span>
              <span className={styles.serviceDescription}>{texts.options[type].description}</span>
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
