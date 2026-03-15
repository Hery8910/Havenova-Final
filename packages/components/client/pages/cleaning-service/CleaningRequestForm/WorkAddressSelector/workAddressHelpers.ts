import type { UserAddress, UserSavedAddress } from '../../../../../../types/profile';
import type { WorkAddressSelection, WorkAddressSource } from '../../../../../../types/services';

export interface NormalizedAddressOption {
  id: string;
  source: Exclude<WorkAddressSource, 'new'>;
  label: string;
  hint: string;
  address: UserAddress;
  savedLabel?: string;
}

export const createEmptyUserAddress = (): UserAddress => ({
  street: '',
  streetNumber: '',
  postalCode: '',
  district: '',
  floor: '',
});

export const normalizeAddress = (address: UserAddress): UserAddress => ({
  street: address.street.trim(),
  streetNumber: address.streetNumber.trim(),
  postalCode: address.postalCode.trim(),
  district: address.district.trim(),
  floor: address.floor?.trim() || undefined,
});

export const formatAddressLabel = (address: UserAddress): string =>
  [address.street, address.streetNumber, address.postalCode, address.district]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ');

export const isAddressComplete = (address: UserAddress): boolean => {
  const normalized = normalizeAddress(address);

  return Boolean(
    normalized.street &&
      normalized.streetNumber &&
      normalized.postalCode &&
      normalized.district
  );
};

export const isSameAddress = (left?: UserAddress, right?: UserAddress): boolean => {
  if (!left || !right) return false;

  const normalizedLeft = normalizeAddress(left);
  const normalizedRight = normalizeAddress(right);

  return (
    normalizedLeft.street === normalizedRight.street &&
    normalizedLeft.streetNumber === normalizedRight.streetNumber &&
    normalizedLeft.postalCode === normalizedRight.postalCode &&
    normalizedLeft.district === normalizedRight.district &&
    (normalizedLeft.floor || '') === (normalizedRight.floor || '')
  );
};

export const isSameWorkAddressSelection = (
  left: WorkAddressSelection | null,
  right: WorkAddressSelection | null
): boolean => {
  if (!left && !right) return true;
  if (!left || !right) return false;

  return (
    left.source === right.source &&
    left.saveToProfile === right.saveToProfile &&
    (left.label || '') === (right.label || '') &&
    isSameAddress(left.address, right.address)
  );
};

export const buildAddressOptions = (
  primaryAddress?: UserAddress,
  savedAddresses: UserSavedAddress[] = []
): NormalizedAddressOption[] => {
  const options: NormalizedAddressOption[] = [];

  if (primaryAddress) {
    options.push({
      id: 'primary',
      source: 'primary',
      label: formatAddressLabel(primaryAddress),
      hint: 'Main profile address',
      address: primaryAddress,
    });
  }

  savedAddresses.forEach((savedAddress, index) => {
    options.push({
      id: `saved-${index}`,
      source: 'saved',
      label: savedAddress.label?.trim() || formatAddressLabel(savedAddress.address),
      hint: savedAddress.label?.trim() ? formatAddressLabel(savedAddress.address) : 'Saved address',
      address: savedAddress.address,
      savedLabel: savedAddress.label?.trim() || undefined,
    });
  });

  return options;
};
