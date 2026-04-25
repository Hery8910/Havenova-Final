'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../userAuth.module.css';
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
} from '../../../../../../../packages/contexts';
import { getPopup } from '../../../../../../../packages/utils/alertType';
import { loginUser } from '../../../../../../../packages/services';
import { useLang } from '../../../../../../../packages/hooks';
import { LoginPayload } from '../../../../../../../packages/types';
import { href } from '../../../../../../../packages/utils';
import { FormWrapper } from '../../../../../../../packages/components/client/user/auth';
import Image from 'next/image';
import { IoMdArrowRoundBack } from 'react-icons/io';

export interface LoginData {
  title: string;
  description?: string;
  cta: { title: string; label: string; url: string };
  forgotPassword?: { title: string; label: string; url: string };
  image?: { src: string; alt: string };
  backgroundImage?: string;
  button?: string;
}

const Login = () => {
  const { client } = useClient();
  const { auth, setAuth } = useAuth();
  const { texts } = useI18n();
  const router = useRouter();
  const lang = useLang();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();

  const popups = texts.popups;
  const formText = texts.components.client.form;
  const navText = texts.components.client.navbar.accessibility;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const login: LoginData = texts?.pages?.client.user.login;
  const loginButton = formText.button.login;

  const handleLogin = async (data: LoginPayload) => {
    const payload: LoginPayload = {
      email: data.email?.trim() || '',
      password: data.password || '',
      clientId: data.clientId || client._id,
      language: lang,
    };

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

      if (!payload.clientId) {
        const popupData = getPopup(
          popups,
          'CLIENT_MISSING_CLIENT_ID',
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onCancel: closeAlert,
        });
        return;
      }

      const response = await loginUser(payload);

      if (response.code === 'USER_LOGIN_EMAIL_NOT_VERIFIED') {
        const popupData = getPopup(
          popups,
          response.code,
          'USER_LOGIN_EMAIL_NOT_VERIFIED',
          fallbackGlobalError
        );

        setAuth({
          ...(auth || {}),
          isLogged: false,
          email: payload.email,
        });

        showError({
          response: {
            status: 403,
            title: popupData.title,
            description: popupData.description,
            confirmLabel: popupData.confirm ?? popups.button?.continue ?? fallbackButtons.continue,
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onConfirm: () => {
            router.push(href(lang, '/user/verify-email'));
            closeAlert();
          },
          onCancel: closeAlert,
        });
        return;
      }

      if (!response?.user) {
        const popupData = getPopup(
          popups,
          response?.code,
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );
        const onConfirm =
          response?.code === 'USER_LOGIN_INVALID_PASSWORD'
            ? () => {
                closeAlert();
                router.push(href(lang, '/user/forgot-password'));
              }
            : response?.code === 'USER_LOGIN_USER_NOT_FOUND'
              ? () => {
                  closeAlert();
                  router.push(href(lang, '/user/register'));
                }
              : () => {
                  closeAlert();
                  void handleLogin(payload);
                };

        showError({
          response: {
            status:
              response?.code === 'USER_LOGIN_USER_NOT_FOUND'
                ? 404
                : response?.code === 'USER_LOGIN_INVALID_PASSWORD'
                  ? 401
                  : 500,
            title: popupData.title,
            description: popupData.description,
            confirmLabel:
              popupData.confirm ??
              (response?.code ? popups.button?.continue ?? fallbackButtons.continue : popups.button?.reload ?? fallbackButtons.reload),
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onConfirm,
          onCancel: closeAlert,
        });
        return;
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
    } catch (error) {
      const err = error as { response?: { data?: { code?: string }; status?: number } };
      const code = err.response?.data?.code;

      const popupData = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
      const canRetry = !code || (err.response?.status ?? 500) >= 500;
      const onConfirm =
        code === 'USER_LOGIN_INVALID_PASSWORD'
          ? () => {
              closeAlert();
              router.push(href(lang, '/user/forgot-password'));
            }
          : code === 'USER_LOGIN_USER_NOT_FOUND'
            ? () => {
                closeAlert();
                router.push(href(lang, '/user/register'));
              }
            : canRetry
              ? () => {
                  closeAlert();
                  void handleLogin(payload);
                }
              : undefined;

      showError({
        response: {
          status: err.response?.status ?? 500,
          title: popupData.title,
          description: popupData.description,
          confirmLabel: onConfirm
            ? popupData.confirm ??
              (canRetry ? popups.button?.reload ?? fallbackButtons.reload : undefined)
            : undefined,
          cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
        },
        onConfirm,
        onCancel: closeAlert,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={styles.authSection}
      aria-labelledby="login-title"
      aria-describedby="login-description"
    >
      <header className={styles.authHeader}>
        <Image
          className={styles.logoImage}
          src={'/logos/vertical-logo-auth.webp'}
          alt="Havenova Logo"
          width={100}
          height={100}
          priority
        />

        <div className={styles.authHeaderText}>
          <h1 id="login-title" className={styles.authTitle}>
            {login.title || 'Sign in'}
          </h1>
          <p id="login-description" className={styles.authDescription}>
            {login.description || 'Access your account and manage your requests.'}
          </p>
        </div>
      </header>

      <div className={styles.authFormContainer}>
        <FormWrapper<LoginPayload>
          fields={['email', 'password', 'clientId'] as const}
          onSubmit={handleLogin}
          button={loginButton}
          showForgotPassword
          initialValues={{
            clientId: client._id,
            email,
            password: '',
          }}
          loading={loading}
        />
      </div>

      <footer className={styles.authFooter}>
        <div className={styles.authFooterActions}>
          <p className={styles.authFooterText}>
            {login.cta.title}{' '}
            <Link className={styles.link} href={login.cta.url}>
              {login.cta.label}
            </Link>
          </p>
          <Link className={`${styles.link} ${styles.mutedLink}`} href={href(lang, '/')}>
            <IoMdArrowRoundBack /> {navText.homeLink}
          </Link>
        </div>
      </footer>
    </section>
  );
};

export default Login;
