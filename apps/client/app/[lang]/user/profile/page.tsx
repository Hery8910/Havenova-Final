'use client';
import { useUser } from '../../../../../../packages/contexts/profile/ProfileContext';
import { useEffect, useState } from 'react';

import styles from './page.module.css';
import Image from 'next/image';
import { TbPointFilled } from 'react-icons/tb';
import { useI18n } from '../../../../../../packages/contexts/i18n/I18nContext';
import { useRouter } from 'next/navigation';

export interface ProfileData {
  greeting: string;
  manageAccount: string;
  memberSince: string;
  verified: string;
  notVerified: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  theme: {
    title: string;
    light: string;
    dark: string;
  };
  language: {
    title: string;
    lang: string;
  };
  notLoggedInTitle: string;
  notLoggedInText: string;
  loginButton: string;
}

const Profile = () => {
  const { user } = useUser();
  const { texts } = useI18n();
  const profile: ProfileData = texts?.pages?.user.profile;

  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'guest') {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return <p>Loading...</p>;

  if (user.role === 'guest') return null;

  return (
    <section className={`${styles.section} card`}>
      <header className={styles.header}>
        <h1 className={styles.h1}>
          {profile.greeting} {user.name}
        </h1>
        <p className={styles.header_p}>{profile.manageAccount}</p>
      </header>
      <article className={styles.article}>
        <Image
          src={user.profileImage}
          alt="Profile"
          width={70}
          height={70}
          className={styles.image}
        />
        <div className={styles.div}>
          <h2 className={styles.h2}>{user.name}</h2>
          <h4 className={styles.h4}>
            {profile.memberSince} {new Date(user.createdAt).toLocaleDateString()}
          </h4>
          <p
            className={styles.verified_p}
            style={!user.isVerified ? { color: '#fa4903' } : { color: '#00ad34' }}
          >
            {user.isVerified ? profile.verified : profile.notVerified}
            <TbPointFilled />
          </p>
        </div>
      </article>
      <table className={styles.table}>
        <tbody className={styles.tbody}>
          <tr className={styles.tr}>
            <th className={styles.th}>{profile.name}</th>
            <td className={styles.td}>{user.name}</td>
          </tr>
          <tr className={styles.tr}>
            <th className={styles.th}>{profile.address}</th>
            <td className={styles.td}>{user.address}</td>
          </tr>
          <tr className={styles.tr}>
            <th className={styles.th}>{profile.phone}</th>
            <td className={styles.td}>{user.phone}</td>
          </tr>
          <tr className={styles.tr}>
            <th className={styles.th}>{profile.email}</th>
            <td className={styles.td}>{user.email}</td>
          </tr>
          <tr className={styles.tr}>
            <th className={styles.th}>{profile.theme.title}</th>
            <td className={styles.td}>
              {user.theme === 'light' ? profile.theme.light : profile.theme.dark}
            </td>
          </tr>
          <tr className={styles.tr}>
            <th className={styles.th}>{profile.language.title}</th>
            <td className={styles.td}>{profile.language.lang}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default Profile;
