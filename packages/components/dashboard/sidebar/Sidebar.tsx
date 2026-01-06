'use client';
import styles from './Sidebar.module.css';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LuBell,
  LuBookOpen,
  LuBriefcase,
  LuLayoutPanelTop,
  LuSettings,
  LuListChecks,
  LuLogOut,
  LuMessagesSquare,
  LuUser,
  LuUsers,
} from 'react-icons/lu';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Image from 'next/image';
import { PiBuildings } from 'react-icons/pi';
import { useAuth, useI18n, useProfile } from '../../../contexts';
import { useLang } from '../../../hooks';

export interface NavItem {
  label: string;
  href: string;
}

export default function Sidebar() {
  const { logout } = useAuth();
  const { profile } = useProfile();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lang = useLang();
  const { texts } = useI18n();
  const sidebarTexts = texts.components.dashboard.sidebar || {};
  const pagesText = sidebarTexts.pages || [];
  const settingsText = sidebarTexts.settings || [];
  const logoutText = sidebarTexts.logout || 'Logout';
  const closeMenuText = sidebarTexts.closeMenu || 'Close menu';
  const openMenuText = sidebarTexts.openMenu || 'Open menu';

  const iconMap: Record<string, JSX.Element> = {
    '/': <LuLayoutPanelTop />,
    '/requests': <LuListChecks />,
    '/clients': <LuUsers />,
    '/employees': <LuBriefcase />,
    '/messages': <LuMessagesSquare />,
    '/notifications': <LuBell />,
    '/support': <LuSettings />,
    '/profile': <LuUser />,
    '/property-manager': <PiBuildings />,
    '/objects': <PiBuildings />,
    '/global-task-catalog': <LuBookOpen />,
  };

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const getLogoSrc = () => {
    if (profile.theme === 'dark') {
      return isCollapsed ? '/favicon-light.svg' : '/images/logos/nav-logo-dark.webp';
    } else {
      return isCollapsed ? '/favicon-dark.svg' : '/images/logos/nav-logo-light.webp';
    }
  };

  return (
    <nav className={styles.sidebar} aria-label="Sidebar navigation" id="dashboard-sidebar">
      <header className={styles.sidebarHeader}>
        <div className={styles.logoWrapper}>
          <Image
            className={styles.logo}
            src={getLogoSrc()}
            alt="Havenova Logo"
            width={isCollapsed ? 40 : 160}
            height={isCollapsed ? 40 : 40}
            priority
          />
        </div>
        <ul className={styles.navList}>
          {pagesText.map(({ label, href }) => {
            const fullHref = `/${lang}${href}`;
            return (
              <li key={label} className={styles.navItem}>
                <Link
                  key={href}
                  href={fullHref}
                  className={`${styles.navLink} ${
                    isCollapsed ? styles.navLinkCompact : styles.navLinkFull
                  } ${pathname === fullHref ? styles.active : ''}`}
                  aria-current={pathname === fullHref ? 'page' : undefined}
                  aria-label={label}
                  title={isCollapsed ? label : undefined}
                >
                  {iconMap[href] || null}
                  {!isCollapsed && <p>{label}</p>}
                </Link>
              </li>
            );
          })}
        </ul>
      </header>
      <div className={styles.sidebarFooter}>
        <ul className={styles.footerList}>
          {settingsText.map(({ label, href }) => {
            const fullHref = `/${lang}${href}`;
            return (
              <li key={label} className={styles.navItem}>
                <Link
                  key={href}
                  href={fullHref}
                  className={`${styles.navLink} ${
                    isCollapsed ? styles.navLinkCompact : styles.navLinkFull
                  } ${pathname === fullHref ? styles.active : ''}`}
                  aria-current={pathname === fullHref ? 'page' : undefined}
                  aria-label={label}
                  title={isCollapsed ? label : undefined}
                >
                  {iconMap[href] || null}
                  {!isCollapsed && <p>{label}</p>}
                </Link>
              </li>
            );
          })}
          <li className={styles.navItem}>
            <button
              type="button"
              onClick={logout}
              className={`${styles.logoutButton} ${
                isCollapsed ? styles.navLinkCompact : styles.navLinkFull
              }`}
              aria-label={logoutText}
              title={isCollapsed ? logoutText : undefined}
            >
              <LuLogOut /> {!isCollapsed && <p>{logoutText}</p>}
            </button>
          </li>
        </ul>
        <button
          type="button"
          className={styles.toggleButton}
          aria-controls="dashboard-sidebar"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? openMenuText : closeMenuText}
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
        >
          {isCollapsed ? (
            <IoIosArrowForward />
          ) : (
            <>
              <IoIosArrowBack />
              <span className={styles.toggleLabel}>{closeMenuText}</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
