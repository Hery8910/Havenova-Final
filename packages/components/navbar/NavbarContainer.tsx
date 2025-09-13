'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@havenova/contexts/user';
import { useI18n } from '@havenova/contexts/i18n';
import { NavbarView } from './NavbarView';
import { NavbarConfig } from './NavbarView';
import { NavbarSkeleton } from './Navbar.skeleton';

export function NavbarContainer() {
  const { user } = useUser();
  const { texts } = useI18n();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const theme = user?.theme || 'light';
  const navbarConfig: NavbarConfig | undefined = texts?.components?.navbar;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = (href: string) => {
    router.push(href);
    setMenuOpen(false);
  };

  if (!navbarConfig) return <NavbarSkeleton />;

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
