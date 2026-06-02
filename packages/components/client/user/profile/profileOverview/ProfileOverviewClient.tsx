'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { FaArrowRight, FaBell, FaCheck, FaCog, FaRegCircle, FaListUl } from 'react-icons/fa';
import { FaBriefcase } from 'react-icons/fa6';
import { useAuth, useI18n, useProfile } from '../../../../../contexts';
import { useLang, useRequireLogin } from '../../../../../hooks';
import type { UserClientProfile } from '../../../../../types';
import { href } from '../../../../../utils/navigation';
import {
  getProfileCompletionPercentage,
  getProfileCompletionState,
  isCompleteAddress,
} from '../profileCompletionBadge/profileCompletion.helpers';
import { UserProfileIdentityCard } from '../profileSettings';
import styles from './ProfileOverviewClient.module.css';

type OverviewCardProps = {
  title: string;
  description?: string;
  ctaHref: string;
  ctaLabel: string;
  children: React.ReactNode;
};

const LANGUAGE_LABELS: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
};

const THEME_LABELS: Record<string, string> = {
  dark: 'Dark mode',
  light: 'Light mode',
};

function OverviewCard({ title, description, ctaHref, ctaLabel, children }: OverviewCardProps) {
  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <div className={styles.cardTitleGroup}>
          <h2 className={`type-title-sm ${styles.title}`}>{title}</h2>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
        <Link href={ctaHref} className={`${styles.cta} button button--outline button--outline-small`}>
          {ctaLabel}
          <FaArrowRight aria-hidden="true" />
        </Link>
      </header>
      {children}
    </section>
  );
}

const getLanguageLabel = (language?: string) => LANGUAGE_LABELS[language ?? ''] ?? 'Not set';

const getThemeLabel = (theme?: string) => THEME_LABELS[theme ?? ''] ?? 'Not set';

const getCompletionMessage = (percentage: number) => {
  const state = getProfileCompletionState(percentage);

  if (state === 'high' && percentage === 100) {
    return 'Your core profile details are complete and ready to use.';
  }

  if (state === 'high') {
    return 'You are close to completion. Add the last missing details to finish your profile.';
  }

  if (state === 'medium') {
    return 'Your profile is in progress. Completing the remaining fields will improve bookings.';
  }

  return 'Add your core details so orders, requests and notifications work smoothly.';
};

const buildIdentityProps = (
  profile: UserClientProfile,
  auth: { isVerified?: boolean; email?: string | null }
) => ({
  profile,
  name: profile.name?.trim() || auth.email?.trim() || 'Profile user',
  avatarAlt: profile.name?.trim() ? `${profile.name} avatar` : 'Profile avatar',
  isVerified: Boolean(auth.isVerified),
  verifiedLabel: 'Verified',
  verifiedAriaLabel: 'Verified account',
  memberSinceLabel: 'Member since:',
  memberSinceDate: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '',
});

export function ProfileOverviewClient() {
  const { auth, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { texts } = useI18n();
  const lang = useLang();

  useRequireLogin();

  const completionPercentage = useMemo(() => getProfileCompletionPercentage(profile), [profile]);
  const completionItems = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        complete: Boolean(profile.name?.trim()),
      },
      {
        key: 'phone',
        label: 'Phone',
        complete: Boolean(profile.phone?.trim()),
      },
      {
        key: 'address',
        label: 'Primary address',
        complete: isCompleteAddress(profile.primaryAddress),
      },
    ],
    [profile]
  );

  const reminderStatus = profile.notificationPreferences.email.reminders.enabled ? 'Enabled' : 'Off';
  const cookieLabel =
    texts?.pages?.client?.user?.profile?.preferences?.sections?.cookies?.buttonLabel ??
    'Open cookie notice';
  const settingsHref = href(lang, '/profile/settings');
  const ordersHref = href(lang, '/profile/orders');
  const requestsHref = href(lang, '/profile/requests');
  const notificationsHref = href(lang, '/profile/notifications');
  const completionCtaLabel = completionPercentage === 100 ? 'Edit profile' : 'Complete profile';
  const loading = authLoading || profileLoading;

  if (loading) {
    return <section className={styles.section} aria-busy="true" aria-label="Profile overview" />;
  }

  return (
    <section className={styles.section} aria-label="Profile overview">
      <div className={styles.topRow}>
        <div className={styles.identitySlot}>
          <UserProfileIdentityCard {...buildIdentityProps(profile, auth)} />
        </div>

        <OverviewCard
          title="Profile completion"
          description={getCompletionMessage(completionPercentage)}
          ctaHref={settingsHref}
          ctaLabel={completionCtaLabel}
        >
          <div className={styles.progressBlock}>
            <p className={styles.metaValue}>{completionPercentage}%</p>
            <p className={styles.metaCaption}>Core profile readiness</p>
            <div className={styles.progressTrack} aria-hidden="true">
              <div className={styles.progressBar} style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>

          <div className={styles.completionList}>
            {completionItems.map((item) => (
              <div key={item.key} className={styles.completionItem}>
                <span
                  className={`${styles.statusIcon} ${item.complete ? styles.statusComplete : styles.statusPending}`}
                  aria-hidden="true"
                >
                  {item.complete ? <FaCheck /> : <FaRegCircle />}
                </span>
                <p className={styles.summaryLabel}>{item.label}</p>
                <p className={styles.summaryValue}>{item.complete ? 'Done' : 'Missing'}</p>
              </div>
            ))}
          </div>
        </OverviewCard>
      </div>

      <div className={styles.summaryGrid}>
        <OverviewCard
          title="Work orders"
          description="Track active bookings, completed visits and service history from one place."
          ctaHref={ordersHref}
          ctaLabel="View orders"
        >
          <div className={styles.topicList}>
            <div className={styles.topicPillRow}>
              <span className={styles.topicPill}>
                <FaBriefcase aria-hidden="true" />
                Active bookings
              </span>
              <span className={styles.topicPill}>Completed visits</span>
              <span className={styles.topicPill}>Recent activity</span>
            </div>
            <p className={styles.topicNote}>
              This area is meant to surface your live service workload and booking history as soon as
              order data is connected.
            </p>
          </div>
        </OverviewCard>

        <OverviewCard
          title="Work requests"
          description="Review open requests, follow scheduling progress and keep your service pipeline visible."
          ctaHref={requestsHref}
          ctaLabel="View requests"
        >
          <div className={styles.topicList}>
            <div className={styles.topicPillRow}>
              <span className={styles.topicPill}>
                <FaListUl aria-hidden="true" />
                Open requests
              </span>
              <span className={styles.topicPill}>Awaiting response</span>
              <span className={styles.topicPill}>Scheduled next steps</span>
            </div>
            <p className={styles.topicNote}>
              Requests should give you a quick view of what still needs confirmation before it becomes
              a work order.
            </p>
          </div>
        </OverviewCard>

        <OverviewCard
          title="Notifications"
          description="Keep an eye on the channels that affect reminders, account updates and in-app alerts."
          ctaHref={notificationsHref}
          ctaLabel="Open notifications"
        >
          <div className={styles.summaryList}>
            <div className={styles.summaryItem}>
              <span className={`${styles.statusIcon} ${styles.statusComplete}`} aria-hidden="true">
                <FaBell />
              </span>
              <p className={styles.summaryLabel}>In-app notifications</p>
              <p className={styles.summaryValue}>Required</p>
            </div>
            <div className={styles.summaryItem}>
              <span className={`${styles.statusIcon} ${styles.statusComplete}`} aria-hidden="true">
                <FaBell />
              </span>
              <p className={styles.summaryLabel}>Important email notifications</p>
              <p className={styles.summaryValue}>Required</p>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.statusIcon} aria-hidden="true">
                <FaBell />
              </span>
              <p className={styles.summaryLabel}>Reminder emails</p>
              <p className={styles.summaryValue}>{reminderStatus}</p>
            </div>
          </div>
        </OverviewCard>

        <OverviewCard
          title="Preferences"
          description="See the current presentation settings that shape how your profile behaves day to day."
          ctaHref={settingsHref}
          ctaLabel="Open settings"
        >
          <div className={styles.summaryList}>
            <div className={styles.summaryItem}>
              <span className={styles.statusIcon} aria-hidden="true">
                <FaCog />
              </span>
              <p className={styles.summaryLabel}>Language</p>
              <p className={styles.summaryValue}>{getLanguageLabel(profile.language)}</p>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.statusIcon} aria-hidden="true">
                <FaCog />
              </span>
              <p className={styles.summaryLabel}>Theme</p>
              <p className={styles.summaryValue}>{getThemeLabel(profile.theme)}</p>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.statusIcon} aria-hidden="true">
                <FaCog />
              </span>
              <p className={styles.summaryLabel}>Cookies</p>
              <p className={styles.summaryValue}>{cookieLabel}</p>
            </div>
          </div>
        </OverviewCard>
      </div>
    </section>
  );
}
