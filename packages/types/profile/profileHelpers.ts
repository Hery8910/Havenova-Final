import type { UserAddress, UserSavedAddress } from './profileTypes';

export type SelectableProfileAddressSource = 'primary' | 'saved';

export interface SelectableProfileAddressOption {
  id: string;
  source: SelectableProfileAddressSource;
  address: UserAddress;
  savedLabel?: string;
  isPrimary: boolean;
}

export const createEmptyUserAddress = (): UserAddress => ({
  street: '',
  streetNumber: '',
  postalCode: '',
  district: '',
  floor: '',
});

export const trimUserAddress = (address?: UserAddress): UserAddress => ({
  street: address?.street?.trim() ?? '',
  streetNumber: address?.streetNumber?.trim() ?? '',
  postalCode: address?.postalCode?.trim() ?? '',
  district: address?.district?.trim() ?? '',
  floor: address?.floor?.trim() ?? '',
});

export const isCompleteAddress = (address?: UserAddress) => {
  const normalized = trimUserAddress(address);

  return Boolean(
    normalized.street &&
      normalized.streetNumber &&
      normalized.postalCode &&
      normalized.district
  );
};

export const isSameUserAddress = (left?: UserAddress, right?: UserAddress) => {
  if (!left || !right) return false;

  const normalizedLeft = trimUserAddress(left);
  const normalizedRight = trimUserAddress(right);

  return (
    normalizedLeft.street === normalizedRight.street &&
    normalizedLeft.streetNumber === normalizedRight.streetNumber &&
    normalizedLeft.postalCode === normalizedRight.postalCode &&
    normalizedLeft.district === normalizedRight.district &&
    normalizedLeft.floor === normalizedRight.floor
  );
};

export const getSelectableProfileAddresses = (
  primaryAddress?: UserAddress,
  savedAddresses: UserSavedAddress[] = []
): SelectableProfileAddressOption[] => {
  const options: SelectableProfileAddressOption[] = [];

  if (primaryAddress) {
    options.push({
      id: 'primary',
      source: 'primary',
      address: primaryAddress,
      isPrimary: true,
    });
  }

  savedAddresses.forEach((savedAddress, index) => {
    options.push({
      id: `saved-${index}`,
      source: 'saved',
      address: savedAddress.address,
      savedLabel: savedAddress.label?.trim() || undefined,
      isPrimary: false,
    });
  });

  return options;
};
