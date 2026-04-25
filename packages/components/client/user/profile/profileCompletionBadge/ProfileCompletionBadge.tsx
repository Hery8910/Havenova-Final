'use client';

import { useId } from 'react';
import styles from './ProfileCompletionBadge.module.css';
import type { UserAddress, UserClientProfile } from '../../../../../types';

interface ProfileCompletionBadgeTexts {
  title?: string;
  info?: string;
  progressAriaLabel?: string;
  percentageAriaLabel?: string;
}

interface ProfileCompletionBadgeProps {
  profile: UserClientProfile;
  texts?: ProfileCompletionBadgeTexts;
}

const isNonEmpty = (value?: string) => Boolean(value?.trim());

const isCompleteAddress = (address?: UserAddress) =>
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

const getCompletionPercentage = (profile: UserClientProfile) => {
  const completedFields = PROFILE_COMPLETION_CHECKS.reduce(
    (total, check) => total + Number(check(profile)),
    0
  );

  return Math.round((completedFields / PROFILE_COMPLETION_CHECKS.length) * 100);
};

const getCompletionState = (percentage: number) => {
  if (percentage >= 67) return 'high';
  if (percentage >= 34) return 'medium';
  return 'low';
};

export function ProfileCompletionBadge({ profile, texts }: ProfileCompletionBadgeProps) {
  const titleId = useId();
  const percentage = getCompletionPercentage(profile);
  const state = getCompletionState(percentage);
  const title = texts?.title ?? 'Profile completion';
  const info =
    texts?.info ?? 'Complete the missing details to improve your booking and communication flow.';
  const progressAriaLabel = texts?.progressAriaLabel ?? 'Profile completion progress';
  const percentageAriaLabel = texts?.percentageAriaLabel ?? 'Profile completion percentage';

  return (
    <section className={`${styles.badge} glass-panel--service-primary`} aria-labelledby={titleId}>
      <p id={titleId} className={styles.title}>
        {title}
      </p>

      <div className={styles.metrics}>
        <output
          className={`${styles.value} ${styles[state]}`}
          aria-label={`${percentageAriaLabel}: ${percentage}%`}
        >
          {percentage} <span className={`${styles.percentage} ${styles[state]}`}>%</span>
        </output>

        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-label={progressAriaLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          aria-valuetext={`${percentage}%`}
        >
          <span className={styles.progressFill} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </section>
  );
}
