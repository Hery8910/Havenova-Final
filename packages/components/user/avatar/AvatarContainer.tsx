'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@havenova/contexts/user';
import { AvatarView } from './AvatarView';
import { AvatarSkeleton } from './Avatar.skeleton';
import { href } from '../../../utils/navigation';
import { useLang } from '../../../hooks/useLang';

export function AvatarContainer() {
  const router = useRouter();
  const { user } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const lang = useLang();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    return <AvatarSkeleton />;
  }

  return (
    <AvatarView
      name={user.name}
      profileImage={user.profileImage}
      isMobile={isMobile}
      onNavigate={() => router.push(href(lang, '/user/profile'))}
    />
  );
}
