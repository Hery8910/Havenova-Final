'use client';
import Image from 'next/image';
import { User } from '../../../types';
import LanguageSwitcher from '../../languageSwitcher/LanguageSwitcher';
import ThemeToggler from '../../themeToggler/ThemeToggler';
import styles from './DashboardHeader.module.css';
import { useUser } from '../../../contexts/user';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../hooks/useLang';
import { href } from '../../../utils/navigation';
import { useState } from 'react';
import { useEffect } from 'react';

export default function DashboardHeader() {
  const { user } = useUser();
  const router = useRouter();
  const lang = useLang();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLogoSrc = () => {
    if (user?.theme === 'dark') {
      return isMobile ? '/svg/logos/logo-small-dark.svg' : '/svg/logos/logo-dark.svg';
    } else {
      return isMobile ? '/svg/logos/logo-small-light.svg' : '/svg/logos/logo-light.svg';
    }
  };

  if (!user) return;

  return (
    <section className={styles.section}>
      <Image
        className={styles.logo}
        src={getLogoSrc()}
        alt="Havenova Logo"
        width={isMobile ? 40 : 300}
        height={isMobile ? 40 : 75}
        priority
      />
      <ul className={styles.ul}>
        <li>
          <ThemeToggler />
        </li>
        <li>
          <LanguageSwitcher />
        </li>
        <li onClick={() => router.push(href(lang, '/profile'))} className={styles.li}>
          <Image
            className={styles.image}
            src={user.profileImage}
            alt=""
            width={35}
            height={35}
            priority
          />
          <h1 className={styles.h1}>{user.name}</h1>
        </li>
      </ul>
    </section>
  );
}
