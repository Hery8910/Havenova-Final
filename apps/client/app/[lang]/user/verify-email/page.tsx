'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser } from '../../../../../../packages/contexts/user/UserContext';
import { useClient } from '../../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../../packages/contexts/i18n/I18nContext';

import styles from './page.module.css';
import { resendVerificationEmail } from '../../../../../../packages/services/user/userService';
import {
  ResendVerificationEmailPayload,
  VerifyEmailPayload,
} from '../../../../../../packages/types';
import { useLang } from '../../../../../../packages/hooks';
import { href } from '../../../../../../packages/utils/navigation';
import { FormWrapper } from '../../../../../../packages/components/userForm';
import Loading from '../../../../../../packages/components/loading/Loading';
import { AlertWrapper } from '../../../../../../packages/components/alert';

export interface VerifyEmailData {
  title: string;
  info: string;
}

const VerifyEmail = () => {
  const { user, refreshUser } = useUser();
  const { client } = useClient();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const lang = useLang();

  const status = searchParams.get('status');
  const code = searchParams.get('code');
  const http = Number(searchParams.get('http')) || 200;

  const router = useRouter();
  const { texts } = useI18n();
  const popups = texts.popups;
  const formText = texts.components.form;
  const verifyEmail: VerifyEmailData = texts?.pages?.user.verifyEmail;

  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (!status) return;

    if (status === 'error') {
      const popupData = popups?.[code || 'GLOBAL_INTERNAL_ERROR'] || {};
      setAlert({
        status: http || 400,
        title: popupData.title || 'Error',
        description:
          popupData.description ||
          texts.popups.GLOBAL_INTERNAL_ERROR.description ||
          'Invalid or expired link.',
      });
      setTimeout(() => router.push('/'), 3000);
      return;
    }

    // ✅ Solo para status=success
    const popupData = popups?.[code || 'USER_REGISTER_SUCCESS'] || {};
    setAlert({
      status: http || 200,
      title: popupData.title || texts.popups.USER_REGISTER_SUCCESS.title,
      description:
        popupData.description ||
        texts.popups.USER_REGISTER_SUCCESS.description ||
        'Bitte überprüfen Sie Ihre E-Mails, um Ihre Adresse zu bestätigen und Ihr Konto zu aktivieren.',
    });

    setTimeout(async () => {
      setAlert(null);
      if (!user?.isVerified) {
        await refreshUser(); // 👈 actualiza el contexto solo si aún no está verificado
      }
      router.push(href(lang, '/'));
    }, 3000);
  }, [status, code, http, user?.isVerified]);

  const handleResendEmail = async (data: ResendVerificationEmailPayload) => {
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

      const payload: ResendVerificationEmailPayload = {
        email: data.email || user?.email || '',
        language: user?.language || 'de',
        clientId: client._id,
      };

      const response = await resendVerificationEmail(payload);

      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setAlert({
          status: 200,
          title: popupData.title || popups.EMAIL_VERIFICATION_RESENT.title,
          description: popupData.description || response.message,
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
        <h1 className={styles.h1}>{verifyEmail.title}</h1>
        <p className={styles.p}>* {verifyEmail.info}</p>
      </header>
      <section className={`${styles.section} card`}>
        <FormWrapper<ResendVerificationEmailPayload>
          fields={['email']}
          onSubmit={handleResendEmail}
          button={formText.button.resendEmail}
          initialValues={{
            clientId: '',
            email: '',
            language: '',
          }}
        />
      </section>
      {loading && <Loading theme={user?.theme || 'light'} />}
    </main>
  );
};

export default VerifyEmail;
