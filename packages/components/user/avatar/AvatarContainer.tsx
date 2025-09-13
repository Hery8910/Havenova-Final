'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@havenova/contexts/user';
import { AvatarView } from './AvatarView';
import { AvatarSkeleton } from './Avatar.skeleton';

export function AvatarContainer() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) refreshUser();
  }, [hasMounted, refreshUser]);

  useEffect(() => {
    if (!hasMounted) return;
    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasMounted]);

  if (!hasMounted || !user?.profileImage) {
    return <AvatarSkeleton />;
  }

  return (
    <AvatarView
      name={user.name}
      profileImage={user.profileImage}
      isMobile={isMobile}
      onNavigate={() => router.push('/user/profile')}
    />
  );
}
