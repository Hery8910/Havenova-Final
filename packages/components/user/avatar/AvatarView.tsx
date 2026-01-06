'use client';
import styles from './Avatar.module.css';
import { useRouter } from 'next/navigation';
import { useAuth, useI18n } from '../../../contexts';
import { useLang } from '../../../hooks';
import { href } from '../../../utils';

export function AvatarView() {
  const router = useRouter();
  const { auth } = useAuth();
  const { texts } = useI18n();
  const lang = useLang();

  const avatarTexts = texts?.components?.client?.avatar;
  const navbarTexts = texts?.components?.client?.navbar;
  const profileLabel = avatarTexts?.profile?.label ?? navbarTexts?.profile?.label ?? 'Profile';
  const profileAria = avatarTexts?.profile?.ariaLabel ?? profileLabel;
  const registerLabel =
    avatarTexts?.register?.label ?? navbarTexts?.register?.[0]?.label ?? 'Register';
  const registerAria = avatarTexts?.register?.ariaLabel ?? registerLabel;
  const loginLabel = avatarTexts?.login?.label ?? navbarTexts?.register?.[1]?.label ?? 'Login';
  const loginAria = avatarTexts?.login?.ariaLabel ?? loginLabel;

  return (
    <section className={styles.section}>
      {auth.isLogged ? (
        <button
          type="button"
          onClick={() => router.push(href(lang, '/profile'))}
          className={`${styles.button} button`}
          aria-label={profileAria}
        >
          {profileLabel}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => router.push(href(lang, '/user/register'))}
            className={`${styles.button} button`}
            aria-label={registerAria}
          >
            {registerLabel}
          </button>
          <button
            type="button"
            onClick={() => router.push(href(lang, '/user/login'))}
            className={`${styles.button} button_invert`}
            aria-label={loginAria}
          >
            {loginLabel}
          </button>
        </>
      )}
    </section>
  );
}
