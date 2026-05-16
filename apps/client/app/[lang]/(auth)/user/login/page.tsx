'use client';
import { useEffect, useRef, useState } from 'react';
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
import { IoMdArrowRoundBack } from 'react-icons/io';
import { PopupCode } from '../../../../../../../packages/contexts/alert/alert.types';

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
  const AUTO_REDIRECT_MS = 4000;
  const { client } = useClient();
  const { auth, setAuth } = useAuth();
  const { texts } = useI18n();
  const router = useRouter();
  const lang = useLang();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const redirectTimeoutRef = useRef<number | null>(null);

  const popups = texts.popups;
  const formText = texts.components.client.form;
  const navText = texts.components.client.navbar.accessibility;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const login: LoginData = texts?.pages?.client.user.login;
  const loginButton = formText.button.login;

  const clearRedirectTimeout = () => {
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
  };

  const getAutoRedirectDescription = (baseDescription: string) => {
    const redirectCopy =
      lang === 'de'
        ? 'Sie werden in wenigen Sekunden zur Startseite weitergeleitet.'
        : lang === 'es'
          ? 'Serás redirigido a la página de inicio en unos segundos.'
          : 'You will be redirected to the homepage in a few seconds.';

    return `${baseDescription} ${redirectCopy}`.trim();
  };

  const scheduleHomeRedirect = () => {
    clearRedirectTimeout();
    redirectTimeoutRef.current = window.setTimeout(() => {
      closeAlert();
      router.push(href(lang, '/'));
    }, AUTO_REDIRECT_MS);
  };

  useEffect(() => {
    return () => {
      clearRedirectTimeout();
    };
  }, []);

  const getLoginPopupDefaultKey = (code?: string): PopupCode => {
    switch (code) {
      case 'CLIENT_MISSING_CLIENT_ID':
        return 'CLIENT_MISSING_CLIENT_ID';
      case 'AUTH_INVALID_CREDENTIALS':
        return 'AUTH_INVALID_CREDENTIALS';
      case 'USER_LOGIN_EMAIL_NOT_VERIFIED':
        return 'USER_LOGIN_EMAIL_NOT_VERIFIED';
      case 'USER_CLIENT_NOT_FOUND':
        return 'USER_CLIENT_NOT_FOUND';
      case 'CLIENT_NOT_FOUND':
        return 'CLIENT_NOT_FOUND';
      default:
        return 'GLOBAL_INTERNAL_ERROR';
    }
  };

  const getLoginFailureAction = (code?: string) => {
    switch (code) {
      case 'AUTH_INVALID_CREDENTIALS':
        return {
          status: 401,
          onConfirm: () => {
            closeAlert();
            router.push(href(lang, '/user/forgot-password'));
          },
        };
      case 'USER_CLIENT_NOT_FOUND':
        return {
          status: 404,
          onConfirm: () => {
            closeAlert();
            router.push(href(lang, '/user/register'));
          },
        };
      case 'CLIENT_NOT_FOUND':
        return {
          status: 404,
          onConfirm: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
        };
      default:
        return null;
    }
  };

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
          'CLIENT_MISSING_CLIENT_ID',
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
          clientId: payload.clientId,
          isVerified: false,
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
          getLoginPopupDefaultKey(response?.code),
          fallbackGlobalError
        );
        const failureAction = getLoginFailureAction(response?.code);
        const canRetry = !response?.code;
        const onConfirm =
          failureAction?.onConfirm ??
          (canRetry
            ? () => {
                closeAlert();
                void handleLogin(payload);
              }
            : undefined);

        showError({
          response: {
            status: failureAction?.status ?? (canRetry ? 500 : 400),
            title: popupData.title,
            description: popupData.description,
            confirmLabel:
              onConfirm
                ? (popupData.confirm ??
                  (canRetry
                    ? (popups.button?.reload ?? fallbackButtons.reload)
                    : (popups.button?.continue ?? fallbackButtons.continue)))
                : undefined,
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
          description: getAutoRedirectDescription(popupData.description),
          confirmLabel: popupData.confirm ?? popups.button?.continue ?? fallbackButtons.continue,
        },
        onConfirm: () => {
          clearRedirectTimeout();
          router.push(href(lang, '/'));
          closeAlert();
        },
      });
      scheduleHomeRedirect();
    } catch (error) {
      const err = error as { response?: { data?: { code?: string }; status?: number } };
      const code = err.response?.data?.code;

      const popupData = getPopup(
        popups,
        code,
        getLoginPopupDefaultKey(code),
        fallbackGlobalError
      );
      const canRetry = !code || (err.response?.status ?? 500) >= 500;
      const failureAction = getLoginFailureAction(code);
      const onConfirm =
        failureAction?.onConfirm ??
        (canRetry
          ? () => {
              closeAlert();
              void handleLogin(payload);
            }
          : undefined);

      showError({
        response: {
          status: failureAction?.status ?? (err.response?.status ?? 500),
          title: popupData.title,
          description: popupData.description,
          confirmLabel: onConfirm
            ? (popupData.confirm ??
              (canRetry
                ? (popups.button?.reload ?? fallbackButtons.reload)
                : (popups.button?.continue ?? fallbackButtons.continue)))
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
      className={`${styles.authSection} card card--primary`}
      aria-labelledby="login-title"
      aria-describedby="login-description"
    >
      <header className={styles.authHeader}>
        <h1 id="login-title" className={styles.authTitle}>
          {login.title || 'Sign in'}
        </h1>
        <p id="login-description" className={styles.authDescription}>
          {login.description || 'Access your account and manage your requests.'}
        </p>
      </header>

      <div className={styles.authFormContainer}>
        <FormWrapper<LoginPayload>
          fields={['email', 'password', 'clientId'] as const}
          onSubmit={handleLogin}
          button={loginButton}
          showForgotPassword
          onForgotPassword={() => {
            router.push(href(lang, '/user/forgot-password'));
          }}
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
