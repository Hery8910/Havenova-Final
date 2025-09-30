'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser } from '../../../../../../packages/contexts/user/UserContext';
import { useClient } from '../../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../../packages/contexts/i18n/I18nContext';
import AlertPopup from '../../../../../../packages/components/alert/alertPopup/AlertPopup';

import styles from './page.module.css';
import { resendVerificationEmail } from '../../../../../../packages/services/userService';
import MessageBox from '../../../../../../packages/components/messageBox/MessageBox';
// import UserContactForm from '../../../../../packages/components/Form/UserContactForm';
import { VerifyEmailPayload } from '../../../../../packages/types/User';

export interface VerifyEmailData {
  title: string;
  info: string;
  input: { button: string; placeholder: string; info: string };
}

const VerifyEmail = () => {
  const { user, setUser } = useUser();
  const { client } = useClient();
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { texts } = useI18n();
  const popups = texts.popups;
  const messages = texts.message.verifyEmail;
  const verifyEmail: VerifyEmailData = texts?.pages?.user.verifyEmail;
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  const [message, setMessage] = useState<{
    message: string;
    className: 'error' | 'info' | 'success';
  }>({ message: messages.alreadySend, className: 'success' });

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (!user?.isVerified) return;

        const popupData = popups?.USER_ALREADY_VERIFIED || {};
        setOpen(false);
        setAlert({
          type: 'success',
          title: popupData.title || 'Benutzer bereits bestätigt',
          description:
            popupData.description ||
            'Deine E-Mail war bereits bestätigt. Du bist jetzt eingeloggt und kannst Havenova uneingeschränkt verwenden.',
        });

        // NUEVO: lógica condicional por rol
        const redirectPath = user.role === 'worker' ? '/user/profile/edit' : '/';

        setTimeout(() => router.push(redirectPath), 3000);
      } catch (error: any) {
        const popupData = popups?.INTERNAL_ERROR || {};
        setAlert({
          type: 'error',
          title: popupData.title || 'Unerwarteter Fehler',
          description:
            popupData.description ||
            'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support.',
        });
      }
    };

    verifyUser();
  }, [
    router,
    setUser,
    user?.isVerified,
    user?.role,
    popups?.INTERNAL_ERROR,
    popups?.USER_ALREADY_VERIFIED,
  ]);

  const handleResendEmail = async (formData: VerifyEmailPayload) => {
    try {
      if (!client?._id) {
        const popupData = popups?.INTERNAL_ERROR || {};
        setAlert({
          type: 'error',
          title: popupData.title || 'Unerwarteter Fehler',
          description:
            popupData.description ||
            'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support.',
        });
        return;
      }
      if (!formData.email || !formData.language || !formData.clientId) {
        return;
      }
      const response = await resendVerificationEmail(formData);
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setAlert({
          type: 'success',
          title: popupData.title || 'Bestätigungs-E-Mail neue gesendet',
          description:
            popupData.description ||
            'Eine neue Bestätigungs-E-Mail wurde an deine Adresse gesendet. Bitte überprüfe dein Postfach.',
        });
      }
      setTimeout(() => {
        router.push('/user/verify-email');
      }, 3000);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode || error.response.data.code;
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

  if (!verifyEmail) {
    return (
      <section className={styles.section}>
        <div
          className={styles.skeleton}
          style={{ width: '100%', height: 504, background: '#eee' }}
        />
      </section>
    );
  }

  return (
    <main className={styles.main}>
      {/* <section className={styles.section}>
        <header className={styles.header}>
          <h1 className={styles.h1}>{verifyEmail.title}</h1>
        </header>
        {!open ? (
          <article className={styles.article}>
            <MessageBox message={message.message} className={message.className} />
            <button onClick={() => setOpen(true)} className={styles.link} type="button">
              {verifyEmail.info}
            </button>
          </article>
        ) : (
          <UserContactForm
            fields={['email', 'language', 'clientId']}
            onSubmit={handleResendEmail}
            mode="register"
          />
        )}
      </section>
      {alert && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onClose={() => setAlert(null)}
        />
      )} */}
    </main>
  );
};

export default VerifyEmail;
