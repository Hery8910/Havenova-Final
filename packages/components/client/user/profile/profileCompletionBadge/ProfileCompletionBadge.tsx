'use client';

import { useId } from 'react';
import styles from './ProfileCompletionBadge.module.css';
import type { UserClientProfile } from '../../../../../types';
import {
  getProfileCompletionPercentage,
  getProfileCompletionState,
} from './profileCompletion.helpers';

interface ProfileCompletionBadgeTexts {
  title?: string;
  info?: string;
  progressAriaLabel?: string;
  percentageAriaLabel?: string;
}

interface ProfileCompletionBadgeProps {
  profile: UserClientProfile;
  texts?: ProfileCompletionBadgeTexts;
  emphasis?: 'default' | 'subtle-when-complete';
}

export function ProfileCompletionBadge({
  profile,
  texts,
  emphasis = 'default',
}: ProfileCompletionBadgeProps) {
  const titleId = useId();
  const percentage = getProfileCompletionPercentage(profile);
  const state = getProfileCompletionState(percentage);
  const stateCardClassName =
    state === 'low'
      ? 'card--alert-error'
      : state === 'medium'
        ? 'card--alert-warning'
        : 'card--alert-success';
  const title = texts?.title ?? 'Profile completion';
  const progressAriaLabel = texts?.progressAriaLabel ?? 'Profile completion progress';
  const percentageAriaLabel = texts?.percentageAriaLabel ?? 'Profile completion percentage';
  const isSubtleComplete = emphasis === 'subtle-when-complete' && state === 'high';

  return (
    <section
      className={`${styles.badge} card ${stateCardClassName} ${
        isSubtleComplete ? styles.badgeSubtleComplete : ''
      }`}
      aria-labelledby={titleId}
    >
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
          <span
            className={`${styles.progressFill} ${styles[`progressFill${state.charAt(0).toUpperCase()}${state.slice(1)}`]}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </section>
  );
}
