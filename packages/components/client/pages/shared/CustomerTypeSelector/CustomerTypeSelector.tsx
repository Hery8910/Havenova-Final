import type { CustomerType } from '../../../../../types/services';
import styles from './CustomerTypeSelector.module.css';
import { ChoiceButtonField } from '../serviceRequest/ChoiceButtonField';

type Props = {
  label: string;
  options: Record<CustomerType, string>;
  value: CustomerType | '';
  error?: string;
  onChange: (value: CustomerType) => void;
};

export default function CustomerTypeSelector({ label, options, value, error, onChange }: Props) {
  const buttonOptions = (Object.keys(options) as CustomerType[]).map((type) => ({
    value: type,
    label: options[type],
  }));

  return (
    <ChoiceButtonField
      legend={label}
      options={buttonOptions}
      value={value}
      error={error}
      onChange={onChange}
      listClassName={styles.toggleGrid}
      itemClassName={styles.item}
      buttonClassName={styles.choiceButton}
    />
  );
}
