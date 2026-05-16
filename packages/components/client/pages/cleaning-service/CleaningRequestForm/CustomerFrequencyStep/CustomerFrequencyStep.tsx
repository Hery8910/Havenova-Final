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
    <section className={styles.container} aria-label="Customer and frequency details">
      <fieldset className={styles.group}>
        <legend className={styles.legend}>{customerType.label}</legend>
        <ul className={styles.customerTypeList}>
          {(Object.keys(customerType.options) as CleaningCustomerType[]).map((type) => (
            <li key={type}>
              <button
                type="button"
                className={`${styles.customerTypeButton} ${values.customerType === type ? styles.active : ''} ${errors.customerType ? styles.fieldControlError : ''}`}
                aria-pressed={values.customerType === type}
                aria-invalid={Boolean(errors.customerType)}
                onClick={() => onCustomerTypeChange(type)}
              >
                <span className={styles.customerTypeLabel}>{customerType.options[type]}</span>
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.legend}>{frequency.label}</legend>
        <ul className={styles.frequencyList}>
          {frequencyOrder.map((freq) => (
            <li key={freq}>
              <button
                type="button"
                className={`${styles.frequencyButton} ${values.frequency === freq ? styles.active : ''} ${freq === 'three_per_month' ? styles.recommended : ''} ${errors.frequency ? styles.fieldControlError : ''}`}
                aria-pressed={values.frequency === freq}
                aria-invalid={Boolean(errors.frequency)}
                onClick={() => onFrequencyChange(freq)}
              >
                <span className={styles.frequencyContent}>
                  <span className={styles.frequencyText}>{frequency.options[freq]}</span>
                  {freq === 'three_per_month' && (
                    <span className={styles.badge}>{frequency.recommendedLabel}</span>
                  )}
                </span>
                <span className={styles.frequencyDiscount}>{frequency.discounts[freq]}</span>
              </button>
            </li>
          ))}
        </ul>
      </fieldset>
    </section>
  );
}
