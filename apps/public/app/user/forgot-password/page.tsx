'use client';
import { Suspense, useState } from 'react';
import styles from './page.module.css';
import { useClient } from '../../../../../packages/contexts/ClientContext';
import { useI18n } from '../../../../../packages/contexts/I18nContext';
import UserContactForm from '../../../../../packages/components/Form/UserContactForm';
import { AlertPopup } from '../../../../../packages/components/alertPopup/AlertPopup';
import { forgotPassword } from '../../../../../packages/services/userService';

export interface ForgotPasswordData {
  title: string;
  info: string;
  button: string;
}

interface ForgotPasswordFormData {
  email: string;
  clientId: string;
  language: string;
}

const ForgotPassword = () => {
  const { client } = useClient();
  const { texts } = useI18n();
  const popups = texts.popups;
  const forgotPasswordText: ForgotPasswordData = texts?.pages?.user.forgotPasswordText;
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  const handleForgotPassword = async (formData: ForgotPasswordFormData) => {
    try {
      if (!client?._id) {
        setAlert({
          type: 'error',
          title: popups.CLIENT_MISSING_CLIENT_ID.title || 'Hoppla, etwas fehlt!',
          description:
            popups.CLIENT_MISSING_CLIENT_ID.description ||
            'Wir konnten Ihre Registrierung nicht verarbeiten, da einige Informationen fehlen. Bitte laden Sie die Seite neu oder kontaktieren Sie den Support.',
        });
        return;
      }
      if (!formData.email) {
        setAlert({
          type: 'error',
          title: popups.USER_FORGOT_PASSWORD_EMPTY_EMAIL.title || 'E-Mail erforderlich',
          description:
            popups.USER_FORGOT_PASSWORD_EMPTY_EMAIL.description ||
            'Bitte geben Sie Ihre E-Mail-Adresse ein, um das Zurücksetzen des Passworts zu starten.',
        });
        return;
      }
      const response = await forgotPassword(formData);
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setAlert({
          type: 'success',
          title: popupData.title || popups.USER_FORGOT_PASSWORD_EMAIL_SENDED.title,
          description:
            popupData.description || popups.USER_FORGOT_PASSWORD_EMAIL_SENDED.description,
        });
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode;
        const popupData = popups?.[errorKey] || {};
        setAlert({
          type: 'error',
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          description:
            popupData.description ||
            error.response.data.message ||
            popups.GLOBAL_INTERNAL_ERROR.description,
        });
      } else {
        setAlert({
          type: 'error',
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
      }
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <section className={styles.section}>
        <main className={styles.main}>
          <header className={`${styles.header} card`}>
            <h1 className={styles.h1}>{forgotPasswordText?.title}</h1>
            <p>{forgotPasswordText?.info}</p>
          </header>
          <aside className={styles.aside_form}>
            <UserContactForm
              fields={['email', 'clientId', 'language']}
              onSubmit={handleForgotPassword}
              mode="forgotPassword"
            />
          </aside>
        </main>
        {alert && (
          <AlertPopup
            type={alert.type}
            title={alert.title}
            description={alert.description}
            onClose={() => setAlert(null)}
          />
        )}
      </section>
    </Suspense>
  );
};

export default ForgotPassword;
