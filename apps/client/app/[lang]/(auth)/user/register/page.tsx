'use client';
import { useState } from 'react';
import Link from 'next/link';
import { RegisterFormData, RegisterPayload } from '../../../../../../../packages/types';
import {
  AuthPageShell,
  FormWrapper,
} from '../../../../../../../packages/components/client/user/auth';
import styles from '../../../../../../../packages/components/client/user/auth/authShell/authShell.module.css';
import {
  PopupCode,
  fallbackButtons,
  fallbackGlobalError,
  fallbackLoadingMessages,
  fallbackRegisterSuccess,
  useAuth,
  useClient,
  useGlobalAlert,
  useI18n,
  useProfile,
} from '../../../../../../../packages/contexts';
import {
  createLoggedOutAuthSeed,
  loadCookiePrefs,
  getPrefsFromLocalStorage,
  defaultPrefs,
} from '../../../../../../../packages/utils';
import { getPopup } from '../../../../../../../packages/utils/alertType';
import { registerUser } from '../../../../../../../packages/services';
import {
  useAuthAlertActions,
  useAuthAutoRedirect,
  useLang,
} from '../../../../../../../packages/hooks';
import { href } from '../../../../../../../packages/utils';
import { IoMdArrowRoundBack } from 'react-icons/io';

export interface RegisterData {
  title: string;
  description: string;
  cta: { title: string; label: string; url: string };
  autoRedirectDescription?: string;
  image?: { src: string; alt: string };
  backgroundImage?: string;
  button?: string;
}

const Register = () => {
  const lang = useLang();
  const verifyEmailHref = href(lang, '/user/verify-email');
  const homeHref = href(lang, '/');
  const { client } = useClient();
  const { setAuth } = useAuth();
  const { updateProfile } = useProfile();

  const { texts } = useI18n();
  const [loading, setLoading] = useState(false);

  const popups = texts.popups;
  const alertButtons = popups.button ?? fallbackButtons;
  const register: RegisterData = texts?.pages?.client.user.register;
  const formText = texts.components.client.form;
  const navText = texts.components.client.navbar.accessibility;
  const loadingMsg = texts.loadings?.message ?? fallbackLoadingMessages;
  const registerLoading = texts.loadings?.loading?.REGISTER_LOADING_SUBMIT ?? loadingMsg.login;
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const registerButton = formText.button.register;
  const { getAutoRedirectDescription, scheduleRedirect: scheduleVerifyRedirect } =
    useAuthAutoRedirect({
      redirectTo: verifyEmailHref,
      closeAlert,
    });
  const { getConfirmAction, getConfirmActionLabel, getCancelAction, getCancelActionLabel } =
    useAuthAlertActions({
      buttons: alertButtons,
      closeAlert,
    });

  const getRegisterErrorStatus = (code?: string, fallbackStatus = 500) => {
    switch (code) {
      case 'USER_REGISTER_NEEDS_CORRECT_PASSWORD':
      case 'USER_REGISTER_ALREADY_REGISTERED':
      case 'USER_EMAIL_ALREADY_IN_USE':
        return 409;
      case 'AUTH_BLOCKED':
      case 'USER_CLIENT_BLOCKED':
        return 403;
      case 'CLIENT_NOT_FOUND':
        return 404;
      case 'VALIDATION_ERROR':
        return 400;
      default:
        return fallbackStatus;
    }
  };

  const getRegisterPopupDefaultKey = (code?: string): PopupCode => {
    switch (code) {
      case 'USER_REGISTER_NEEDS_CORRECT_PASSWORD':
        return 'USER_REGISTER_NEEDS_CORRECT_PASSWORD';
      case 'USER_REGISTER_ALREADY_REGISTERED':
        return 'USER_REGISTER_ALREADY_REGISTERED';
      case 'USER_EMAIL_ALREADY_IN_USE':
        return 'USER_EMAIL_ALREADY_IN_USE';
      case 'AUTH_BLOCKED':
        return 'AUTH_BLOCKED';
      case 'USER_CLIENT_BLOCKED':
        return 'USER_CLIENT_BLOCKED';
      case 'CLIENT_NOT_FOUND':
        return 'CLIENT_NOT_FOUND';
      case 'VALIDATION_ERROR':
        return 'VALIDATION_ERROR';
      default:
        return 'GLOBAL_INTERNAL_ERROR';
    }
  };

  const openRegisterSuccess = (email: string, clientId: string) => {
    const popupData = getPopup(
      popups,
      'USER_REGISTER_SUCCESS',
      'USER_REGISTER_SUCCESS',
      fallbackRegisterSuccess
    );

    setAuth(
      createLoggedOutAuthSeed({
        clientId,
        email,
        isVerified: false,
      })
    );

    showSuccess({
      response: {
        status: 200,
        title: popupData.title,
        description: getAutoRedirectDescription(
          popupData.description,
          register.autoRedirectDescription
        ),
        cancelLabel: '',
      },
    });
    scheduleVerifyRedirect();
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setLoading(true);

      // 1) Loading
      showLoading({
        response: {
          status: 102,
          title: registerLoading.title,
          description: registerLoading.description,
        },
      });

      // 2) payload
      const storedPrefs = loadCookiePrefs() ?? getPrefsFromLocalStorage() ?? defaultPrefs();

      const payload: RegisterPayload = {
        email: data.email,
        password: data.password,
        language: data.language || lang || 'de',
        clientId: data.clientId || client._id,
        tosAccepted: data.tosAccepted,
        cookiePrefs: storedPrefs,
      };

      // 3) call backend
      const response = await registerUser(payload);

      if (!response?.success) {
        const popupData = getPopup(
          popups,
          response?.code,
          getRegisterPopupDefaultKey(response?.code),
          fallbackGlobalError
        );

        showError({
          response: {
            status: getRegisterErrorStatus(response?.code, 400),
            title: popupData.title,
            description: popupData.description,
            confirmLabel:
              response?.code === 'USER_REGISTER_ALREADY_REGISTERED' ||
              response?.code === 'USER_EMAIL_ALREADY_IN_USE'
                ? getConfirmActionLabel('goToLogin')
                : response?.code === 'USER_REGISTER_NEEDS_CORRECT_PASSWORD'
                  ? getConfirmActionLabel('resetPassword')
                  : undefined,
            cancelLabel: getCancelActionLabel(),
          },
          onConfirm:
            response?.code === 'USER_REGISTER_ALREADY_REGISTERED' ||
            response?.code === 'USER_EMAIL_ALREADY_IN_USE'
              ? getConfirmAction('goToLogin')
              : response?.code === 'USER_REGISTER_NEEDS_CORRECT_PASSWORD'
                ? getConfirmAction('resetPassword')
                : undefined,
          onCancel: getCancelAction(),
        });
        return;
      }

      // Best-effort local continuity: a profile persistence failure must not turn a
      // successful backend registration into a blocked flow.
      const profileLanguage =
        payload.language === 'en' || payload.language === 'es' ? payload.language : 'de';

      try {
        await updateProfile({
          language: profileLanguage,
        });
      } catch {
        // Registration already succeeded on the backend. Continue into verify-email
        // instead of surfacing a false-negative error for a local persistence issue.
      }

      // 4) success popup -> continue into verify-email flow
      openRegisterSuccess(payload.email, payload.clientId);
    } catch (error) {
      const err = error as { response?: { data?: { code?: string }; status?: number } };
      const code = err.response?.data?.code;

      const popupData = getPopup(
        popups,
        code,
        getRegisterPopupDefaultKey(code),
        fallbackGlobalError
      );
      const shouldStayOnPage =
        code === 'USER_REGISTER_NEEDS_CORRECT_PASSWORD' ||
        code === 'USER_REGISTER_ALREADY_REGISTERED' ||
        code === 'USER_EMAIL_ALREADY_IN_USE' ||
        (err.response?.status ?? 500) < 500;
      const onConfirm =
        code === 'USER_REGISTER_ALREADY_REGISTERED' || code === 'USER_EMAIL_ALREADY_IN_USE'
          ? getConfirmAction('goToLogin')
          : code === 'USER_REGISTER_NEEDS_CORRECT_PASSWORD'
            ? getConfirmAction('resetPassword')
            : (err.response?.status ?? 500) >= 500
              ? getConfirmAction('reload', () => void handleRegister(data))
              : undefined;

      showError({
        response: {
          status: getRegisterErrorStatus(code, err.response?.status ?? 500),
          title: popupData.title,
          description: popupData.description,
          confirmLabel:
            code === 'USER_REGISTER_ALREADY_REGISTERED' || code === 'USER_EMAIL_ALREADY_IN_USE'
              ? getConfirmActionLabel('goToLogin')
              : code === 'USER_REGISTER_NEEDS_CORRECT_PASSWORD'
                ? getConfirmActionLabel('resetPassword')
                : onConfirm
                  ? getConfirmActionLabel('reload')
                  : undefined,
          cancelLabel: shouldStayOnPage
            ? getCancelActionLabel()
            : getCancelActionLabel('goToHome'),
        },
        onConfirm,
        onCancel: shouldStayOnPage ? getCancelAction() : getCancelAction('goToHome'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      headingId="register-title"
      descriptionId="register-description"
      title={register?.title || 'Create account'}
      description={register?.description || 'Create your account to request and manage services.'}
      homeHref={homeHref}
      homeLabel={navText.homeLink}
      logoAlt={navText.logoAlt}
      footerLabel={navText.authFooter}
      footer={
        <div className={styles.authFooterActions}>
          <p className={styles.authFooterText}>
            {register?.cta.title}{' '}
            <Link className={styles.link} href={register?.cta.url}>
              {register?.cta.label}
            </Link>
          </p>
          <Link className={`${styles.link} ${styles.mutedLink}`} href={homeHref}>
            <IoMdArrowRoundBack /> {navText.homeLink}
          </Link>
        </div>
      }
    >
      <FormWrapper<RegisterFormData>
        showHintPassword
        fields={['email', 'password', 'language', 'clientId', 'tosAccepted'] as const}
        onSubmit={handleRegister}
        button={registerButton}
        initialValues={{
          email: '',
          password: '',
          tosAccepted: false,
          language: lang || 'de',
          clientId: client._id || '',
        }}
        loading={loading}
      />
    </AuthPageShell>
  );
};

export default Register;
