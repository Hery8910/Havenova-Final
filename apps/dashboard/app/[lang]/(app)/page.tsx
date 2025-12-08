'use client';
import { useUser } from '@/packages/contexts/profile';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../../../packages/hooks';
import { href } from '../../../../../packages/utils/navigation';

const Dashboard = () => {
  const { user } = useUser();
  const router = useRouter();
  const lang = useLang();

  if (user?.role === 'guest') {
    router.push(href(lang, '/login'));
  }
  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};

export default Dashboard;
