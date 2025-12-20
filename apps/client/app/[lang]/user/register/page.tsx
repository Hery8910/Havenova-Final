'use client';
import { useState } from 'react';
import styles from '../userAuth.module.css';
import Link from 'next/link';
import { useClient } from '@/packages/contexts/client/ClientContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import { ButtonProps } from '@/packages/components/common/button/Button';
import { RegisterFormData, RegisterPayload } from '@/packages/types';
import { FormWrapper } from '@/packages/components/user/userForm';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackLoadingSubmit,
  fallbackRegisterSuccess,
  fallbackTosNotAccepted,
  useGlobalAlert,
  useProfile,
} from '@/packages/contexts';
import {
  loadCookiePrefs,
  getPrefsFromLocalStorage,
  defaultPrefs,
} from '@/packages/utils/cookies/cookieStorage/cookieStorage';
import { getPopup } from '@/packages/utils/alertType';
import { registerUser } from '../../../../../../packages/services';
import { useLang } from '../../../../../../packages/hooks';
import { useRouter } from 'next/navigation';
import { href } from '../../../../../../packages/utils/navigation';
import Image from 'next/image';

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
  const { profile, updateProfile } = useProfile();

  const { texts } = useI18n();
  const [loading, setLoading] = useState(false);

  const popups = texts.popups;
  const register: RegisterData = texts?.pages?.user.register;
  const formText = texts.components.form;
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const registerButton = formText.button.register as ButtonProps;

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setLoading(true);

      // 1) Loading
      const loadingData = getPopup(
        popups,
        'REGISTER_LOADING_SUBMIT',
        'REGISTER_LOADING_SUBMIT',
        fallbackLoadingSubmit
      );

      showLoading({
        response: {
          status: 102,
          title: loadingData.title,
          description: loadingData.description,
        },
      });

      // 2) Validación mínima UX
      if (!data.tosAccepted) {
        const popupData = getPopup(
          popups,
          'USER_TOS_NOT_ACCEPTED',
          'USER_TOS_NOT_ACCEPTED',
          fallbackTosNotAccepted
        );

        return showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close,
          },
          onCancel: closeAlert,
        });
      }

      // 3) payload
      const storedPrefs = loadCookiePrefs() ?? getPrefsFromLocalStorage() ?? defaultPrefs();

      const payload: RegisterPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
        language: data.language,
        clientId: client._id,
        tosAccepted: true,
        cookiePrefs: storedPrefs,
        frontendUrl: process.env.NEXT_PUBLIC_BASE_URL!,
      };

      // 4) call backend
      const response = await registerUser(payload);

      // 4.1) Persist local profile data so it survives the verify-email flow
      await updateProfile({
        name: data.name,
        language: data.language || 'de',
      });

      // 5) success popup
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
          router.push(href(lang, '/'));
          closeAlert();
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main} aria-labelledby="register-title" aria-describedby="register-desc">
      <div className={`${styles.wrapper} card`} role="region" aria-labelledby="register-title">
        <header className={styles.header}>
          <h1 id="register-title" className={styles.h1}>
            {register?.title}
          </h1>
          <p id="register-desc" className={styles.header_p}>
            {register?.description}
          </p>
        </header>
        <section className={styles.section}>
          <FormWrapper<RegisterFormData>
            showHintPassword
            fields={['name', 'email', 'password', 'language', 'clientId', 'tosAccepted'] as const}
            onSubmit={handleRegister}
            button={registerButton}
            initialValues={{
              name: '',
              email: '',
              password: '',
              tosAccepted: false,
              language: '',
              clientId: '',
            }}
            loading={loading}
          />
          <aside className={styles.aside}>
            <p className={styles.header_p}>{register?.cta.title}</p>
            <Link className={styles.link} href={register?.cta.url}>
              {register?.cta.label}
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default Register;
