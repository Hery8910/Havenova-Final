'use client';

import { UserPreferencesCard } from '@/packages/components';
import { DeleteAccountSectionClient } from './deleteAccount';
import {
  UserProfileDetailsForm,
  UserProfileDetailsSummary,
  UserProfileIdentityCard,
  useUserProfileDetailsController,
} from './details';
import styles from './ProfileSettingsClient.module.css';

export function ProfileSettingsClient() {
  const { identityProps, summaryProps, formProps, showSummary, showFullForm } =
    useUserProfileDetailsController({});

  return (
    <section className={styles.section} aria-label="Profile settings">
      <article className={styles.article}>
        {identityProps ? <UserProfileIdentityCard {...identityProps} /> : null}
        {showSummary ? <UserProfileDetailsSummary {...summaryProps} /> : null}
        {showFullForm ? <UserProfileDetailsForm {...formProps} /> : null}
        <UserPreferencesCard />
        <DeleteAccountSectionClient />
      </article>
    </section>
  );
}
