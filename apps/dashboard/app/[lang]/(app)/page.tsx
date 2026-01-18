'use client';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../../../packages/hooks';
import { href } from '../../../../../packages/utils/navigation';
import { useAuth, useRequireRole } from '../../../../../packages/contexts';

const Dashboard = () => {
  const { auth } = useAuth();
  const isAllowed = useRequireRole('admin');
  const router = useRouter();
  const lang = useLang();

  if (!auth || !isAllowed) return null;

  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};

export default Dashboard;
