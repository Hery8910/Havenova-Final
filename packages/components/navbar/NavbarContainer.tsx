'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@havenova/contexts/user';
import { useI18n } from '@havenova/contexts/i18n';
import { href } from '@havenova/utils/navigation';
import { useLang } from '@havenova/hooks/useLang';
import { NavbarView } from './NavbarView';
import { NavbarConfig } from './NavbarView';
import { NavbarSkeleton } from './Navbar.skeleton';

export function NavbarContainer() {
  const { user } = useUser();
  const { texts } = useI18n();
  const router = useRouter();
  const lang = useLang();

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const theme = user?.theme || 'light';
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

  if (!navbarConfig || !user) return <NavbarSkeleton />;

  return (
    <NavbarView
      user={user}
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
