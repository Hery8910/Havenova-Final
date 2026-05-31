import type { UserAddress, UserSavedAddress } from '../../../../../../../types';
import type { AddressErrors, ProfileFormState, ProfileSavedAddressFormValue } from '../types';
import { isAddressComplete } from './profileDetails.helpers';

export const createEmptyAddress = (): UserAddress => ({
  street: '',
  streetNumber: '',
  postalCode: '',
  district: '',
  floor: '',
});

export const createEmptySavedAddress = (): ProfileSavedAddressFormValue => ({
  label: '',
  address: createEmptyAddress(),
});

export const isSavedAddressEmpty = (savedAddress: ProfileSavedAddressFormValue): boolean => {
  const normalizedAddress = normalizeAddress(savedAddress.address);

  return !savedAddress.label.trim() && Object.values(normalizedAddress).every((value) => !value);
};

export const toFormAddress = (address?: UserAddress): UserAddress => ({
  street: address?.street ?? '',
  streetNumber: address?.streetNumber ?? '',
  postalCode: address?.postalCode ?? '',
  district: address?.district ?? '',
  floor: address?.floor ?? '',
});

export const normalizeAddress = (address: UserAddress): UserAddress => ({
  street: address.street.trim(),
  streetNumber: address.streetNumber.trim(),
  postalCode: address.postalCode.trim(),
  district: address.district.trim(),
  floor: address.floor?.trim() || '',
});

export const buildFormState = (profile?: {
  name?: string;
  phone?: string;
  primaryAddress?: UserAddress;
  savedAddresses?: UserSavedAddress[];
} | null): ProfileFormState => ({
  name: profile?.name ?? '',
  phone: profile?.phone ?? '',
  primaryAddress: toFormAddress(profile?.primaryAddress),
  savedAddresses: (profile?.savedAddresses ?? []).map((entry) => ({
    label: entry.label ?? '',
    address: toFormAddress(entry.address),
  })),
});

export const toSavedAddressPayload = (
  savedAddresses: ProfileSavedAddressFormValue[]
): UserSavedAddress[] =>
  savedAddresses.filter((entry) => isAddressComplete(entry.address)).map((entry) => ({
    label: entry.label.trim() || undefined,
    address: normalizeAddress(entry.address),
  }));

export const validateAddress = (address: UserAddress, requiredMessage: string): AddressErrors => {
  const normalized = normalizeAddress(address);

  return {
    street: normalized.street ? '' : requiredMessage,
    streetNumber: normalized.streetNumber ? '' : requiredMessage,
    postalCode: normalized.postalCode ? '' : requiredMessage,
    district: normalized.district ? '' : requiredMessage,
  };
};
