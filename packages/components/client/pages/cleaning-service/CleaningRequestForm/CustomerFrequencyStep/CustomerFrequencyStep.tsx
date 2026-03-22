import styles from './CustomerFrequencyStep.module.css';
import { CleaningCustomerType, CleaningFrequency } from '../../../../../../types/services';
import CustomerTypeSelector from '../../../shared/CustomerTypeSelector/CustomerTypeSelector';

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
      <CustomerTypeSelector
        label={customerType.label}
        options={customerType.options}
        value={values.customerType}
        error={errors.customerType}
        onChange={onCustomerTypeChange}
      />

      <fieldset className={styles.group}>
        <legend className={styles.legend}>{frequency.label}</legend>
        <ul className={styles.frequencyGrid}>
          {frequencyOrder.map((freq) => (
            <li key={freq}>
              <button
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
            </li>
          ))}
        </ul>
        <span className={styles.error} aria-live="polite">
          {errors.frequency || ''}
        </span>
      </fieldset>
    </section>
  );
}
