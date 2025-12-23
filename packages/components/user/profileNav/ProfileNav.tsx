'use client';

import Link from 'next/link';
import styles from './ProfileNav.module.css';
import { FaUser, FaBell, FaListUl, FaCog } from 'react-icons/fa';
import { href } from '../../../utils';
import { useI18n } from '../../../contexts';
import { useLang } from '../../../hooks';
import { usePathname } from 'next/navigation';

const routes = [
  { key: 'profile', path: '/user/profile', icon: <FaUser aria-hidden /> },
  { key: 'requests', path: '/user/profile/requests', icon: <FaListUl aria-hidden /> },
  { key: 'notifications', path: '/user/profile/notification', icon: <FaBell aria-hidden /> },
  { key: 'settings', path: '/user/profile/settings', icon: <FaCog aria-hidden /> },
];

interface ProfileNavProps {
  className?: string;
}

export function ProfileNav({ className }: ProfileNavProps) {
  const { texts } = useI18n();
  const lang = useLang();
  const pathname = usePathname();
  const labels = texts.pages.user.profileNav;

  return (
    <nav className={`${styles.nav} ${className ?? ''}`.trim()} aria-label="Profil Navigation">
      <ul className={styles.list}>
        {routes.map((item) => {
          const active = pathname?.startsWith(href(lang, item.path));
          return (
            <li key={item.key} className={styles.listItem}>
              <Link
                href={href(lang, item.path)}
                className={`${styles.link} ${active ? styles.active : ''}`.trim()}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>
                  {labels?.[item.key as keyof typeof labels] ?? item.key}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
