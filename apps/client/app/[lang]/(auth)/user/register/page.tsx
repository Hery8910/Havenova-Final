'use client';
import { useState } from 'react';
import styles from '../userAuth.module.css';
import Link from 'next/link';
import { useClient } from '../../../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../../../packages/contexts/i18n/I18nContext';
import { RegisterFormData, RegisterPayload } from '../../../../../../../packages/types';
import { FormWrapper } from '../../../../../../../packages/components/client/user/auth';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackRegisterSuccess,
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
import Image from 'next/image';
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
  const { updateProfile } = useProfile();

  const { texts } = useI18n();
  const [loading, setLoading] = useState(false);

  const popups = texts.popups;
  const register: RegisterData = texts?.pages?.client.user.register;
  const navText = texts.components.client.navbar.accessibility;
  const formText = texts.components.client.form;
  const registerLoading = texts.loadings?.loading?.REGISTER_LOADING_SUBMIT ?? {
    title: 'Processing your registration…',
    description: 'Please wait a moment.',
  };
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const registerButton = formText.button.register;

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
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 400,
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

      // 4) success popup
      const popupData = getPopup(
        popups,
        response.code,
        'USER_REGISTER_SUCCESS',
        fallbackRegisterSuccess
      );

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
      const shouldStayOnPage =
        code === 'USER_REGISTER_NEEDS_CORRECT_PASSWORD' ||
        code === 'USER_REGISTER_ALREADY_REGISTERED' ||
        code === 'USER_EMAIL_ALREADY_REGISTERED' ||
        (err.response?.status ?? 500) < 500;
      const onConfirm =
        code === 'USER_REGISTER_ALREADY_REGISTERED' || code === 'USER_EMAIL_ALREADY_REGISTERED'
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
          status: err.response?.status ?? 500,
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
      className={styles.authSection}
      aria-labelledby="register-title"
      aria-describedby="register-description"
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
          <h1 id="register-title" className={styles.authTitle}>
            {register?.title || 'Create account'}
          </h1>
          <p id="register-description" className={styles.authDescription}>
            {register?.description || 'Create your account to request and manage services.'}
          </p>
        </div>
      </header>

      <div className={styles.authFormContainer}>
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
          </p>
          <Link className={`${styles.link} ${styles.mutedLink}`} href={href(lang, '/')}>
            <IoMdArrowRoundBack /> {navText.homeLink}
          </Link>
        </div>
      </footer>
    </section>
  );
};

export default Register;
