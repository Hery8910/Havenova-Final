import styles from './CustomerFrequencyStep.module.css';
import { CleaningCustomerType, CleaningFrequency } from '../../../../../../types/services';

type Props = {
  customerType: {
    label: string;
    options: Record<CleaningCustomerType, string>;
  };
  frequency: {
    label: string;
    options: Record<CleaningFrequency, string>;
    discounts: Record<CleaningFrequency, string>;
    recommendedLabel: string;
  };
  values: {
    customerType: CleaningCustomerType | '';
    frequency: CleaningFrequency | '';
  };
  errors: {
    customerType?: string;
    frequency?: string;
  };
  frequencyOrder: CleaningFrequency[];
  onCustomerTypeChange: (value: CleaningCustomerType) => void;
  onFrequencyChange: (value: CleaningFrequency) => void;
};

export default function CustomerFrequencyStep({
  customerType,
  frequency,
  values,
  errors,
  frequencyOrder,
  onCustomerTypeChange,
  onFrequencyChange,
}: Props) {
  return (
    <article className={styles.container}>
      <fieldset className={styles.group}>
        <legend className={styles.legend}>{customerType.label}</legend>
        <div className={styles.toggleGrid}>
          {(Object.keys(customerType.options) as CleaningCustomerType[]).map((type) => (
            <button
              key={type}
              type="button"
              className={`${styles.choiceButton} ${values.customerType === type ? styles.active : ''}`}
              aria-pressed={values.customerType === type}
              onClick={() => onCustomerTypeChange(type)}
            >
              {customerType.options[type]}
            </button>
          ))}
        </div>
        <span className={styles.error} aria-live="polite">
          {errors.customerType || ''}
        </span>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>{frequency.label}</legend>
        <div className={styles.frequencyGrid}>
          {frequencyOrder.map((freq) => (
            <button
              key={freq}
              type="button"
              className={`${styles.frequencyButton} ${values.frequency === freq ? styles.active : ''} ${freq === 'three_per_month' ? styles.recommended : ''}`}
              aria-pressed={values.frequency === freq}
              onClick={() => onFrequencyChange(freq)}
            >
              <span className={styles.frequencyText}>{frequency.options[freq]}</span>
              <span className={styles.frequencyDiscount}>{frequency.discounts[freq]}</span>
              {freq === 'three_per_month' && (
                <span className={styles.badge}>{frequency.recommendedLabel}</span>
              )}
            </button>
          ))}
        </div>
        <span className={styles.error} aria-live="polite">
          {errors.frequency || ''}
        </span>
      </fieldset>
    </article>
  );
}
