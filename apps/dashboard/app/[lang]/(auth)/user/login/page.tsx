'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  createLoggedOutAuthSeed,
  href,
  userAuthRoutes,
} from '../../../../../../../packages/utils';
import { LoginPayload } from '../../../../../../../packages/types';
import {
  AuthPageShell,
  FormWrapper,
} from '../../../../../../../packages/components/client/user/auth';
import styles from '../../../../../../../packages/components/client/user/auth/authShell/authShell.module.css';
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
  const { auth, loading: authLoading, setAuth, source, refreshAuth } = useAuth();
  const { texts, language, setLanguage } = useI18n();
  const router = useRouter();
  const lang = useLang();
  const hasDashboardAccess =
    auth?.isLogged && (auth.role === 'admin' || auth.role === 'super_admin');
  const canAutoRedirectToDashboard =
    !authLoading && source === 'server' && hasDashboardAccess;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme !== 'light' && storedTheme !== 'dark') return;
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  useEffect(() => {
    if (!canAutoRedirectToDashboard) return;
    router.replace(href(lang, '/'));
  }, [canAutoRedirectToDashboard, lang, router]);

  useEffect(() => {
    if (language !== lang) {
      setLanguage(lang);
    }
  }, [lang, language, setLanguage]);

  const popups = texts.popups;
  const alertButtons = popups.button ?? fallbackButtons;
  const formText = texts.components.client.form;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const login: LoginData = texts?.pages?.client.user.login;
  const dashboardAuthTexts = texts.components.dashboard?.auth?.login;
  const descriptionId = 'login-cta';
  const loginButton = formText.button.login;
  const authCopy = {
    title: dashboardAuthTexts?.title || login?.title || 'Sign in',
    description:
      dashboardAuthTexts?.description ||
      login?.description ||
      'Access your account and manage your profile.',
  };

  const syncSessionFromServer = async () => {
    for (const delayMs of [0, 250, 500]) {
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      try {
        const refreshed = await refreshAuth();
        if (refreshed.syncedFromServer) {
          return refreshed.auth;
        }
      } catch {}
    }

    return null;
  };

  const handleLogin = async (data: LoginPayload): Promise<boolean> => {
    try {
      setLoading(true);

      // 1) Loading
      const loadingData =
        loadingText.dashboardLogin ?? loadingText.login ?? fallbackLoadingMessages.login;

      const payload: LoginPayload = {
        email: data.email?.trim() || '',
        password: data.password || '',
        clientId: data.clientId || client?._id,
        language: lang,
      };

      showLoading({
        response: {
          status: 102,
          title: loadingData.title,
          description: loadingData.description,
        },
      });

      setEmail(payload.email);

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
            cancelLabel: alertButtons.close,
          },
          onCancel: closeAlert,
        });
        return false;
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
            cancelLabel: alertButtons.close,
          },
          onCancel: () => {
            closeAlert();
          },
        });
        return false;
      }

      if (response.code === 'USER_LOGIN_EMAIL_NOT_VERIFIED') {
        const popupData = getPopup(
          popups,
          response.code,
          'USER_LOGIN_EMAIL_NOT_VERIFIED',
          fallbackGlobalError
        );

        setAuth(
          createLoggedOutAuthSeed({
            clientId: payload.clientId,
            email: payload.email,
            isVerified: false,
          })
        );

        showError({
          response: {
            status: 200,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: alertButtons.close,
          },
          onCancel: closeAlert,
        });
        return false;
      }
      const { user } = response;

      const syncedUser = await syncSessionFromServer();
      setAuth(syncedUser ?? user);
      const finalUser = syncedUser ?? user;
      const canEnterDashboard =
        finalUser.isLogged && (finalUser.role === 'admin' || finalUser.role === 'super_admin');

      const popupData = getPopup(popups, response.code, 'USER_LOGIN_SUCCESS', fallbackLoginSuccess);

      showSuccess({
        response: {
          status: 200,
          title: popupData.title,
          description: popupData.description,
          cancelLabel: '',
        },
        onCancel: closeAlert,
      });

      setTimeout(() => {
        closeAlert();
        if (canEnterDashboard) {
          router.replace(href(lang, '/'));
          return;
        }

        router.replace(href(lang, userAuthRoutes.login));
      }, 3000);
      return true;
    } catch (err: any) {
      const code = err?.response?.data?.code;
      const status = err?.response?.status;

      const popupData = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);

      showError({
        response: {
          status: status ?? 500,
          title: popupData.title,
          description: popupData.description,
          cancelLabel: alertButtons.close,
        },
        onCancel: () => {
          closeAlert();
        },
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      headingId="login-title"
      descriptionId={descriptionId}
      title={authCopy.title}
      description={authCopy.description}
      homeHref={href(lang, '/')}
      homeLabel={texts.components.client.navbar.accessibility.homeLink}
      logoAlt={texts.components.client.navbar.accessibility.logoAlt}
      footerLabel={texts.components.client.navbar.accessibility.authFooter}
      footer={
        <div className={styles.authFooterActions}>
          <Link className={`${styles.link} ${styles.mutedLink}`} href={href(lang, '/')}>
            <IoMdArrowRoundBack /> {texts.components.client.navbar.accessibility.homeLink}
          </Link>
        </div>
      }
    >
      <FormWrapper<LoginPayload>
        fields={['email', 'password', 'clientId'] as const}
        onSubmit={handleLogin}
        button={loginButton}
        showForgotPassword
        onForgotPassword={() => {
          router.push(href(lang, userAuthRoutes.forgotPassword));
        }}
        initialValues={{
          clientId: client?._id ?? '',
          email,
          password: '',
        }}
        loading={loading}
      />
    </AuthPageShell>
  );
};

export default Login;
