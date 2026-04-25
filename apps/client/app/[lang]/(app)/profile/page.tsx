'use client';

import { UserPreferencesCard } from '@/packages/components/client/user/profile/userPreferencesCard/UserPreferencesCard';
import { UserProfileDetailsManager } from '@/packages/components/client/user/profile/userProfileDetailsManager/manager/UserProfileDetailsManager';
import { useAuth } from '@/packages/contexts/auth/authContext';
import { useRequireLogin } from '@/packages/hooks/useRequireLogin';
import styles from './page.module.css';

const Profile = () => {
  const { loading } = useAuth();

  useRequireLogin();

  if (loading) {
    return <div className={styles.wrapper} aria-busy="true" />;
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section} aria-label="Profile content">
        <div className={`${styles.detailsPanel} glass-panel--base`}>
          <UserProfileDetailsManager />
        </div>
        <div className={styles.panel}>
          <UserPreferencesCard />
        </div>
      </section>
    </div>
  );
};

export default Profile;
