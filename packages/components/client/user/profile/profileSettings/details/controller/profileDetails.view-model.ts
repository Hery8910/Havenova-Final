import type { AuthUser, UserClientProfile } from '../../../../../../../types';
import { formatNumericDate } from '../../../../../../../utils/date/dateUtils';
import { isProfileComplete } from '../../../profileCompletionBadge/profileCompletion.helpers';
import { buildProfileSummaryRows } from '../helpers/profileDetails.helpers';
import type { ProfileDetailsTexts, ProfileSummaryRow } from '../types';

interface BuildProfileDetailsViewModelArgs {
  profile?: UserClientProfile | null;
  auth?: AuthUser | null;
  texts?: {
    pages?: {
      client?: {
        user?: {
          profile?: {
            nameEmpty?: string;
            manageAccount?: string;
            verified?: string;
            memberSince?: string;
          };
        };
      };
    };
  };
  detailTexts?: ProfileDetailsTexts;
}

export function buildProfileDetailsViewModel({
  profile,
  auth,
  texts,
  detailTexts,
}: BuildProfileDetailsViewModelArgs) {
  const secondaryAddressLabel = detailTexts?.labels?.additionalAddress ?? 'Additional address';
  const emptyValue = detailTexts?.emptyValue ?? 'Not provided';
  const profileCompleted = isProfileComplete(profile);
  const showSummary = profileCompleted;
  const showFullForm = !profileCompleted;

  const summaryRows: ProfileSummaryRow[] = buildProfileSummaryRows({
    profile,
    email: profile?.contactEmail,
    emptyValue,
    labels: detailTexts?.labels,
    secondaryAddressLabel,
  });

  return {
    profileCompleted,
    showSummary,
    showFullForm,
    summaryRows,
    identityProps: profile
      ? {
          profile,
          name: profile?.name || texts?.pages?.client?.user?.profile?.nameEmpty || 'Missing name',
          avatarAlt: profile?.name
            ? `${profile.name} avatar`
            : (texts?.pages?.client?.user?.profile?.manageAccount ?? 'User avatar'),
          isVerified: Boolean(auth?.isVerified),
          verifiedLabel: texts?.pages?.client?.user?.profile?.verified ?? 'Verified',
          verifiedAriaLabel: texts?.pages?.client?.user?.profile?.verified ?? 'Verified',
          memberSinceLabel: texts?.pages?.client?.user?.profile?.memberSince ?? 'Member since',
          memberSinceDate: profile?.createdAt ? formatNumericDate(profile.createdAt) : '',
          showCompletionInfo: !profileCompleted,
          completionInfo:
            'Complete the missing details to improve your booking and communication flow.',
        }
      : null,
  };
}
