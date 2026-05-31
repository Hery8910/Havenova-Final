'use client';

import {
  UserProfileDetailsForm,
  UserProfileDetailsSummary,
  UserProfileIdentityCard,
  useUserProfileDetailsController,
} from '@/packages/components/client/user/profile/profileSettings';
import { UserPreferencesCard } from '@/packages/components/client/user/profile/userPreferencesCard/UserPreferencesCard';
import { useAuth } from '@/packages/contexts/auth/authContext';
import { useRequireLogin } from '@/packages/hooks/useRequireLogin';
import styles from './page.module.css';

const Profile = () => {
  const { loading } = useAuth();
  const { identityProps, summaryProps, formProps, showSummary, showFullForm } =
    useUserProfileDetailsController({});

  useRequireLogin();

  if (loading) {
    return <div className={styles.wrapper} aria-busy="true" />;
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section} aria-label="Profile content">
        <div className={`${styles.detailsPanel} glass-panel--base`}>
          {identityProps ? <UserProfileIdentityCard {...identityProps} /> : null}
          {showSummary ? <UserProfileDetailsSummary {...summaryProps} /> : null}
          {showFullForm ? <UserProfileDetailsForm {...formProps} /> : null}
        </div>
        <div className={styles.panel}>
          <UserPreferencesCard />
        </div>
      </section>
    </div>
  );
};

export default Profile;
