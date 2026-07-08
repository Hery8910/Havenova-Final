import type { ProfileOverviewFallbacks } from './profileOverview.types';

export const PROFILE_OVERVIEW_FALLBACKS: ProfileOverviewFallbacks = {
  loadingAriaLabel: 'Profile overview',
  profileUser: 'Profile user',
  profileAvatar: 'Profile avatar',
  verifiedLabel: 'Verified',
  verifiedAriaLabel: 'Verified account',
  memberSinceLabel: 'Member since:',
  notSetLabel: 'Not set',
  doneLabel: 'Done',
  missingLabel: 'Missing',
  enabledLabel: 'Enabled',
  offLabel: 'Off',
  coreReadinessLabel: 'Core profile readiness',
  completionCtaComplete: 'Edit profile',
  completionCtaIncomplete: 'Complete profile',
  completionMessages: {
    complete: 'Your core profile details are complete and ready to use.',
    high: 'You are close to completion. Add the last missing details to finish your profile.',
    medium: 'Your profile is in progress. Completing the remaining fields will improve bookings.',
    low: 'Add your core details so orders, requests and notifications work smoothly.',
  },
  completionLabels: {
    name: 'Name',
    phone: 'Phone',
    address: 'Primary address',
  },
  completionCard: {
    title: 'Profile completion',
    caption: 'Core profile readiness',
  },
  ordersCard: {
    title: 'Work orders',
    description: 'Track active bookings, completed visits and service history from one place.',
    ctaLabel: 'View orders',
    ctaHref: '',
    topics: [
      { label: 'Active bookings', icon: 'briefcase' },
      { label: 'Completed visits' },
      { label: 'Recent activity' },
    ],
    note: 'This area is meant to surface your live service workload and booking history as soon as order data is connected.',
  },
  requestsCard: {
    title: 'Work requests',
    description:
      'Review open requests, follow scheduling progress and keep your service pipeline visible.',
    ctaLabel: 'View requests',
    ctaHref: '',
    topics: [
      { label: 'Open requests', icon: 'list' },
      { label: 'Awaiting response' },
      { label: 'Scheduled next steps' },
    ],
    note: 'Requests should give you a quick view of what still needs confirmation before it becomes a work order.',
  },
  notificationsCard: {
    title: 'Notifications',
    description: 'Keep an eye on the channels that affect reminders, account updates and in-app alerts.',
    ctaLabel: 'Open notifications',
    ctaHref: '',
    labels: {
      inApp: 'In-app notifications',
      importantEmail: 'Important email notifications',
      reminders: 'Reminder emails',
      required: 'Required',
    },
  },
  preferencesCard: {
    title: 'Preferences',
    description: 'See the current presentation settings that shape how your profile behaves day to day.',
    ctaLabel: 'Open settings',
    ctaHref: '',
    labels: {
      language: 'Language',
      theme: 'Theme',
      cookies: 'Cookies',
      dark: 'Dark mode',
      light: 'Light mode',
    },
  },
};
