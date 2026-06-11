import { isCompleteAddress, type UserAddress } from '../../../../../../../types';
import type { AddressErrors, ProfileDetailsTexts, ProfileFormState } from '../types';
import styles from './UserProfileDetailsForm.module.css';
import { MdDeleteOutline } from 'react-icons/md';
import { ProfileBaseDetailsFields } from './ProfileBaseDetailsFields';
import { SecondaryAddressEditor } from './SecondaryAddressEditor';

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
  selectedSavedAddressIndex?: number | null;
  isSecondaryOnlyExpanded?: boolean;
  showSecondaryOnlyPrompt?: boolean;
  onFieldChange: <K extends keyof ProfileFormState>(field: K, value: ProfileFormState[K]) => void;
  onPrimaryAddressChange: (value: UserAddress) => void;
  onSavedAddressChange: (index: number, value: UserAddress) => void;
  onSavedAddressLabelChange: (index: number, value: string) => void;
  onSelectSavedAddress?: (index: number | null) => void;
  onAddSecondaryAddress: () => void;
  onRemoveSecondaryAddress: (index: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onAddressClick?: (address: UserAddress) => void;
}

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
  selectedSavedAddressIndex = null,
  isSecondaryOnlyExpanded = true,
  showSecondaryOnlyPrompt = false,
  onFieldChange,
  onPrimaryAddressChange,
  onSavedAddressChange,
  onSavedAddressLabelChange,
  onSelectSavedAddress,
  onAddSecondaryAddress,
  onRemoveSecondaryAddress,
  onSubmit,
  onCancel,
  onAddressClick,
}: UserProfileDetailsFormProps) {
  const isSecondaryOnly = mode === 'secondary-only';
  const hasPrimaryAddress = isCompleteAddress(formState.primaryAddress);
  const showSecondaryPrompt =
    hasPrimaryAddress && (isSecondaryOnly ? showSecondaryOnlyPrompt : true);
  const showFormActions = !isSecondaryOnly || isSecondaryOnlyExpanded;
  const selectAddressButton = texts?.selectAddressButton ?? 'Select address';
  const editSecondaryAddressButton =
    texts?.form?.editSecondaryAddressButton ?? texts?.editButton ?? 'Edit';
  const editSecondaryAddressAriaLabel =
    texts?.form?.editSecondaryAddressAriaLabel ?? 'Edit additional address';
  const selectedSavedAddress =
    selectedSavedAddressIndex !== null ? formState.savedAddresses[selectedSavedAddressIndex] : null;

  return (
    <section className={styles.card} aria-labelledby="profile-details-form-title">
      <h3 id="profile-details-form-title" className={`type-title-sm ${styles.title}`}>
        {'Edit profile details'}
      </h3>
      <form
        className={styles.form}
        onSubmit={onSubmit}
        noValidate
        aria-label={texts?.formAriaLabel ?? 'Edit profile details'}
      >
        {!isSecondaryOnly && (
          <ProfileBaseDetailsFields
            formState={formState}
            nameError={nameError}
            phoneError={phoneError}
            primaryAddressErrors={primaryAddressErrors}
            texts={texts}
            onFieldChange={onFieldChange}
            onPrimaryAddressChange={onPrimaryAddressChange}
            onAddressClick={onAddressClick}
          />
        )}

        {hasPrimaryAddress ? (
          <section
            className={styles.addressSection}
            aria-labelledby="profile-secondary-addresses-title"
          >
            {formState.savedAddresses.length > 0 && showFormActions && (
              <>
                <div className={styles.secondaryAddressList}>
                  <div className={styles.secondaryAddressHeader}>
                    <h4 id="profile-secondary-addresses-title" className={`type-title-sm ${styles.addressTitle}`}>
                      {texts?.form?.secondaryAddressesTitle ?? 'Secondary addresses'}
                    </h4>
                    <p className={styles.secondaryAddressHint}>
                      {texts?.form?.secondaryAddressListHint ??
                        'Select an address to review or update it.'}
                    </p>
                  </div>

                  <ul
                    className={styles.secondaryAddressOptions}
                    aria-label={
                      texts?.form?.secondaryAddressListAriaLabel ?? 'Saved secondary addresses'
                    }
                  >
                    {formState.savedAddresses.map((address, index) => {
                      const isSelected = index === selectedSavedAddressIndex;
                      const label =
                        address.label.trim() ||
                        `${texts?.form?.secondaryAddressTitle ?? 'Address'} ${index + 1}`;

                      return (
                        <li
                          key={`saved-address-${index}`}
                          className={`${styles.secondaryAddressOption} ${isSelected ? styles.secondaryAddressOptionSelected : ''}`}
                        >
                          <div className={styles.secondaryAddressOptionBody}>
                            <span className={styles.secondaryAddressOptionLabel}>{label}</span>
                            <span className={styles.secondaryAddressOptionMeta}>
                              {address.address.street.trim() || address.address.postalCode.trim()
                                ? [
                                    address.address.street,
                                    address.address.streetNumber,
                                    address.address.postalCode,
                                    address.address.district,
                                  ]
                                    .map((part) => part.trim())
                                    .filter(Boolean)
                                    .join(', ')
                                : texts?.emptyValue ?? 'Not provided'}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="button button--outline"
                            onClick={() => onSelectSavedAddress?.(index)}
                            aria-pressed={isSelected}
                            aria-label={`${editSecondaryAddressAriaLabel} ${index + 1}`}
                          >
                            {editSecondaryAddressButton}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {selectedSavedAddress && selectedSavedAddressIndex !== null ? (
                  <section
                    className={styles.addressCard}
                    aria-label={
                      texts?.form?.selectedSecondaryAddressAriaLabel ??
                      'Selected secondary address editor'
                    }
                  >
                    <div className={styles.addressCardHeader}>
                      <h4 className={`type-title-sm ${styles.addressTitle}`}>
                        {texts?.form?.selectedSecondaryAddressTitle ?? 'Edit selected address'}
                      </h4>

                      <div className={styles.cardActions}>
                        {onAddressClick && (
                          <button
                            type="button"
                            className="button button--outline"
                            onClick={() => onAddressClick(selectedSavedAddress.address)}
                          >
                            {selectAddressButton}
                          </button>
                        )}
                        <button
                          type="button"
                          className="button button--outline-danger button--outline-danger-small"
                          onClick={() => onRemoveSecondaryAddress(selectedSavedAddressIndex)}
                          aria-label={`${texts?.form?.removeSecondaryAddressButton ?? 'Remove additional address'} ${selectedSavedAddressIndex + 1}`}
                        >
                          <MdDeleteOutline />
                          {texts?.form?.removeSecondaryAddressButton ?? 'Remove'}
                        </button>
                      </div>
                    </div>

                    <SecondaryAddressEditor
                      address={selectedSavedAddress.address}
                      addressErrors={savedAddressErrors[selectedSavedAddressIndex]}
                      label={selectedSavedAddress.label}
                      texts={{
                        label: texts?.form?.secondaryAddressLabelField ?? 'Address name',
                      }}
                      sharedTexts={texts}
                      onLabelChange={(value) =>
                        onSavedAddressLabelChange(selectedSavedAddressIndex, value)
                      }
                      onAddressChange={(value) => onSavedAddressChange(selectedSavedAddressIndex, value)}
                    />
                  </section>
                ) : null}
              </>
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
              <h3
                id="profile-secondary-addresses-title"
                className={`type-title-sm ${styles.addressTitle}`}
              >
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
