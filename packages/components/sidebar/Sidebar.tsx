'use client';
import styles from './Sidebar.module.css';
import Link from 'next/link';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { logoutUser } from '../../services/userService';
import { MdLogout } from 'react-icons/md';

import { LuLogOut } from 'react-icons/lu';
import { useI18n } from '../../contexts/i18n';
import { useUser } from '../../contexts/user';
import { Loading } from '../loading';
import { AlertWrapper } from '../alert';

export interface NavItem {
  label: string;
  href: string;
  icon: React.JSX.Element;
}
interface DashboardSidebarProps {
  items: NavItem[];
  context: 'user-profile' | 'admin-dashboard';
}

export default function Sidebar({ items, context }: DashboardSidebarProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { texts } = useI18n();
  const popups = texts.popups;
  const { logout } = useUser();
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await logoutUser();
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        logout(); // Limpia el contexto/localstorage, etc.
        setAlert({
          status: 200,
          title: popupData.title || popups.USER_LOGOUT_SUCCESS.title,
          description: popupData.title || popups.USER_LOGOUT_SUCCESS.description,
        });
        setTimeout(() => {
          setAlert(null);
          router.push('/'); // Redirige a home o donde prefieras
        }, 3000);
      } else {
        setAlert({
          status: 500,
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
      }
    } catch (error) {
      console.error(error);
      setAlert({
        status: 500,
        title: popups.GLOBAL_INTERNAL_ERROR.title,
        description: popups.GLOBAL_INTERNAL_ERROR.description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className={`${styles.nav} ${isMobile ? `${styles.mobile}` : ''}`}>
      <ul className={styles.ul}>
        {items.map(({ label, href, icon }) => (
          <li key={href} className={styles.li}>
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ''}`}
            >
              {icon} {!isMobile && <p>{label}</p>}
            </Link>
          </li>
        ))}
      </ul>
      <ul className={styles.ul}>
        <li className={styles.link}>{/* <SupportModal context={context} /> */}</li>
        <li className={styles.link}>
          <button className={styles.logout} onClick={handleLogout}>
            <LuLogOut /> Logout
          </button>
        </li>
      </ul>
      {loading && <Loading theme={user?.theme || 'light'} />}
      {alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}
    </nav>
  );
}
