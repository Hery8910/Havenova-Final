import type { UserAddress } from '../../../../../../types';

export type AddressErrors = Partial<Record<keyof UserAddress, string>>;

export interface ProfileSavedAddressFormValue {
  label: string;
  address: UserAddress;
}

export interface ProfileDetailsTexts {
  eyebrow?: string;
  title?: string;
  description?: string;
  editButton?: string;
  cancelButton?: string;
  saveButton?: string;
  selectAddressButton?: string;
  tableAriaLabel?: string;
  formAriaLabel?: string;
  emptyValue?: string;
  labels?: {
    name?: string;
    email?: string;
    phone?: string;
    primaryAddress?: string;
    additionalAddress?: string;
  };
  form?: {
    primaryAddressTitle?: string;
    primaryAddressAriaLabel?: string;
    secondaryAddressesTitle?: string;
    secondaryAddressAriaLabel?: string;
    addSecondaryAddressQuestion?: string;
    addSecondaryAddressButton?: string;
    removeSecondaryAddressButton?: string;
    secondaryAddressTitle?: string;
    secondaryAddressLabelField?: string;
    secondaryAddressListHint?: string;
    secondaryAddressListAriaLabel?: string;
    selectedSecondaryAddressTitle?: string;
    selectedSecondaryAddressAriaLabel?: string;
    editSecondaryAddressButton?: string;
    editSecondaryAddressAriaLabel?: string;
    addressDetailsAriaLabel?: string;
    saving?: string;
    fields?: {
      street?: string;
      streetNumber?: string;
      postalCode?: string;
      district?: string;
      floor?: string;
    };
    errors?: {
      required?: string;
    };
  };
}

export interface ProfileFormState {
  name: string;
  phone: string;
  primaryAddress: UserAddress;
  savedAddresses: ProfileSavedAddressFormValue[];
}

export interface ProfileSummaryRow {
  key: string;
  label: string;
  value: string;
  isMuted?: boolean;
  address?: UserAddress;
}
