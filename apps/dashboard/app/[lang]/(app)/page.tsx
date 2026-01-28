'use client';
import styles from './page.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../../../packages/hooks';
import { href } from '../../../../../packages/utils/navigation';
import { useAuth, useRequireRole } from '../../../../../packages/contexts';

const Dashboard = () => {
  const { auth } = useAuth();
  const router = useRouter();
  const lang = useLang();
  const isAllowed = useRequireRole('admin');

  if (!isAllowed) return null;

  useEffect(() => {
    if (auth && !auth.isLogged) {
      router.replace(href(lang, '/user/login'));
    }
  }, [auth, lang, router]);

  if (!auth || !auth.isLogged) return null;

  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};

export default Dashboard;
