import { useId } from 'react';
import styles from './CustomerFrequencyStep.module.css';
import { CleaningFrequency } from '../../../../../../types/services';
import CustomerTypeSelector from '../../../shared/CustomerTypeSelector/CustomerTypeSelector';
import { ChoiceButtonField } from '../../../shared';
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
  const frequencyOptions = frequencyOrder.map((freq) => ({
    value: freq,
    label: (
      <>
        <span className={styles.frequencyContent}>
          <span className={styles.frequencyText}>{frequency.options[freq]}</span>
          {freq === 'three_per_month' ? (
            <span className={`${styles.badge} card card--accent`}>{frequency.recommendedLabel}</span>
          ) : null}
        </span>
        <span className={`${styles.frequencyDiscount} card card--neutral`}>
          {frequency.discounts[freq]}
        </span>
      </>
    ),
  }));

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

      <ChoiceButtonField
        legend={frequency.label}
        options={frequencyOptions}
        value={values.frequency}
        error={errors.frequency}
        onChange={onFrequencyChange}
        fieldClassName={styles.group}
        legendClassName={`${styles.legend} type-body-md`}
        listClassName={styles.frequencyList}
        buttonClassName={({ option }) =>
          `${styles.frequencyButton} ${
            option.value === 'three_per_month' ? styles.recommended : ''
          }`.trim()
        }
        errorClassName={styles.errorText}
      />
    </section>
  );
}
