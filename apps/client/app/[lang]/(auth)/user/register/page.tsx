'use client';
import { useState } from 'react';
import styles from '../userAuth.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useClient } from '../../../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../../../packages/contexts/i18n/I18nContext';
import { RegisterFormData, RegisterPayload } from '../../../../../../../packages/types';
import { FormWrapper } from '../../../../../../../packages/components/client/user/auth';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackRegisterSuccess,
  useAuth,
  useGlobalAlert,
  useProfile,
} from '../../../../../../../packages/contexts';
import {
  loadCookiePrefs,
  getPrefsFromLocalStorage,
  defaultPrefs,
} from '../../../../../../../packages/utils/cookies/cookieStorage/cookieStorage';
import { getPopup } from '../../../../../../../packages/utils/alertType';
import { registerUser } from '../../../../../../../packages/services';
import { useLang } from '../../../../../../../packages/hooks';
import { useRouter } from 'next/navigation';
import { href } from '../../../../../../../packages/utils/navigation';
import { PopupCode } from '../../../../../../../packages/contexts/alert/alert.types';
import { IoMdArrowRoundBack } from 'react-icons/io';

export interface RegisterData {
  title: string;
  description: string;
  cta: { title: string; label: string; url: string };
  image?: { src: string; alt: string };
  backgroundImage?: string;
  button?: string;
}

const Register = () => {
  const router = useRouter();
  const lang = useLang();
  const { client } = useClient();
  const { auth, setAuth } = useAuth();
  const { updateProfile } = useProfile();

  const { texts } = useI18n();
  const [loading, setLoading] = useState(false);

  const popups = texts.popups;
  const register: RegisterData = texts?.pages?.client.user.register;
  const formText = texts.components.client.form;
  const navText = texts.components.client.navbar.accessibility;
  const registerLoading = texts.loadings?.loading?.REGISTER_LOADING_SUBMIT ?? {
    title: 'Processing your registration…',
    description: 'Please wait a moment.',
  };
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const registerButton = formText.button.register;

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

    setAuth({
      ...(auth || {}),
      email,
      clientId,
      isLogged: false,
      isVerified: false,
      role: auth?.role || 'guest',
    });

    showSuccess({
      response: {
        status: 200,
        title: popupData.title,
        description: popupData.description,
        confirmLabel: popupData.confirm ?? popups.button?.continue ?? fallbackButtons.continue,
      },
      onConfirm: () => {
        router.push(href(lang, '/user/verify-email'));
        closeAlert();
      },
    });
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
        language: data.language,
        clientId: client._id,
        tosAccepted: true,
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
            confirmLabel: popupData.confirm,
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onConfirm:
            response?.code === 'USER_REGISTER_ALREADY_REGISTERED'
              ? () => {
                  router.push(href(lang, '/user/login'));
                  closeAlert();
                }
              : response?.code === 'USER_REGISTER_NEEDS_CORRECT_PASSWORD'
                ? () => {
                    router.push(href(lang, '/user/forgot-password'));
                    closeAlert();
                  }
                : undefined,
          onCancel: closeAlert,
        });
        return;
      }

      // 3.1) Persist local profile data so it survives the verify-email flow
      const profileLanguage = data.language === 'en' ? 'en' : 'de';

      await updateProfile({
        language: profileLanguage,
      });

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
          ? () => {
              router.push(href(lang, '/user/login'));
              closeAlert();
            }
          : code === 'USER_REGISTER_NEEDS_CORRECT_PASSWORD'
            ? () => {
                router.push(href(lang, '/user/forgot-password'));
                closeAlert();
              }
            : (err.response?.status ?? 500) >= 500
              ? () => {
                  closeAlert();
                  void handleRegister(data);
                }
              : undefined;

      showError({
        response: {
          status: getRegisterErrorStatus(code, err.response?.status ?? 500),
          title: popupData.title,
          description: popupData.description,
          confirmLabel: onConfirm ? popupData.confirm : undefined,
          cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
        },
        onConfirm,
        onCancel: shouldStayOnPage
          ? closeAlert
          : () => {
              router.push(href(lang, '/'));
              closeAlert();
            },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`${styles.authSection} card card--primary`}
      aria-labelledby="register-title"
      aria-describedby="register-description"
    >
      <Link className={styles.authBrand} href={href(lang, '/')} aria-label={navText.homeLink}>
        <Image
          className={styles.authBrandImage}
          src="/logos/logo-horizontal.png"
          alt={navText.logoAlt}
          width={800}
          height={200}
          priority
        />
      </Link>
      <div className={styles.authFormContainer}>
        <header className={styles.authHeader}>
          <h1 id="register-title" className={styles.authTitle}>
            {register?.title || 'Create account'}
          </h1>
          <p id="register-description" className={styles.authDescription}>
            {register?.description || 'Create your account to request and manage services.'}
          </p>
        </header>

        <FormWrapper<RegisterFormData>
          showHintPassword
          fields={['email', 'password', 'language', 'clientId', 'tosAccepted'] as const}
          onSubmit={handleRegister}
          button={registerButton}
          initialValues={{
            email: '',
            password: '',
            tosAccepted: false,
            language: '',
            clientId: '',
          }}
          loading={loading}
        />
      </div>

      <footer className={styles.authFooter}>
        <div className={styles.authFooterActions}>
          <p className={styles.authFooterText}>
            {register?.cta.title}{' '}
            <Link className={styles.link} href={register?.cta.url}>
              {register?.cta.label}
            </Link>
            <Link className={`${styles.link} ${styles.mutedLink}`} href={href(lang, '/')}>
              <IoMdArrowRoundBack /> {navText.homeLink}
            </Link>
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Register;
