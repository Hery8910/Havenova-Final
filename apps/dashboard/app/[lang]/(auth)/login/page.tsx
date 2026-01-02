'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackLoadingMessages,
  fallbackLoginSuccess,
  useAuth,
  useClient,
  useGlobalAlert,
  useI18n,
  useProfile,
} from '../../../../../../packages/contexts';
import { getPopup } from '../../../../../../packages/utils/alertType';
import { loginUser } from '../../../../../../packages/services';
import { useLang } from '../../../../../../packages/hooks';
import { href } from '../../../../../../packages/utils';
import { LoginPayload } from '../../../../../../packages/types';
import { FormWrapper } from '../../../../../../packages/components';

export interface LoginData {
  title: string;
  cta: { title: string; label: string; url: string };
  forgotPassword?: { title: string; label: string; url: string };
  image?: { src: string; alt: string };
  backgroundImage?: string;
  button?: string;
}

const Login = () => {
  const { client } = useClient();
  const { auth, setAuth } = useAuth();
  const { texts, language, setLanguage } = useI18n();
  const { profile } = useProfile();
  const router = useRouter();
  const lang = useLang();
  const isLoggedIn = auth?.isLogged && auth.role !== 'guest';
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();

  useEffect(() => {
    if (!profile?.theme) return;
    document.documentElement.setAttribute('data-theme', profile.theme);
    localStorage.setItem('theme', profile.theme);
  }, [profile?.theme]);

  useEffect(() => {
    if (!profile?.language) return;
    const nextLang = profile.language === 'en' ? 'en' : 'de';

    if (!isLoggedIn) {
      if (nextLang !== lang) {
        router.replace(href(nextLang, '/login'));
        return;
      }

      if (language !== nextLang) {
        setLanguage(nextLang);
      }
      return;
    }

    if (language !== nextLang) {
      setLanguage(nextLang);
    }
  }, [profile?.language, lang, language, router, setLanguage, isLoggedIn]);

  const popups = texts.popups;
  const formText = texts.components.client.form;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const login: LoginData = texts?.pages?.client.user.login;
  const descriptionId = 'login-cta';
  const loginButton = formText.button.login;

  const handleLogin = async (data: LoginPayload) => {
    try {
      setLoading(true);

      // 1) Loading
      const loadingData = loadingText.login ?? fallbackLoadingMessages.login;

      showLoading({
        response: {
          status: 102,
          title: loadingData.title,
          description: loadingData.description,
        },
      });

      setEmail(data.email);

      const payload: LoginPayload = {
        email: data.email?.trim() || '',
        password: data.password || '',
        clientId: data.clientId || client._id,
      };

      if (!payload.email || !payload.password || !payload.clientId) {
        const popupData = getPopup(
          popups,
          'GLOBAL_INTERNAL_ERROR',
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close,
          },
          onCancel: closeAlert,
        });
        return;
      }

      const response = await loginUser(payload);
      if (!response?.user) {
        const popupData = getPopup(
          popups,
          'GLOBAL_INTERNAL_ERROR',
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 500,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close,
          },
          onCancel: () => {
            closeAlert();
          },
        });
      }
      const { user } = response;

      setAuth({
        ...(auth || {}), // conservas language, theme, etc. si ya existían
        isLogged: true,
        userId: user.userId,
        clientId: user.clientId,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      });

      const popupData = getPopup(popups, response.code, 'USER_LOGIN_SUCCESS', fallbackLoginSuccess);

      showSuccess({
        response: {
          status: 200,
          title: popupData.title,
          description: popupData.description,
          confirmLabel: popupData.confirm ?? popups.button?.continue ?? fallbackButtons.continue,
          cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
        },
        onConfirm: () => {
          router.push(href(lang, '/'));
          closeAlert();
        },
        onCancel: () => {
          router.push(href(lang, '/'));
          closeAlert();
        },
      });
    } catch (err: any) {
      const code = err?.response?.data?.code; // FIXED

      const popupData = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);

      showError({
        response: {
          status: 500,
          title: popupData.title,
          description: popupData.description,
          cancelLabel: popupData.close,
        },
        onCancel: () => {
          closeAlert();
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={styles.main}
      aria-labelledby="login-title"
      aria-describedby={login?.cta?.title ? descriptionId : undefined}
    >
      <div className={`${styles.wrapper} card`} role="region" aria-labelledby="login-title">
        <header className={styles.header}>
          <h1 id="login-title" className={styles.h1}>
            {login.title}
          </h1>
        </header>
        <section className={styles.section}>
          <FormWrapper<LoginPayload>
            fields={['email', 'password', 'clientId'] as const}
            onSubmit={handleLogin}
            button={loginButton}
            showForgotPassword
            initialValues={{
              clientId: '',
              email,
              password: '',
            }}
            loading={loading}
          />
          <aside className={styles.aside}>
            <p id={descriptionId} className={styles.header_p}>
              {login.cta.title}
            </p>
            <Link className={styles.link} href={login.cta.url}>
              {login.cta.label}
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default Login;
