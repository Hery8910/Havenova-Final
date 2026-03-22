'use client';

import type { UserAddress } from '../../../../../../types/profile';
import styles from './AddressFormFields.module.css';

type AddressErrors = Partial<Record<keyof UserAddress, string>>;

export interface AddressFormFieldsProps {
  value: UserAddress;
  onChange: (value: UserAddress) => void;
  texts?: {
    addressDetailsAriaLabel?: string;
    fields?: {
      street?: string;
      streetNumber?: string;
      postalCode?: string;
      district?: string;
      floor?: string;
    };
  };
  errors?: AddressErrors;
  disabled?: boolean;
}

export default function AddressFormFields({
  value,
  onChange,
  texts,
  errors,
  disabled = false,
}: AddressFormFieldsProps) {
  const handleFieldChange =
    (field: keyof UserAddress) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange({
        ...value,
        [field]: event.target.value,
      });

  return (
    <section className={styles.grid} aria-label={texts?.addressDetailsAriaLabel ?? 'Address details'}>
      <label className={styles.field}>
        <span className={styles.label}>{texts?.fields?.street ?? 'Street'}</span>
        <input
          className={styles.input}
          type="text"
          autoComplete="address-line1"
          value={value.street}
          onChange={handleFieldChange('street')}
          disabled={disabled}
        />
        {errors?.street && <span className={styles.error}>{errors.street}</span>}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{texts?.fields?.streetNumber ?? 'Number'}</span>
        <input
          className={styles.input}
          type="text"
          autoComplete="address-line2"
          value={value.streetNumber}
          onChange={handleFieldChange('streetNumber')}
          disabled={disabled}
        />
        {errors?.streetNumber && <span className={styles.error}>{errors.streetNumber}</span>}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{texts?.fields?.postalCode ?? 'Postal code'}</span>
        <input
          className={styles.input}
          type="text"
          autoComplete="postal-code"
          value={value.postalCode}
          onChange={handleFieldChange('postalCode')}
          disabled={disabled}
        />
        {errors?.postalCode && <span className={styles.error}>{errors.postalCode}</span>}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{texts?.fields?.district ?? 'District'}</span>
        <input
          className={styles.input}
          type="text"
          autoComplete="address-level2"
          value={value.district}
          onChange={handleFieldChange('district')}
          disabled={disabled}
        />
        {errors?.district && <span className={styles.error}>{errors.district}</span>}
      </label>

      <label className={`${styles.field} ${styles.fullWidth}`}>
        <span className={styles.label}>{texts?.fields?.floor ?? 'Floor'}</span>
        <input
          className={styles.input}
          type="text"
          autoComplete="off"
          value={value.floor || ''}
          onChange={handleFieldChange('floor')}
          disabled={disabled}
        />
        {errors?.floor && <span className={styles.error}>{errors.floor}</span>}
      </label>
    </section>
  );
}
