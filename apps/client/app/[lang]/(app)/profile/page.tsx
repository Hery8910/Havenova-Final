'use client';

import styles from './page.module.css';
import { UserProfileDetailsManager, UserPreferencesCard } from '../../../../../../packages/components';
import { useRequireLogin } from '../../../../../../packages/hooks/useRequireLogin';

const Profile = () => {
  useRequireLogin();

  return (
    <div className={styles.wrapper}>
      <section className={styles.section} aria-label="Profile content">
        <div className={styles.panel}>
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
