import type {
  SelectableProfileAddressOption,
  UserAddress,
  UserSavedAddress,
} from '../../../../../../types/profile';
import {
  createEmptyUserAddress as createEmptyAddress,
  getSelectableProfileAddresses,
  isCompleteAddress,
  isSameUserAddress,
} from '../../../../../../types/profile';
import type { CleaningWorkAddressSelection } from '../cleaningRequest.types';

export type NormalizedAddressOption = SelectableProfileAddressOption;

export const createEmptyUserAddress = createEmptyAddress;

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

export const isAddressComplete = isCompleteAddress;

export const isSameAddress = isSameUserAddress;

export const isSameWorkAddressSelection = (
  left: CleaningWorkAddressSelection | null,
  right: CleaningWorkAddressSelection | null
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
): NormalizedAddressOption[] => getSelectableProfileAddresses(primaryAddress, savedAddresses);
