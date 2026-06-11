import { useId } from 'react';
import styles from './CustomerFrequencyStep.module.css';
import { CleaningFrequency } from '../../../../../../types/services';
import CustomerTypeSelector from '../../../shared/CustomerTypeSelector/CustomerTypeSelector';
import type { CleaningRequestCustomerType } from '../cleaningRequest.types';

type Props = {
  customerType: {
    label: string;
    options: Record<CleaningRequestCustomerType, string>;
  };
  frequency: {
    label: string;
    options: Record<CleaningFrequency, string>;
    discounts: Record<CleaningFrequency, string>;
    recommendedLabel: string;
  };
  values: {
    customerType: CleaningRequestCustomerType | '';
    frequency: CleaningFrequency | '';
  };
  errors: {
    customerType?: string;
    frequency?: string;
  };
  frequencyOrder: CleaningFrequency[];
  onCustomerTypeChange: (value: CleaningRequestCustomerType) => void;
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
  const sectionLabelId = useId();
  const frequencyErrorId = useId();

  return (
    <section className={styles.container} aria-labelledby={sectionLabelId}>
      <h3 className={styles.srOnly} id={sectionLabelId}>
        {`${customerType.label}. ${frequency.label}`}
      </h3>
      <CustomerTypeSelector
        label={customerType.label}
        options={customerType.options}
        value={values.customerType}
        error={errors.customerType}
        onChange={onCustomerTypeChange}
      />

      <fieldset className={styles.group}>
        <legend className={`${styles.legend} type-body-md`}>{frequency.label}</legend>
        <ul className={styles.frequencyList}>
          {frequencyOrder.map((freq) => (
            <li key={freq}>
              <button
                type="button"
                className={`button button--outline ${styles.frequencyButton} ${values.frequency === freq ? styles.active : ''} ${freq === 'three_per_month' ? styles.recommended : ''} ${errors.frequency ? styles.fieldControlError : ''}`}
                aria-pressed={values.frequency === freq}
                aria-invalid={Boolean(errors.frequency)}
                aria-describedby={errors.frequency ? frequencyErrorId : undefined}
                onClick={() => onFrequencyChange(freq)}
              >
                <span className={styles.frequencyContent}>
                  <span className={styles.frequencyText}>{frequency.options[freq]}</span>
                  {freq === 'three_per_month' && (
                    <span className={`${styles.badge} card card--accent`}>
                      {frequency.recommendedLabel}
                    </span>
                  )}
                </span>
                <span className={`${styles.frequencyDiscount} card card--neutral`}>
                  {frequency.discounts[freq]}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {errors.frequency ? (
          <p className={styles.errorText} id={frequencyErrorId}>
            {errors.frequency}
          </p>
        ) : null}
      </fieldset>
    </section>
  );
}
