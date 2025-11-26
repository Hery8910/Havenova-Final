'use client';
import { useState } from 'react';
import { registerUser } from '../../../../../../packages/services/user/userService';
import styles from './page.module.css';
import Link from 'next/link';
import { useClient } from '../../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../../packages/contexts/i18n/I18nContext';
import { RegisterPayload } from '../../../../../../packages/types';
import { useUser } from '../../../../../../packages/contexts/user/UserContext';
import { FormWrapper } from '../../../../../../packages/components/userForm';
import { useGlobalAlert } from '../../../../../../packages/contexts';
import {
  loadCookiePrefs,
  getPrefsFromLocalStorage,
  defaultPrefs,
} from '../../../../../../packages/utils/cookies/cookieStorage/cookieStorage';

export interface RegisterData {
  tilte: string;
  description: string;
  cta: { title: string; label: string; url: string };
  image: { src: string; alt: string };
  backgroundImage: string;
  button: string;
}

const Register = () => {
  const { client } = useClient();
  const { user } = useUser();
  const { texts } = useI18n();
  const [loading, setLoading] = useState(false);

  const popups = texts.popups;
  const register: RegisterData = texts?.pages?.user.register;
  const formText = texts.components.form;
  const { showError, showSuccess, closeAlert } = useGlobalAlert();

  const handleRegister = async (data: RegisterPayload) => {
    setLoading(true);

    try {
      if (!client?._id || !user) {
        showError({
          response: {
            status: 500,
            title: popups?.GLOBAL_INTERNAL_ERROR.title || 'Unerwarteter Fehler.',
            description:
              popups?.GLOBAL_INTERNAL_ERROR.description ||
              'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support.',
            cancelLabel: popups?.button.close || 'Schließen',
          },
          onCancel: closeAlert,
        });

        return;
      }

      const storedPrefs = loadCookiePrefs() ?? getPrefsFromLocalStorage() ?? defaultPrefs();

      if (!data.tosAccepted) {
        showError({
          response: {
            status: 400,
            title: popups?.USER_TOS_NOT_ACCEPTED?.title || 'Bedingungen nicht akzeptiert',
            description:
              popups?.USER_TOS_NOT_ACCEPTED?.description ||
              'Bitte akzeptieren Sie die AGB und die Datenschutzerklärung, um fortzufahren.',
            cancelLabel: popups?.button.close || 'Schließen',
          },
          onCancel: closeAlert,
        });
        return;
      }

      const payload: RegisterPayload = {
        name: data.name || '',
        email: data.email || '',
        password: data.password || '',
        language: data.language || user.language,
        clientId: client._id,
        tosAccepted: true,
        cookiePrefs: storedPrefs,
      };

      if (!payload.clientId || !payload.language) {
        showError({
          response: {
            status: 500,
            title: popups?.GLOBAL_INTERNAL_ERROR.title || 'Unerwarteter Fehler.',
            description:
              popups?.GLOBAL_INTERNAL_ERROR.description ||
              'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support.',
            cancelLabel: popups?.button.close || 'Schließen',
          },
          onCancel: closeAlert,
        });
        return;
      }
      if (!payload.email) {
        showError({
          response: {
            status: 500,
            title: popups?.USER_EMAIL_EMPTY.title || 'E-Mail erforderlich',
            description:
              popups?.USER_EMAIL_EMPTY.description ||
              'Bitte geben Sie Ihre E-Mail-Adresse ein, um das Zurücksetzen des Passworts zu starten.',
            cancelLabel: popups?.button.close || 'Schließen',
          },
          onCancel: closeAlert,
        });
        return;
      }
      if (!payload.password) {
        showError({
          response: {
            status: 500,
            title: popups?.USER_PASSWORD_EMPTY.title || 'Neues Passwort fehlt.',
            description:
              popups?.USER_PASSWORD_EMPTY.description ||
              'Bitte geben Sie ein neues Passwort ein, um Ihr Konto zu aktualisieren.',
            cancelLabel: popups?.button.close || 'Schließen',
          },
          onCancel: closeAlert,
        });
        return;
      }

      const response = await registerUser(payload);
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        showSuccess({
          response: {
            status: 200,
            title: popupData.title || popups.USER_REGISTER_SUCCESS.title,
            description: popupData.description || popups.USER_REGISTER_SUCCESS.description,
            cancelLabel: popups.USER_REGISTER_SUCCESS.close,
          },
        });
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode;
        const popupData = popups?.[errorKey] || {};
        showError({
          response: {
            status: 500,
            title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
            description: popupData.description || popups.GLOBAL_INTERNAL_ERROR.description,
            cancelLabel: popupData.close,
          },
          onCancel: closeAlert,
        });
      } else {
        showError({
          response: {
            status: 500,
            title: popups.GLOBAL_INTERNAL_ERROR.title,
            description: popups.GLOBAL_INTERNAL_ERROR.description,
            cancelLabel: popups.popupData.close,
          },
          onCancel: closeAlert,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={`${styles.wrapper} card`}>
        <header className={styles.header}>
          <h1 className={styles.h1}>{register?.tilte}</h1>
          <p className={styles.header_p}>{register?.description}</p>
        </header>
        <section className={styles.section}>
          <FormWrapper<RegisterPayload>
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
