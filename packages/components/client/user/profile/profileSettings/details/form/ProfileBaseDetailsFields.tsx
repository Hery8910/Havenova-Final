import { useId } from 'react';
import AddressFormFields from '../../../../../shared/addressFormFields/AddressFormFields';
import { isCompleteAddress, type UserAddress } from '../../../../../../../types';
import type { AddressErrors, ProfileDetailsTexts, ProfileFormState } from '../types';
import styles from './UserProfileDetailsForm.module.css';

interface ProfileBaseDetailsFieldsProps {
  formState: ProfileFormState;
  nameError: string;
  phoneError: string;
  primaryAddressErrors: AddressErrors;
  texts?: ProfileDetailsTexts;
  onFieldChange: <K extends keyof ProfileFormState>(field: K, value: ProfileFormState[K]) => void;
  onPrimaryAddressChange: (value: UserAddress) => void;
  onAddressClick?: (address: UserAddress) => void;
}

export function ProfileBaseDetailsFields({
  formState,
  nameError,
  phoneError,
  primaryAddressErrors,
  texts,
  onFieldChange,
  onPrimaryAddressChange,
  onAddressClick,
}: ProfileBaseDetailsFieldsProps) {
  const nameInputId = useId();
  const nameErrorId = useId();
  const phoneInputId = useId();
  const phoneErrorId = useId();
  const primaryAddressTitleId = useId();
  const selectAddressButton = texts?.selectAddressButton ?? 'Select address';

  return (
    <>
      <label className={styles.field} htmlFor={nameInputId}>
        <span className="label">{texts?.labels?.name ?? 'Name'}</span>
        <input
          id={nameInputId}
          className="input"
          type="text"
          name="name"
          autoComplete="name"
          value={formState.name}
          onChange={(event) => onFieldChange('name', event.target.value)}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? nameErrorId : undefined}
        />
        {nameError && (
          <p id={nameErrorId} className="type-caption " role="alert">
            {nameError}
          </p>
        )}
      </label>

      <label className={styles.field} htmlFor={phoneInputId}>
        <span className="label">{texts?.labels?.phone ?? 'Phone'}</span>
        <input
          id={phoneInputId}
          className="input"
          type="tel"
          name="phone"
          autoComplete="tel"
          value={formState.phone}
          onChange={(event) => onFieldChange('phone', event.target.value)}
          aria-invalid={Boolean(phoneError)}
          aria-describedby={phoneError ? phoneErrorId : undefined}
        />
        {phoneError && (
          <p id={phoneErrorId} className="type-caption " role="alert">
            {phoneError}
          </p>
        )}
      </label>

      <section className={styles.addressSection} aria-labelledby={primaryAddressTitleId}>
        <div className={styles.addressCard}>
          <header className={styles.addressCardHeader}>
            <h4 id={primaryAddressTitleId} className={`type-title-sm ${styles.addressTitle}`}>
              {texts?.labels?.primaryAddress ?? 'Primary address'}
            </h4>
            {onAddressClick && isCompleteAddress(formState.primaryAddress) && (
              <button
                type="button"
                className="button button--outline"
                onClick={() => onAddressClick(formState.primaryAddress)}
              >
                {selectAddressButton}
              </button>
            )}
          </header>

          <AddressFormFields
            value={formState.primaryAddress}
            onChange={onPrimaryAddressChange}
            errors={primaryAddressErrors}
            texts={{
              addressDetailsAriaLabel: texts?.form?.addressDetailsAriaLabel ?? 'Address details',
              fields: texts?.form?.fields,
            }}
          />
        </div>
      </section>
    </>
  );
}
