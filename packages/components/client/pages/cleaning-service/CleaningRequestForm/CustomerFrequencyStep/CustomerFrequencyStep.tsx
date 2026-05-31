import { useId } from 'react';
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
  const sectionLabelId = useId();
  const customerErrorId = useId();
  const frequencyErrorId = useId();

  return (
    <section className={styles.container} aria-labelledby={sectionLabelId}>
      <h3 className={styles.srOnly} id={sectionLabelId}>
        {`${customerType.label}. ${frequency.label}`}
      </h3>
      <fieldset className={styles.group}>
        <legend className={`${styles.legend} type-body-md`}>{customerType.label}</legend>
        <ul className={styles.customerTypeList}>
          {(Object.keys(customerType.options) as CleaningCustomerType[]).map((type) => (
            <li key={type}>
              <button
                type="button"
                className={`${styles.customerTypeButton} ${values.customerType === type ? styles.active : ''} ${errors.customerType ? styles.fieldControlError : ''} button button--outline `}
                aria-pressed={values.customerType === type}
                aria-invalid={Boolean(errors.customerType)}
                aria-describedby={errors.customerType ? customerErrorId : undefined}
                onClick={() => onCustomerTypeChange(type)}
              >
                <span className={styles.customerTypeLabel}>{customerType.options[type]}</span>
              </button>
            </li>
          ))}
        </ul>
        {errors.customerType ? (
          <p className={styles.errorText} id={customerErrorId}>
            {errors.customerType}
          </p>
        ) : null}
      </fieldset>

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
