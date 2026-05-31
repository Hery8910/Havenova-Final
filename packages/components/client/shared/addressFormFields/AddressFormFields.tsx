'use client';

import { useId } from 'react';
import type { UserAddress } from '../../../../types/profile';
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
  const baseId = useId();
  const handleFieldChange =
    (field: keyof UserAddress) => (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange({
        ...value,
        [field]: event.target.value,
      });

  const getFieldId = (field: keyof UserAddress) => `${baseId}-${field}`;
  const getErrorId = (field: keyof UserAddress) => `${baseId}-${field}-error`;
  const getDescribedBy = (field: keyof UserAddress) =>
    errors?.[field] ? getErrorId(field) : undefined;

  return (
    <section
      className={styles.grid}
      aria-label={texts?.addressDetailsAriaLabel ?? 'Address details'}
    >
      <label className={`${styles.field} ${styles.streetField}`}>
        <span className="label">{texts?.fields?.street ?? 'Street'}</span>
        <input
          id={getFieldId('street')}
          className="input"
          type="text"
          autoComplete="address-line1"
          value={value.street}
          onChange={handleFieldChange('street')}
          disabled={disabled}
          aria-invalid={Boolean(errors?.street)}
          aria-describedby={getDescribedBy('street')}
        />
        {errors?.street && (
          <span className="type-caption" id={getErrorId('street')}>
            {errors.street}
          </span>
        )}
      </label>

      <label className={`${styles.field} ${styles.streetNumberField}`}>
        <span className="label">{texts?.fields?.streetNumber ?? 'Number'}</span>
        <input
          id={getFieldId('streetNumber')}
          className="input"
          type="text"
          autoComplete="address-line2"
          value={value.streetNumber}
          onChange={handleFieldChange('streetNumber')}
          disabled={disabled}
          aria-invalid={Boolean(errors?.streetNumber)}
          aria-describedby={getDescribedBy('streetNumber')}
        />
        {errors?.streetNumber && (
          <span className="type-caption" id={getErrorId('streetNumber')}>
            {errors.streetNumber}
          </span>
        )}
      </label>

      <label className={`${styles.field} ${styles.postalCodeField}`}>
        <span className="label">{texts?.fields?.postalCode ?? 'Postal code'}</span>
        <input
          id={getFieldId('postalCode')}
          className="input"
          type="text"
          autoComplete="postal-code"
          value={value.postalCode}
          onChange={handleFieldChange('postalCode')}
          disabled={disabled}
          aria-invalid={Boolean(errors?.postalCode)}
          aria-describedby={getDescribedBy('postalCode')}
        />
        {errors?.postalCode && (
          <span className="type-caption" id={getErrorId('postalCode')}>
            {errors.postalCode}
          </span>
        )}
      </label>

      <label className={`${styles.field} ${styles.districtField}`}>
        <span className="label">{texts?.fields?.district ?? 'District'}</span>
        <input
          id={getFieldId('district')}
          className="input"
          type="text"
          autoComplete="address-level2"
          value={value.district}
          onChange={handleFieldChange('district')}
          disabled={disabled}
          aria-invalid={Boolean(errors?.district)}
          aria-describedby={getDescribedBy('district')}
        />
        {errors?.district && (
          <span className="type-caption" id={getErrorId('district')}>
            {errors.district}
          </span>
        )}
      </label>

      <label className={`${styles.field} ${styles.floorField}`}>
        <span className="label">{texts?.fields?.floor ?? 'Floor'}</span>
        <input
          id={getFieldId('floor')}
          className="input"
          type="text"
          autoComplete="off"
          value={value.floor || ''}
          onChange={handleFieldChange('floor')}
          disabled={disabled}
          aria-invalid={Boolean(errors?.floor)}
          aria-describedby={getDescribedBy('floor')}
        />
        {errors?.floor && (
          <span className="type-caption" id={getErrorId('floor')}>
            {errors.floor}
          </span>
        )}
      </label>
    </section>
  );
}
