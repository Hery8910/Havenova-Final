import type { AuthUser } from '../../../../../types';
import type { UserProfileIdentityCardProps } from '../profileSettings/details/identity';

export type ProfileOverviewIconKey = 'briefcase' | 'list' | 'bell' | 'cog';

export interface ProfileOverviewTopicItem {
  label: string;
  icon?: ProfileOverviewIconKey;
}

export interface ProfileOverviewSummaryItem {
  key: string;
  label: string;
  value: string;
  icon: ProfileOverviewIconKey;
  tone?: 'default' | 'success';
}

export interface ProfileOverviewCompletionItem {
  key: string;
  label: string;
  complete: boolean;
  completeLabel: string;
  incompleteLabel: string;
}

export interface ProfileOverviewCardBase {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}

export interface ProfileOverviewCompletionCard extends ProfileOverviewCardBase {
  percentage: number;
  caption: string;
  items: ProfileOverviewCompletionItem[];
}

export interface ProfileOverviewTopicCard extends ProfileOverviewCardBase {
  topics: ProfileOverviewTopicItem[];
  note: string;
}

export interface ProfileOverviewSummaryCard extends ProfileOverviewCardBase {
  items: ProfileOverviewSummaryItem[];
}

export interface ProfileOverviewFallbacks {
  loadingAriaLabel: string;
  profileUser: string;
  profileAvatar: string;
  verifiedLabel: string;
  verifiedAriaLabel: string;
  memberSinceLabel: string;
  notSetLabel: string;
  doneLabel: string;
  missingLabel: string;
  enabledLabel: string;
  offLabel: string;
  coreReadinessLabel: string;
  completionCtaComplete: string;
  completionCtaIncomplete: string;
  completionMessages: {
    complete: string;
    high: string;
    medium: string;
    low: string;
  };
  completionLabels: {
    name: string;
    phone: string;
    address: string;
  };
  ordersCard: ProfileOverviewTopicCard;
  requestsCard: ProfileOverviewTopicCard;
  notificationsCard: Omit<ProfileOverviewSummaryCard, 'items'> & {
    labels: {
      inApp: string;
      importantEmail: string;
      reminders: string;
      required: string;
    };
  };
  preferencesCard: Omit<ProfileOverviewSummaryCard, 'items'> & {
    labels: {
      language: string;
      theme: string;
      cookies: string;
      dark: string;
      light: string;
    };
  };
  completionCard: Omit<ProfileOverviewCompletionCard, 'percentage' | 'items' | 'ctaHref' | 'ctaLabel' | 'description'>;
}

export interface ProfileOverviewViewModel {
  loadingAriaLabel: string;
  identityCardProps: UserProfileIdentityCardProps;
  completionCard: ProfileOverviewCompletionCard;
  ordersCard: ProfileOverviewTopicCard;
  requestsCard: ProfileOverviewTopicCard;
  notificationsCard: ProfileOverviewSummaryCard;
  preferencesCard: ProfileOverviewSummaryCard;
}

export interface BuildProfileOverviewViewModelArgs {
  profile: UserProfileIdentityCardProps['profile'];
  auth: Partial<AuthUser>;
  settingsHref: string;
  ordersHref: string;
  requestsHref: string;
  notificationsHref: string;
  cookieLabel: string;
  fallbacks: ProfileOverviewFallbacks;
}
