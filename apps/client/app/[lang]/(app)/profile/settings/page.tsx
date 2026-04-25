'use client';

import { UserProfileDetailsManager } from '@/packages/components/client/user/profile/userProfileDetailsManager/manager/UserProfileDetailsManager';
import styles from './page.module.css';

export default function Edit() {
  return (
    <section className={`${styles.section} glass-panel--base`} aria-label="Profile settings">
      <article className={styles.article}>
        <UserProfileDetailsManager />
      </article>
    </section>
  );
}
