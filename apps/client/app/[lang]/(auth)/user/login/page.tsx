'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../userAuth.module.css';
import Link from 'next/link';
import {
  PopupCode,
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
import { createLoggedOutAuthSeed, href } from '../../../../../../../packages/utils';
import { FormWrapper } from '../../../../../../../packages/components/client/user/auth';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { AuthPageShell } from '../AuthPageShell';
import { useAuthAutoRedirect } from '../useAuthAutoRedirect';
import { useAuthAlertActions } from '../useAuthAlertActions';

export interface LoginData {
  title: string;
  description?: string;
  autoRedirectDescription?: string;
  cta: { title: string; label: string; url: string };
  forgotPassword?: { title: string; label: string; url: string };
  image?: { src: string; alt: string };
  backgroundImage?: string;
  button?: string;
}

const Login = () => {
  const { client } = useClient();
  const { setAuth } = useAuth();
  const { texts } = useI18n();
  const router = useRouter();
  const lang = useLang();
  const homeHref = href(lang, '/');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();

  const popups = texts.popups;
  const alertButtons = popups.button ?? fallbackButtons;
  const formText = texts.components.client.form;
  const navText = texts.components.client.navbar.accessibility;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const login: LoginData = texts?.pages?.client.user.login;
  const loginButton = formText.button.login;
  const { getAutoRedirectDescription, scheduleRedirect: scheduleHomeRedirect } =
    useAuthAutoRedirect({
      redirectTo: homeHref,
      closeAlert,
    });
  const { getConfirmAction, getConfirmActionLabel, getCancelAction, getCancelActionLabel } =
    useAuthAlertActions({
      buttons: alertButtons,
      closeAlert,
    });

  const getLoginPopupDefaultKey = (code?: string): PopupCode => {
    switch (code) {
      case 'CLIENT_MISSING_CLIENT_ID':
        return 'CLIENT_MISSING_CLIENT_ID';
      case 'AUTH_INVALID_CREDENTIALS':
        return 'AUTH_INVALID_CREDENTIALS';
      case 'USER_CLIENT_NOT_FOUND':
        return 'USER_CLIENT_NOT_FOUND';
      case 'AUTH_BLOCKED':
        return 'AUTH_BLOCKED';
      case 'USER_LOGIN_EMAIL_NOT_VERIFIED':
        return 'USER_LOGIN_EMAIL_NOT_VERIFIED';
      case 'USER_CLIENT_BLOCKED':
        return 'USER_CLIENT_BLOCKED';
      case 'CLIENT_NOT_FOUND':
        return 'CLIENT_NOT_FOUND';
      default:
        return 'GLOBAL_INTERNAL_ERROR';
    }
  };

  const getLoginFailureAction = (code?: string) => {
    switch (code) {
      case 'USER_CLIENT_NOT_FOUND':
        return {
          status: 404,
          confirmKind: 'goToRegister' as const,
        };
      case 'CLIENT_NOT_FOUND':
        return {
          status: 404,
          confirmKind: 'goToHome' as const,
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
            cancelLabel: getCancelActionLabel(),
          },
          onCancel: getCancelAction(),
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

        setAuth(
          createLoggedOutAuthSeed({
            clientId: payload.clientId,
            email: payload.email,
            isVerified: false,
          })
        );

        showError({
          response: {
            status: 403,
            title: popupData.title,
            description: popupData.description,
            confirmLabel: getConfirmActionLabel('openVerification'),
            cancelLabel: getCancelActionLabel(),
          },
          onConfirm: getConfirmAction('openVerification'),
          onCancel: getCancelAction(),
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
          (failureAction?.confirmKind
            ? getConfirmAction(failureAction.confirmKind)
            : undefined) ??
          (canRetry ? getConfirmAction('reload', () => void handleLogin(payload)) : undefined);

        showError({
          response: {
            status: failureAction?.status ?? (canRetry ? 500 : 400),
            title: popupData.title,
            description: popupData.description,
            confirmLabel: onConfirm
              ? failureAction?.confirmKind
                ? getConfirmActionLabel(failureAction.confirmKind)
                : canRetry
                  ? getConfirmActionLabel('reload')
                  : alertButtons.continue
              : undefined,
            cancelLabel: getCancelActionLabel(),
          },
          onConfirm,
          onCancel: getCancelAction(),
        });
        return;
      }
      const { user } = response;

      setAuth(user);

      const popupData = getPopup(popups, response.code, 'USER_LOGIN_SUCCESS', fallbackLoginSuccess);

      showSuccess({
        response: {
          status: 200,
          title: popupData.title,
          description: getAutoRedirectDescription(
            popupData.description,
            login.autoRedirectDescription
          ),
          cancelLabel: '',
        },
      });
      scheduleHomeRedirect();
    } catch (error) {
      const err = error as { response?: { data?: { code?: string }; status?: number } };
      const code = err.response?.data?.code;

      const popupData = getPopup(popups, code, getLoginPopupDefaultKey(code), fallbackGlobalError);
      const canRetry = !code || (err.response?.status ?? 500) >= 500;
      const failureAction = getLoginFailureAction(code);
      const onConfirm =
        (failureAction?.confirmKind ? getConfirmAction(failureAction.confirmKind) : undefined) ??
        (canRetry ? getConfirmAction('reload', () => void handleLogin(payload)) : undefined);

      showError({
        response: {
          status: failureAction?.status ?? err.response?.status ?? 500,
          title: popupData.title,
          description: popupData.description,
          confirmLabel: onConfirm
            ? failureAction?.confirmKind
              ? getConfirmActionLabel(failureAction.confirmKind)
              : canRetry
                ? getConfirmActionLabel('reload')
                : alertButtons.continue
            : undefined,
          cancelLabel: getCancelActionLabel(),
        },
        onConfirm,
        onCancel: getCancelAction(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      headingId="login-title"
      descriptionId="login-description"
      title={login.title || 'Sign in'}
      description={login.description || 'Access your account and manage your requests.'}
      homeHref={homeHref}
      homeLabel={navText.homeLink}
      logoAlt={navText.logoAlt}
      footerLabel={navText.authFooter}
      footer={
        <div className={styles.authFooterActions}>
          <p className={styles.authFooterText}>
            {login.cta.title}{' '}
            <Link className={styles.link} href={login.cta.url}>
              {login.cta.label}
            </Link>
          </p>
          <Link className={`${styles.link} ${styles.mutedLink}`} href={homeHref}>
            <IoMdArrowRoundBack /> {navText.homeLink}
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
          router.push(href(lang, '/user/forgot-password'));
        }}
        initialValues={{
          clientId: client._id,
          email,
          password: '',
        }}
        loading={loading}
      />
    </AuthPageShell>
  );
};

export default Login;
