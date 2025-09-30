'use client';
import { Suspense, useState } from 'react';
import styles from './page.module.css';
import { useUser } from '../../../../../../packages/contexts/user/UserContext';
import { useClient } from '../../../../../../packages/contexts/client/ClientContext';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../../../../packages/contexts/i18n/I18nContext';
// import UserContactForm from '../../../../../packages/components/Form/UserContactForm';
import AlertPopup from '../../../../../../packages/components/alert/alertPopup/AlertPopup';
import { resetPassword } from '../../../../../../packages/services/userService';
import { useSearchParams } from 'next/navigation';

export interface ResetPasswordData {
  title: string;
  info: string;
  button: string;
}

interface ResetPasswordFormData {
  email: string;
  clientId: string;
  password: string;
}

const ResetPassword = () => {
  const { client } = useClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { texts } = useI18n();
  const popups = texts.popups;
  const resetPasswordText: ResetPasswordData = texts?.pages?.user.resetPasswordText;
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  const handleResetPassword = async (formData: ResetPasswordFormData) => {
    try {
      if (!token) {
        setAlert({
          type: 'error',
          title:
            popups.USER_VERIFY_INVALID_OR_EXPIRED_TOKEN.title ||
            'Ungültiger oder abgelaufener Link.',
          description:
            popups.USER_VERIFY_INVALID_OR_EXPIRED_TOKEN.description ||
            'Dein Bestätigungslink ist ungültig oder abgelaufen. Bitte fordere eine neue Bestätigungs-E-Mail an.',
        });
        return;
      }
      if (!client?._id) {
        setAlert({
          type: 'error',
          title: popups.GLOBAL_INTERNAL_ERROR.title || 'Unerwarteter Fehler.',
          description:
            popups.GLOBAL_INTERNAL_ERROR.description ||
            'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support.',
        });
        return;
      }
      if (!formData.password) {
        setAlert({
          type: 'error',
          title: popups.USER_EDIT_EMPTY_NEW_PASSWORD.title || 'Neues Passwort fehlt.',
          description:
            popups.USER_EDIT_EMPTY_NEW_PASSWORD.description ||
            'Bitte geben Sie ein neues Passwort ein, um Ihr Konto zu aktualisieren.',
        });
        return;
      }

      const payload = {
        ...formData,
        token,
      };
      const response = await resetPassword(payload);
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setAlert({
          type: 'success',
          title: popupData.title || popups.USER_EDIT_USER_UPDATE_SUCCESS.title,
          description: popupData.description || popups.USER_EDIT_USER_UPDATE_SUCCESS.description,
        });
        setTimeout(() => {
          setAlert(null);
          router.push('/');
        }, 3000);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode;
        const popupData = popups?.[errorKey] || {};
        setAlert({
          type: 'error',
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title || 'Unerwarteter Fehler.',
          description:
            popupData.description ||
            error.response.data.message ||
            popups.GLOBAL_INTERNAL_ERROR.description ||
            'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support.',
        });
      } else {
        setAlert({
          type: 'error',
          title: popups.GLOBAL_INTERNAL_ERROR.title || 'Unerwarteter Fehler.',
          description:
            popups.GLOBAL_INTERNAL_ERROR.description ||
            'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support.',
        });
      }
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <section className={styles.section}>
        {/* <main className={styles.main}>
          <header className={`${styles.header} card`}>
            <h1 className={styles.h1}>{resetPasswordText?.title}</h1>
            <p>{resetPasswordText?.info}</p>
          </header>
          <aside className={styles.aside_form}>
            <UserContactForm
              fields={['password', 'clientId', 'email']}
              onSubmit={handleResetPassword}
              mode="resetPassword"
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
        )} */}
      </section>
    </Suspense>
  );
};

export default ResetPassword;
