'use client';

import styles from './page.module.css';

import { useRequireLogin } from '../../../../../../packages/hooks/useRequireLogin';

const Profile = () => {
  useRequireLogin();

  return (
    <div className={styles.wrapper}>
      <section className={styles.section} aria-label="Profile content"></section>
    </div>
  );
};

export default Profile;
