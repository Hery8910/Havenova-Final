'use client';
import styles from './Sidebar.module.css';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LuBell,
  LuBriefcase,
  LuLayoutPanelTop,
  LuSettings,
  LuListChecks,
  LuLogOut,
  LuMessagesSquare,
  LuUser,
  LuUsers,
} from 'react-icons/lu';
import { useI18n } from '../../contexts/i18n';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useAuth, useProfile } from '../../contexts';
import { useLang } from '../../hooks';
import Image from 'next/image';
import { PiBuildings } from 'react-icons/pi';

export interface NavItem {
  label: string;
  href: string;
}

export default function Sidebar() {
  const { logout } = useAuth();
  const { profile } = useProfile();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const lang = useLang();
  const { texts } = useI18n();
  const pagesText = texts.components.dashboard.sidebar.pages || [];
  const settingsText = texts.components.dashboard.sidebar.settings || [];
  const logoutText = texts.components.dashboard.sidebar.logout || 'Logout';

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
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      setIsOpen(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const getLogoSrc = () => {
    if (profile.theme === 'dark') {
      return isMobile ? '/favicon-dark.svg' : '/images/logos/nav-logo-dark.webp';
    } else {
      return isMobile ? '/favicon-light.svg' : '/images/logos/nav-logo-light.webp';
    }
  };

  return (
    <section className={`${styles.nav} ${isOpen ? `${styles.open}` : ''}`}>
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <Image
            className={styles.logo}
            src={getLogoSrc()}
            alt="Havenova Logo"
            width={isMobile ? 40 : 150}
            height={isMobile ? 40 : 40}
            priority
          />
        </div>
        <ul className={styles.headerUl}>
          {pagesText.map(({ label, href }) => {
            const fullHref = `/${lang}${href}`;
            return (
              <li className={styles.headerLi}>
                <Link
                  key={href}
                  href={fullHref}
                  className={`${styles.link} ${
                    isMobile ? `${styles.link_close}` : `${styles.link_open}`
                  } ${pathname === fullHref ? styles.active : ''}`}
                >
                  {iconMap[href] || null}
                  {!isMobile && <p>{label}</p>}
                </Link>
              </li>
            );
          })}
        </ul>
      </header>
      <div className={styles.footer}>
        <ul className={styles.footerUl}>
          {settingsText.map(({ label, href }) => {
            const fullHref = `/${lang}${href}`;
            return (
              <li className={styles.headerLi}>
                <Link
                  key={href}
                  href={fullHref}
                  className={`${styles.link} ${
                    isMobile ? `${styles.link_close}` : `${styles.link_open}`
                  } ${pathname === fullHref ? styles.active : ''}`}
                >
                  {iconMap[href] || null}
                  {!isMobile && <p>{label}</p>}
                </Link>
              </li>
            );
          })}
          <div className={styles.buttonWrapper}>
            <button
              onClick={logout}
              className={`${styles.button} ${
                isMobile ? `${styles.link_close}` : `${styles.link_open}`
              }`}
            >
              <LuLogOut /> {!isMobile && <p>{logoutText}</p>}
            </button>
          </div>
        </ul>
        <button
          className={styles.open_button}
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMobile(!isMobile);
          }}
        >
          {isMobile ? <IoIosArrowForward /> : <IoIosArrowBack />}
        </button>
      </div>
    </section>
  );
}
