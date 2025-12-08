'use client';
import { Suspense, useState } from 'react';
import styles from './page.module.css';
import { useClient } from '../../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../../packages/contexts/i18n/I18nContext';
import { forgotPassword } from '../../../../../../packages/services/profile/profileService';
import { useLang } from '../../../../../../packages/hooks';
import { useUser } from '../../../../../../packages/contexts/profile';
import { FormWrapper } from '../../../../../../packages/components/userForm';
import Loading from '../../../../../../packages/components/loading/Loading';
import { AlertWrapper } from '../../../../../../packages/components/alert';

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
  const { user } = useUser();
  const { client } = useClient();
  const { texts } = useI18n();
  const [loading, setLoading] = useState(false);
  const lang = useLang();

  const popups = texts.popups;
  const formText = texts.components.form;
  const forgotPasswordText: ForgotPasswordData = texts?.pages?.user.forgotPasswordText;
  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setLoading(true);

    try {
      if (!client?._id) {
        const popupData = popups?.INTERNAL_ERROR || {};
        setAlert({
          status: 500,
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          description: popupData.description || popups.GLOBAL_INTERNAL_ERROR.description,
        });
        return;
      }

      if (!data.email || !data.language || !data.clientId) {
        return;
      }

      const payload: ForgotPasswordFormData = {
        email: data.email || user?.email || '',
        language: user?.language || 'de',
        clientId: client._id,
      };

      const response = await forgotPassword(payload);

      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setAlert({
          status: 200,
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
          status: error.response.status,
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          description:
            popupData.description ||
            error.response.data.message ||
            popups.GLOBAL_INTERNAL_ERROR.description,
        });
      } else {
        setAlert({
          status: 500,
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.h1}>{forgotPasswordText.title}</h1>
        <p className={styles.p}>* {forgotPasswordText.info}</p>
      </header>
      <section className={`${styles.section} card`}>
        <FormWrapper<ForgotPasswordFormData>
          fields={['email']}
          onSubmit={handleForgotPassword}
          button={formText.button.forgotPassword}
          initialValues={{
            clientId: '',
            email: '',
            language: '',
          }}
        />
      </section>
      {loading && <Loading theme={user?.theme || 'light'} />}
      {alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}
    </main>
  );
};

export default ForgotPassword;
