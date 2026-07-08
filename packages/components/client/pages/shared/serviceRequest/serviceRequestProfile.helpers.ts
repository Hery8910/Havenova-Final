import type { UserSavedAddress } from '../../../../../types';
import type { ServiceRequestWorkAddressSelection } from './serviceRequestUi.types';

const isSameSavedAddress = (left: UserSavedAddress, right: UserSavedAddress): boolean =>
  left.label === right.label &&
  left.address.street === right.address.street &&
  left.address.streetNumber === right.address.streetNumber &&
  left.address.postalCode === right.address.postalCode &&
  left.address.district === right.address.district &&
  (left.address.floor || '') === (right.address.floor || '');

export const mergeSavedAddressFromRequest = (
  currentSavedAddresses: UserSavedAddress[],
  workAddress: ServiceRequestWorkAddressSelection
): UserSavedAddress[] => {
  if (workAddress.source !== 'new' || !workAddress.saveToProfile) {
    return currentSavedAddresses;
  }

  const nextSavedAddress: UserSavedAddress = {
    label: workAddress.label?.trim() || undefined,
    address: workAddress.address,
  };

  const hasSameAddress = currentSavedAddresses.some((savedAddress) =>
    isSameSavedAddress(savedAddress, nextSavedAddress)
  );

  return hasSameAddress ? currentSavedAddresses : [...currentSavedAddresses, nextSavedAddress];
};
