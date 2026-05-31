import type { UserAddress, UserClientProfile } from '../../../../../types';

const isNonEmpty = (value?: string) => Boolean(value?.trim());

export const isCompleteAddress = (address?: UserAddress) =>
  Boolean(
    address?.street?.trim() &&
      address?.streetNumber?.trim() &&
      address?.postalCode?.trim() &&
      address?.district?.trim()
  );

const PROFILE_COMPLETION_CHECKS = [
  (profile: UserClientProfile) => isNonEmpty(profile.name),
  (profile: UserClientProfile) => isNonEmpty(profile.phone),
  (profile: UserClientProfile) => isCompleteAddress(profile.primaryAddress),
];

export const getProfileCompletionPercentage = (profile: UserClientProfile) => {
  const completedFields = PROFILE_COMPLETION_CHECKS.reduce(
    (total, check) => total + Number(check(profile)),
    0
  );

  return Math.round((completedFields / PROFILE_COMPLETION_CHECKS.length) * 100);
};

export const getProfileCompletionState = (percentage: number) => {
  if (percentage >= 67) return 'high';
  if (percentage >= 34) return 'medium';
  return 'low';
};

export const isProfileComplete = (profile?: UserClientProfile | null) =>
  Boolean(profile && getProfileCompletionPercentage(profile) === 100);
