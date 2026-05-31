import {
  validateName,
  validatePhone,
} from '../../../../../../../utils/validators/profileFormValidator';
import { validateAddress } from '../helpers/profileDetails.form.helpers';
import type { AddressErrors, ProfileDetailsTexts, ProfileFormState } from '../types';

interface ValidateProfileDetailsFormArgs {
  formState: ProfileFormState;
  formTexts?: {
    error: {
      name: {
        invalid: string;
        required: string;
      };
      phone: {
        invalid: string;
        required: string;
      };
    };
    button: {
      edit: string;
    };
  };
  detailTexts?: ProfileDetailsTexts;
}

interface ValidateProfileDetailsFormResult {
  nameError: string;
  phoneError: string;
  primaryAddressErrors: AddressErrors;
  savedAddressErrors: AddressErrors[];
  hasErrors: boolean;
}

export function validateProfileDetailsForm({
  formState,
  formTexts,
  detailTexts,
}: ValidateProfileDetailsFormArgs): ValidateProfileDetailsFormResult {
  const nextNameError = formState.name.trim()
    ? validateName(formState.name)[0]
      ? formTexts?.error.name.invalid ?? 'Invalid name'
      : ''
    : (formTexts?.error.name.required ?? 'Name is required');
  const nextPhoneError = formState.phone.trim()
    ? validatePhone(formState.phone)[0]
      ? formTexts?.error.phone.invalid ?? 'Invalid phone'
      : ''
    : (formTexts?.error.phone.required ?? 'Phone is required');
  const requiredMessage = detailTexts?.form?.errors?.required ?? 'This field is required.';
  const nextPrimaryAddressErrors = validateAddress(formState.primaryAddress, requiredMessage);
  const nextSavedAddressErrors = formState.savedAddresses.map((entry) =>
    validateAddress(entry.address, requiredMessage)
  );

  const hasAddressErrors = [
    ...Object.values(nextPrimaryAddressErrors),
    ...nextSavedAddressErrors.flatMap((entry) => Object.values(entry)),
  ].some(Boolean);

  return {
    nameError: nextNameError,
    phoneError: nextPhoneError,
    primaryAddressErrors: nextPrimaryAddressErrors,
    savedAddressErrors: nextSavedAddressErrors,
    hasErrors: Boolean(nextNameError || nextPhoneError || hasAddressErrors),
  };
}
