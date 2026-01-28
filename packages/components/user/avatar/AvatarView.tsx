'use client';
import styles from './Avatar.module.css';
import { useRouter } from 'next/navigation';
import { useAuth, useI18n } from '../../../contexts';
import { useLang } from '../../../hooks';
import { href } from '../../../utils';
import { CgProfile } from 'react-icons/cg';
import { useState } from 'react';

export interface AvatarViewProps {
  isMobile: boolean;
}

export function AvatarView({ isMobile }: AvatarViewProps) {
  const router = useRouter();
  const { auth } = useAuth();
  const { texts } = useI18n();
  const lang = useLang();
  const [open, setOpen] = useState(false);

  const avatarTexts = texts?.components?.client?.avatar;
  const navbarTexts = texts?.components?.client?.navbar;
  const profileLabel = avatarTexts?.profile?.label ?? navbarTexts?.profile?.label ?? 'Profile';
  const profileAria = avatarTexts?.profile?.ariaLabel ?? profileLabel;
  const registerLabel =
    avatarTexts?.register?.label ?? navbarTexts?.register?.[0]?.label ?? 'Register';
  const registerAria = avatarTexts?.register?.ariaLabel ?? registerLabel;
  const loginLabel = avatarTexts?.login?.label ?? navbarTexts?.register?.[1]?.label ?? 'Login';
  const loginAria = avatarTexts?.login?.ariaLabel ?? loginLabel;
  const handleNavigate = (path: string) => {
    setOpen(false);
    router.push(href(lang, path));
  };

  return (
    <section className={styles.section}>
      {auth.isLogged ? (
        <button
          type="button"
          onClick={() => handleNavigate('/profile')}
          className={`${styles.button} button`}
          aria-label={profileAria}
        >
          <CgProfile />
        </button>
      ) : (
        <aside className={styles.dropdown}>
          {isMobile ? (
            <div id="avatar-auth-menu" className={styles.buttons}>
              <button
                type="button"
                onClick={() => handleNavigate('/user/register')}
                className="button"
                aria-label={registerAria}
              >
                {registerLabel}
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('/user/login')}
                className="button_invert"
                aria-label={loginAria}
              >
                {loginLabel}
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={styles.icon}
                aria-label={profileAria}
                aria-expanded={open}
                aria-controls="avatar-auth-menu"
              >
                <CgProfile />
              </button>
              {open && (
                <ul id="avatar-auth-menu" className={`${styles.menu} card--glass`}>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/user/register')}
                      className={`${styles.button} button`}
                      aria-label={registerAria}
                    >
                      {registerLabel}
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('/user/login')}
                      className={`${styles.button} button_invert`}
                      aria-label={loginAria}
                    >
                      {loginLabel}
                    </button>
                  </li>
                </ul>
              )}
            </>
          )}
        </aside>
      )}
    </section>
  );
}
