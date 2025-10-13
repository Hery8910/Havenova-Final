'use client';
import { useUser } from '../../../../../../packages/contexts/user/UserContext';
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
    <section className={styles.section}>
      <header className={styles.header}>
        <h3 className={styles.h1}>
          {profile.greeting} {user.name}
        </h3>
        <p className={styles.header_p}>{profile.manageAccount}</p>
      </header>
      <main className={styles.main}>
        <article className={styles.article}>
          <Image
            src={user.profileImage}
            alt="Profile"
            width={100}
            height={100}
            className={styles.image}
          />
          <div className={styles.div}>
            <h3>{user.name}</h3>
            <h4>
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
      </main>
    </section>
  );
};

export default Profile;
