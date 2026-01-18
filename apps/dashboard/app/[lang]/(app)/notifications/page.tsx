'use client';

import styles from './page.module.css';
import { useRequireRole } from '../../../../../../packages/contexts';

const Notifications = () => {
  const isAllowed = useRequireRole('admin');

  if (!isAllowed) return null;

  return (
    <main className={styles.main}>
      <h1>Notifications</h1>

    </main>
  );
};

export default Notifications
