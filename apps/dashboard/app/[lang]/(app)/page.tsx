'use client';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../../../packages/hooks';
import { href } from '../../../../../packages/utils/navigation';
import { useAuth } from '../../../../../packages/contexts';

const Dashboard = () => {
  const { auth } = useAuth();
  const router = useRouter();
  const lang = useLang();

  if (!auth) return null;
  if (!auth.isLogged) router.push(href(lang, '/login'));

  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};

export default Dashboard;
