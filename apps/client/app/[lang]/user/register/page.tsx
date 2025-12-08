'use client';
import { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import { useClient } from '@/packages/contexts/client/ClientContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import { RegisterFormData, RegisterPayload } from '@/packages/types';
import { FormWrapper } from '@/packages/components/userForm';
import {
  fallbackGlobalError,
  fallbackLoadingSubmit,
  fallbackRegisterSuccess,
  fallbackTosNotAccepted,
  useGlobalAlert,
} from '@/packages/contexts';
import {
  loadCookiePrefs,
  getPrefsFromLocalStorage,
  defaultPrefs,
} from '@/packages/utils/cookies/cookieStorage/cookieStorage';
import { getPopup } from '@/packages/utils/alertType';
import { registerUser } from '../../../../../../packages/services';

export interface RegisterData {
  title: string;
  description: string;
  cta: { title: string; label: string; url: string };
  image: { src: string; alt: string };
  backgroundImage: string;
  button: string;
}

const Register = () => {
  const { client } = useClient();
  const { texts } = useI18n();
  const [loading, setLoading] = useState(false);

  const popups = texts.popups;
  const register: RegisterData = texts?.pages?.user.register;
  const formText = texts.components.form;
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();

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
          confirmLabel: popupData.confirm,
        },
        onConfirm: closeAlert,
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
        onCancel: closeAlert,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={`${styles.wrapper} card`}>
        <header className={styles.header}>
          <h1 className={styles.h1}>{register?.title}</h1>
          <p className={styles.header_p}>{register?.description}</p>
        </header>
        <section className={styles.section}>
          <FormWrapper<RegisterFormData>
            showHintPassword
            fields={['name', 'email', 'password', 'language', 'clientId', 'tosAccepted']}
            onSubmit={handleRegister}
            button={formText.button.register}
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
