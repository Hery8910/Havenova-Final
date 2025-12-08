'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/packages/contexts/profile';
import { useI18n } from '@havenova/contexts/i18n';
import { href } from '@havenova/utils/navigation';
import { useLang } from '@havenova/hooks/useLang';
import { NavbarConfig, NavbarView } from './NavbarView';
import { NavbarSkeleton } from './Navbar.skeleton';
import { useAuth } from '../../contexts/auth/authContext';

export function NavbarContainer() {
  const { profile } = useProfile();
  const { auth } = useAuth();
  const { texts } = useI18n();
  const router = useRouter();
  const lang = useLang();

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const theme = profile?.theme || 'light';
  const navbarConfig: NavbarConfig = texts?.components?.navbar;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = (path: string) => {
    router.push(href(lang, path));
    setMenuOpen(false);
  };

  if (!navbarConfig || !profile) return <NavbarSkeleton />;

  return (
    <NavbarView
      profile={profile}
      auth={auth}
      navbarConfig={navbarConfig}
      theme={theme}
      isMobile={isMobile}
      menuOpen={menuOpen}
      onToggleMenu={() => setMenuOpen(!menuOpen)}
      onNavigate={handleNavigate}
      onCloseMenu={() => setMenuOpen(false)}
    />
  );
}
