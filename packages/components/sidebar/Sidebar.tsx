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
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

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
  const [isOpen, setIsOpen] = useState(false);
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
      setIsMobile(window.innerWidth <= 1024);
      setIsOpen(window.innerWidth <= 1024);
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
          router.push('/');
        }, 3000);
      } else {
        setAlert({
          status: 500,
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
      }
    } catch (error) {
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
    <nav className={`${styles.nav} ${isOpen ? `${styles.close}` : `${styles.open}`} card`}>
      <button
        className={styles.open_button}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMobile(!isMobile);
        }}
      >
        {isMobile ? <IoIosArrowForward /> : <IoIosArrowBack />}
      </button>
      <ul className={styles.ul}>
        {items.map(({ label, href, icon }) => (
          <li key={href} className={styles.li}>
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${
                isMobile ? `${styles.link_close}` : `${styles.link_open}`
              } ${pathname === `/${user?.language}${href}` ? styles.active : ''}`}
            >
              {icon} {!isMobile && <p>{label}</p>}
            </Link>
          </li>
        ))}
      </ul>
      <ul className={styles.ul}>
        <li className={styles.link}>{/* <SupportModal context={context} /> */}</li>
        <li className={styles.link}>
          <button
            className={`${styles.button} ${
              isMobile ? `${styles.link_close}` : `${styles.link_open}`
            }`}
            onClick={handleLogout}
          >
            <LuLogOut /> {!isMobile && <p>Logout</p>}
          </button>
        </li>
      </ul>
      {loading && <Loading theme={user?.theme || 'light'} />}
      {alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}
    </nav>
  );
}
