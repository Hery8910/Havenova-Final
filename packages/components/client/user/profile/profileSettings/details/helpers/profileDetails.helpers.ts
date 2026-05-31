import { formatUserAddress } from '../../../../../../../types';
import type { UserClientProfile } from '../../../../../../../types';
import { isCompleteAddress } from '../../../profileCompletionBadge/profileCompletion.helpers';
import type { ProfileSummaryRow } from '../types';

interface BuildProfileSummaryRowsOptions {
  profile?: UserClientProfile | null;
  email?: string | null;
  emptyValue: string;
  labels?: {
    name?: string;
    email?: string;
    phone?: string;
    primaryAddress?: string;
    additionalAddress?: string;
  };
  secondaryAddressLabel: string;
}

export const isAddressComplete = isCompleteAddress;

export function buildProfileSummaryRows({
  profile,
  email,
  emptyValue,
  labels,
  secondaryAddressLabel,
}: BuildProfileSummaryRowsOptions): ProfileSummaryRow[] {
  return [
    {
      key: 'name',
      label: labels?.name ?? 'Name',
      value: profile?.name?.trim() || emptyValue,
      isMuted: !profile?.name?.trim(),
    },
    {
      key: 'email',
      label: labels?.email ?? 'Email',
      value: email?.trim() || emptyValue,
      isMuted: !email?.trim(),
    },
    {
      key: 'phone',
      label: labels?.phone ?? 'Phone',
      value: profile?.phone?.trim() || emptyValue,
      isMuted: !profile?.phone?.trim(),
    },
    {
      key: 'primary-address',
      label: labels?.primaryAddress ?? 'Primary address',
      value: profile?.primaryAddress ? formatUserAddress(profile.primaryAddress) : emptyValue,
      isMuted: !profile?.primaryAddress,
      address: profile?.primaryAddress,
    },
    ...(profile?.savedAddresses ?? []).map((entry, index) => ({
      key: `saved-address-${index}`,
      label: entry.label?.trim() || `${secondaryAddressLabel} ${index + 1}`,
      value: formatUserAddress(entry.address) || emptyValue,
      isMuted: !formatUserAddress(entry.address),
      address: entry.address,
    })),
  ];
}
