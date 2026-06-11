import type {
  SelectableProfileAddressOption,
  UserClientProfile,
} from '../../../../../types';
import {
  getSelectableProfileAddresses as buildSelectableProfileAddresses,
  isCompleteAddress as isAddressComplete,
} from '../../../../../types';

export type RequiredProfileField = 'name' | 'phone' | 'primaryAddress';

const isNonEmpty = (value?: string) => Boolean(value?.trim());

export const isCompleteAddress = isAddressComplete;

const PROFILE_COMPLETION_CHECKS: Array<{
  field: RequiredProfileField;
  check: (profile: UserClientProfile) => boolean;
}> = [
  { field: 'name', check: (profile) => isNonEmpty(profile.name) },
  { field: 'phone', check: (profile) => isNonEmpty(profile.phone) },
  { field: 'primaryAddress', check: (profile) => isCompleteAddress(profile.primaryAddress) },
];

export const getProfileCompletionPercentage = (profile: UserClientProfile) => {
  const completedFields = PROFILE_COMPLETION_CHECKS.reduce(
    (total, entry) => total + Number(entry.check(profile)),
    0
  );

  return Math.round((completedFields / PROFILE_COMPLETION_CHECKS.length) * 100);
};

export const getProfileCompletionState = (percentage: number) => {
  if (percentage >= 67) return 'high';
  if (percentage >= 34) return 'medium';
  return 'low';
};

export const getMissingProfileFields = (
  profile?: UserClientProfile | null
): RequiredProfileField[] => {
  if (!profile) {
    return PROFILE_COMPLETION_CHECKS.map((entry) => entry.field);
  }

  return PROFILE_COMPLETION_CHECKS.filter((entry) => !entry.check(profile)).map(
    (entry) => entry.field
  );
};

export const hasPrimaryAddress = (profile?: UserClientProfile | null) =>
  isCompleteAddress(profile?.primaryAddress);

export const getSelectableProfileAddresses = (
  profile?: UserClientProfile | null
): SelectableProfileAddressOption[] =>
  buildSelectableProfileAddresses(profile?.primaryAddress, profile?.savedAddresses ?? []);

export const isProfileComplete = (profile?: UserClientProfile | null) =>
  getMissingProfileFields(profile).length === 0;
