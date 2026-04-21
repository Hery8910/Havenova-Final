'use client';

import Link from 'next/link';
import styles from './ProfileNav.module.css';
import { FaUser, FaBell, FaListUl, FaCog } from 'react-icons/fa';
import { href } from '../../../../../utils';
import { useAuth, useI18n } from '../../../../../contexts';
import { useLang } from '../../../../../hooks';
import { usePathname } from 'next/navigation';
import { FaBriefcase } from 'react-icons/fa6';
import { useState } from 'react';
import { LuLogOut } from 'react-icons/lu';

const routes = [
  { key: 'overview', path: '/profile', icon: <FaUser aria-hidden /> },
  { key: 'orders', path: '/profile/orders', icon: <FaBriefcase aria-hidden /> },
  { key: 'requests', path: '/profile/requests', icon: <FaListUl aria-hidden /> },
  { key: 'notifications', path: '/profile/notifications', icon: <FaBell aria-hidden /> },
];
const settings = { key: 'settings', path: '/profile/settings', icon: <FaCog aria-hidden /> };
const logoutButton = { key: 'logout', path: '', icon: <LuLogOut aria-hidden /> };

export function ProfileNav() {
  const { logout } = useAuth();
  const { texts } = useI18n();
  const logoutText = texts.components.dashboard.sidebar.logout || 'Logout';
  const lang = useLang();
  const pathname = usePathname();
  const labels = texts.pages.client.user.profileNav;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const active = pathname?.startsWith(href(lang, settings.path));

  return (
    <div className={`${styles.wrapper} card`} role="navigation">
      <ul className={styles.list}>
        {routes.map((item) => {
          const active =
            pathname?.localeCompare(href(lang, item.path), undefined, { sensitivity: 'base' }) ===
            0;
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
      <ul className={styles.list}>
        <li key={settings.key} className={styles.listItem}>
          <Link
            href={href(lang, settings.path)}
            className={`${styles.link} ${active ? styles.active : ''}`.trim()}
          >
            <span className={styles.icon}>{settings.icon}</span>
            <span className={styles.label}>
              {labels?.[settings.key as keyof typeof labels] ?? settings.key}
            </span>
          </Link>
        </li>
        <li key="logout" className={styles.listItem}>
          <button
            type="button"
            onClick={logout}
            className={`${styles.link} ${isCollapsed ? styles.navLinkCompact : styles.navLinkFull}${active ? styles.active : ''}`.trim()}
            aria-label={logoutText}
            title={isCollapsed ? logoutButton.key : undefined}
          >
            <span className={styles.icon}>{logoutButton.icon}</span>
            <span className={styles.label}>{logoutText}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}
