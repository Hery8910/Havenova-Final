'use client';
import Image from 'next/image';
import styles from './Avatar.module.css';
import { useRouter } from 'next/navigation';
import { useAuth, useProfile } from '../../../contexts';
import { useState } from 'react';
import { useLang } from '../../../hooks';
import { useEffect } from 'react';
import { href } from '../../../utils';

export function AvatarView() {
  const router = useRouter();
  const { auth } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const lang = useLang();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className={styles.section}>
      {auth.isLogged ? (
        <button
          onClick={() => router.push(href(lang, '/user/profile'))}
          className={styles.button}
          aria-label={`Go to profile page`}
        >
          Profile
        </button>
      ) : (
        <>
          <button
            onClick={() => router.push(href(lang, '/user/register'))}
            className={styles.button}
            aria-label={`Go to Register`}
          >
            Register
          </button>
          <button
            onClick={() => router.push(href(lang, '/user/login'))}
            className={styles.button}
            aria-label={`Go to Login`}
          >
            Login
          </button>
        </>
      )}
    </section>
  );
}
