import AddressFormFields from '../../../../../shared/addressFormFields/AddressFormFields';
import type { UserAddress } from '../../../../../../../types';
import type { AddressErrors, ProfileDetailsTexts, ProfileFormState } from '../types';
import styles from './UserProfileDetailsForm.module.css';

export interface UserProfileDetailsFormProps {
  mode: 'full' | 'secondary-only';
  formState: ProfileFormState;
  nameError: string;
  phoneError: string;
  primaryAddressErrors: AddressErrors;
  savedAddressErrors: AddressErrors[];
  saving: boolean;
  texts?: ProfileDetailsTexts;
  formButtonLabel: string;
  isSecondaryOnlyExpanded?: boolean;
  showSecondaryOnlyPrompt?: boolean;
  onFieldChange: <K extends keyof ProfileFormState>(field: K, value: ProfileFormState[K]) => void;
  onPrimaryAddressChange: (value: UserAddress) => void;
  onSavedAddressChange: (index: number, value: UserAddress) => void;
  onSavedAddressLabelChange: (index: number, value: string) => void;
  onAddSecondaryAddress: () => void;
  onRemoveSecondaryAddress: (index: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onAddressClick?: (address: UserAddress) => void;
}

const isAddressComplete = (address: UserAddress) =>
  Boolean(
    address.street.trim() &&
    address.streetNumber.trim() &&
    address.postalCode.trim() &&
    address.district.trim()
  );

export function UserProfileDetailsForm({
  mode,
  formState,
  nameError,
  phoneError,
  primaryAddressErrors,
  savedAddressErrors,
  saving,
  texts,
  formButtonLabel,
  isSecondaryOnlyExpanded = true,
  showSecondaryOnlyPrompt = false,
  onFieldChange,
  onPrimaryAddressChange,
  onSavedAddressChange,
  onSavedAddressLabelChange,
  onAddSecondaryAddress,
  onRemoveSecondaryAddress,
  onSubmit,
  onCancel,
  onAddressClick,
}: UserProfileDetailsFormProps) {
  const isSecondaryOnly = mode === 'secondary-only';
  const hasPrimaryAddress = isAddressComplete(formState.primaryAddress);
  const showSecondaryPrompt =
    hasPrimaryAddress && (isSecondaryOnly ? showSecondaryOnlyPrompt : true);
  const showFormActions = !isSecondaryOnly || isSecondaryOnlyExpanded;
  const selectAddressButton = texts?.selectAddressButton ?? 'Select address';
  const secondaryAddressNameLabel = texts?.form?.secondaryAddressLabelField ?? 'Address name';

  return (
    <section className={styles.card} aria-labelledby="profile-details-form-title">
      <h3 id="profile-details-form-title" className={`${styles.title} type-title-sm`}>
        {'Edit profile details'}
      </h3>
      <form
        className={styles.form}
        onSubmit={onSubmit}
        noValidate
        aria-label={texts?.formAriaLabel ?? 'Edit profile details'}
      >
        {!isSecondaryOnly && (
          <>
            <label className={styles.field} htmlFor="profile-name">
              <span className="label">{texts?.labels?.name ?? 'Name'}</span>
              <input
                id="profile-name"
                className="input"
                type="text"
                name="name"
                autoComplete="name"
                value={formState.name}
                onChange={(event) => onFieldChange('name', event.target.value)}
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? 'profile-name-error' : undefined}
              />
              {nameError && (
                <p id="profile-name-error" className="type-caption " role="alert">
                  {nameError}
                </p>
              )}
            </label>

            <label className={styles.field} htmlFor="profile-phone">
              <span className="label">{texts?.labels?.phone ?? 'Phone'}</span>
              <input
                id="profile-phone"
                className="input"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={formState.phone}
                onChange={(event) => onFieldChange('phone', event.target.value)}
                aria-invalid={Boolean(phoneError)}
                aria-describedby={phoneError ? 'profile-phone-error' : undefined}
              />
              {phoneError && (
                <p id="profile-phone-error" className="type-caption " role="alert">
                  {phoneError}
                </p>
              )}
            </label>

            <section
              className={styles.addressSection}
              aria-labelledby="profile-primary-address-title"
            >
              <div className={styles.addressCard}>
                <div className={styles.addressCardHeader}>
                  <h4 className={styles.secondaryAddressTitle}>
                    {texts?.labels?.primaryAddress ?? 'Primary address'}
                  </h4>
                  {onAddressClick && isAddressComplete(formState.primaryAddress) && (
                    <button
                      type="button"
                      className="button button--outline"
                      onClick={() => onAddressClick(formState.primaryAddress)}
                    >
                      {selectAddressButton}
                    </button>
                  )}
                </div>

                <AddressFormFields
                  value={formState.primaryAddress}
                  onChange={onPrimaryAddressChange}
                  errors={primaryAddressErrors}
                  texts={{
                    addressDetailsAriaLabel:
                      texts?.form?.addressDetailsAriaLabel ?? 'Address details',
                    fields: texts?.form?.fields,
                  }}
                />
              </div>
            </section>
          </>
        )}

        {hasPrimaryAddress ? (
          <section
            className={styles.addressSection}
            aria-labelledby="profile-secondary-addresses-title"
          >
            {formState.savedAddresses.length > 0 && showFormActions && (
              <div className={styles.secondaryAddressList}>
                {formState.savedAddresses.map((address, index) => (
                  <div key={`saved-address-${index}`} className={styles.addressCard}>
                    <div className={styles.addressCardHeader}>
                      <h4 className={styles.secondaryAddressTitle}>
                        {address.label.trim() ||
                          `${texts?.form?.secondaryAddressTitle ?? 'Address'} ${index + 1}`}
                      </h4>

                      <div className={styles.cardActions}>
                        {onAddressClick && (
                          <button
                            type="button"
                            className="button button--outline"
                            onClick={() => onAddressClick(address.address)}
                          >
                            {selectAddressButton}
                          </button>
                        )}
                        <button
                          type="button"
                          className="button button--outline"
                          onClick={() => onRemoveSecondaryAddress(index)}
                          aria-label={`${texts?.form?.removeSecondaryAddressButton ?? 'Remove additional address'} ${index + 1}`}
                        >
                          {texts?.form?.removeSecondaryAddressButton ?? 'Remove'}
                        </button>
                      </div>
                    </div>

                    <label className={styles.field} htmlFor={`saved-address-label-${index}`}>
                      <span className="label">{secondaryAddressNameLabel}</span>
                      <input
                        id={`saved-address-label-${index}`}
                        className="input"
                        type="text"
                        value={address.label}
                        onChange={(event) => onSavedAddressLabelChange(index, event.target.value)}
                        autoComplete="off"
                      />
                    </label>

                    <AddressFormFields
                      value={address.address}
                      onChange={(value) => onSavedAddressChange(index, value)}
                      errors={savedAddressErrors[index]}
                      texts={{
                        addressDetailsAriaLabel:
                          texts?.form?.secondaryAddressAriaLabel ?? 'Secondary address details',
                        fields: texts?.form?.fields,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {showFormActions && (
          <div className={styles.formActions}>
            <button
              type="button"
              className="button button--outline"
              onClick={onCancel}
              disabled={saving}
              aria-label={texts?.cancelButton ?? 'Cancel editing'}
            >
              {texts?.cancelButton ?? 'Cancel'}
            </button>
            <button
              type="submit"
              className="button button--primary"
              disabled={saving}
              aria-busy={saving}
              aria-label={formButtonLabel}
            >
              {saving ? (texts?.form?.saving ?? 'Saving...') : formButtonLabel}
            </button>
          </div>
        )}
        {showSecondaryPrompt && (
          <div className={`${styles.secondaryPrompt} card card--primary`}>
            <div className={styles.secondaryPromptBody}>
              <h3 id="profile-secondary-addresses-title" className={styles.addressTitle}>
                {texts?.form?.secondaryAddressesTitle ?? 'Secondary addresses'}
              </h3>
              <p className={styles.secondaryPromptText}>
                {texts?.form?.addSecondaryAddressQuestion ?? 'Do you want to add another address?'}
              </p>
            </div>
            <button
              type="button"
              className="button button--primary"
              onClick={onAddSecondaryAddress}
              aria-label={texts?.form?.addSecondaryAddressButton ?? 'Add another address'}
            >
              {texts?.form?.addSecondaryAddressButton ?? 'Add address'}
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
