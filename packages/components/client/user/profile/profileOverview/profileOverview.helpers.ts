import {
  getProfileCompletionPercentage,
  getProfileCompletionState,
  isCompleteAddress,
} from '../profileCompletionBadge/profileCompletion.helpers';
import type {
  BuildProfileOverviewViewModelArgs,
  ProfileOverviewFallbacks,
  ProfileOverviewViewModel,
} from './profileOverview.types';

function getLanguageLabel(language: string | undefined, fallbacks: ProfileOverviewFallbacks) {
  const labels: Record<string, string> = {
    de: 'Deutsch',
    en: 'English',
    es: 'Español',
  };

  return labels[language ?? ''] ?? fallbacks.notSetLabel;
}

function getThemeLabel(theme: string | undefined, fallbacks: ProfileOverviewFallbacks) {
  const labels: Record<string, string> = {
    dark: fallbacks.preferencesCard.labels.dark,
    light: fallbacks.preferencesCard.labels.light,
  };

  return labels[theme ?? ''] ?? fallbacks.notSetLabel;
}

function getCompletionMessage(percentage: number, fallbacks: ProfileOverviewFallbacks) {
  const state = getProfileCompletionState(percentage);

  if (state === 'high' && percentage === 100) {
    return fallbacks.completionMessages.complete;
  }

  if (state === 'high') {
    return fallbacks.completionMessages.high;
  }

  if (state === 'medium') {
    return fallbacks.completionMessages.medium;
  }

  return fallbacks.completionMessages.low;
}

export function buildProfileOverviewViewModel({
  profile,
  auth,
  settingsHref,
  ordersHref,
  requestsHref,
  notificationsHref,
  cookieLabel,
  fallbacks,
}: BuildProfileOverviewViewModelArgs): ProfileOverviewViewModel {
  const completionPercentage = getProfileCompletionPercentage(profile);
  const reminderStatus = profile.notificationPreferences.email.reminders.enabled
    ? fallbacks.enabledLabel
    : fallbacks.offLabel;

  return {
    loadingAriaLabel: fallbacks.loadingAriaLabel,
    identityCardProps: {
      profile,
      name: profile.name?.trim() || profile.contactEmail?.trim() || fallbacks.profileUser,
      avatarAlt: profile.name?.trim() ? `${profile.name} avatar` : fallbacks.profileAvatar,
      isVerified: Boolean(auth.isVerified),
      verifiedLabel: fallbacks.verifiedLabel,
      verifiedAriaLabel: fallbacks.verifiedAriaLabel,
      memberSinceLabel: fallbacks.memberSinceLabel,
      memberSinceDate: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '',
    },
    completionCard: {
      title: fallbacks.completionCard.title,
      description: getCompletionMessage(completionPercentage, fallbacks),
      ctaHref: settingsHref,
      ctaLabel:
        completionPercentage === 100
          ? fallbacks.completionCtaComplete
          : fallbacks.completionCtaIncomplete,
      percentage: completionPercentage,
      caption: fallbacks.completionCard.caption,
      items: [
        {
          key: 'name',
          label: fallbacks.completionLabels.name,
          complete: Boolean(profile.name?.trim()),
          completeLabel: fallbacks.doneLabel,
          incompleteLabel: fallbacks.missingLabel,
        },
        {
          key: 'phone',
          label: fallbacks.completionLabels.phone,
          complete: Boolean(profile.phone?.trim()),
          completeLabel: fallbacks.doneLabel,
          incompleteLabel: fallbacks.missingLabel,
        },
        {
          key: 'address',
          label: fallbacks.completionLabels.address,
          complete: isCompleteAddress(profile.primaryAddress),
          completeLabel: fallbacks.doneLabel,
          incompleteLabel: fallbacks.missingLabel,
        },
      ],
    },
    ordersCard: {
      ...fallbacks.ordersCard,
      ctaHref: ordersHref,
    },
    requestsCard: {
      ...fallbacks.requestsCard,
      ctaHref: requestsHref,
    },
    notificationsCard: {
      title: fallbacks.notificationsCard.title,
      description: fallbacks.notificationsCard.description,
      ctaHref: notificationsHref,
      ctaLabel: fallbacks.notificationsCard.ctaLabel,
      items: [
        {
          key: 'in-app',
          label: fallbacks.notificationsCard.labels.inApp,
          value: fallbacks.notificationsCard.labels.required,
          icon: 'bell',
          tone: 'success',
        },
        {
          key: 'important-email',
          label: fallbacks.notificationsCard.labels.importantEmail,
          value: fallbacks.notificationsCard.labels.required,
          icon: 'bell',
          tone: 'success',
        },
        {
          key: 'reminders',
          label: fallbacks.notificationsCard.labels.reminders,
          value: reminderStatus,
          icon: 'bell',
        },
      ],
    },
    preferencesCard: {
      title: fallbacks.preferencesCard.title,
      description: fallbacks.preferencesCard.description,
      ctaHref: settingsHref,
      ctaLabel: fallbacks.preferencesCard.ctaLabel,
      items: [
        {
          key: 'language',
          label: fallbacks.preferencesCard.labels.language,
          value: getLanguageLabel(profile.language, fallbacks),
          icon: 'cog',
        },
        {
          key: 'theme',
          label: fallbacks.preferencesCard.labels.theme,
          value: getThemeLabel(profile.theme, fallbacks),
          icon: 'cog',
        },
        {
          key: 'cookies',
          label: fallbacks.preferencesCard.labels.cookies,
          value: cookieLabel,
          icon: 'cog',
        },
      ],
    },
  };
}
