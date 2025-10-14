// app/profile/layout.tsx
import React, { ReactNode } from 'react';
import styles from './layout.module.css';
import { Metadata } from 'next';

import { userProfileMetadata } from '../../../pageMetadata';
import { Sidebar } from '@/packages/components/sidebar';

import { FaFolder } from 'react-icons/fa6';
import { IoSettingsSharp } from 'react-icons/io5';
import { FaUserEdit } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';

export const metadata: Metadata = userProfileMetadata;

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const userProfileNavItems = [
    { label: 'Profile', href: '/user/profile', icon: <IoSettingsSharp /> },
    { label: 'Edit', href: '/user/profile/edit', icon: <FaUserEdit /> },
    { label: 'Requests', href: '/user/profile/requests', icon: <FaFolder /> },
    {
      label: 'Notification',
      href: '/user/profile/notification',
      icon: <MdNotifications />,
    },
  ];
  return (
    <main className={styles.layout}>
      <Sidebar items={userProfileNavItems} context="user-profile" />
      {children}
    </main>
  );
}
