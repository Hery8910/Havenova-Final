'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/packages/contexts/profile';
import { AvatarView } from './AvatarView';
import { AvatarSkeleton } from './Avatar.skeleton';
import { href } from '../../../utils/navigation';
import { useLang } from '../../../hooks/useLang';

export function AvatarContainer() {
  const router = useRouter();
  const { profile } = useProfile();
  const [isMobile, setIsMobile] = useState(false);
  const lang = useLang();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!profile.name || !profile.profileImage) {
    return <AvatarSkeleton />;
  }

  return (
    <AvatarView
      name={profile.name}
      profileImage={profile.profileImage}
      isMobile={isMobile}
      onNavigate={() => router.push(href(lang, '/user/profile'))}
    />
  );
}
