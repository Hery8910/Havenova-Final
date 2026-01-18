'use client';

import styles from './page.module.css';
import { useRequireRole } from '../../../../../../packages/contexts';

const Clients = () => {
  const isAllowed = useRequireRole('admin');

  if (!isAllowed) return null;

  return (
    <main className={styles.main}>
      <h1>Clients</h1>

    </main>
  );
};

export default Clients
