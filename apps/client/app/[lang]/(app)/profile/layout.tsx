// app/profile/layout.tsx
import React from 'react';
import { Metadata } from 'next';
import { ProfileHeader } from '@/packages/components/client/user/profile/profileHeader/ProfileHeader';
import { ProfileNav } from '@/packages/components/client/user/profile/profileNav/ProfileNav';
import { getPageMetadata } from '@/packages/utils/metadata';
import styles from './layout.module.css';

export async function generateMetadata({
  params,
}: {
  params: { lang: 'de' | 'en' };
}): Promise<Metadata> {
  return getPageMetadata(params.lang, 'profile');
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.layout}>
      <header className={`${styles.header} glass-panel--base`}>
        <ProfileHeader />
      </header>
      <nav className={styles.nav} aria-label="Profile navigation">
        <ProfileNav />
      </nav>
      <section className={styles.section}>{children}</section>
    </main>
  );
}
