'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

import { useUser } from '@/packages/contexts/user/UserContext';
import { useClient } from '@/packages/contexts/client/ClientContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import { resetPasswordConfirm } from '@/packages/services/userService';

import { FormWrapper } from '@/packages/components/userForm';
import { AlertWrapper } from '@/packages/components/alert';
import Loading from '@/packages/components/loading/Loading';

export interface ResetPasswordData {
  title: string;
  info: string;
  button: string;
}
export interface accessDeniedText {
  title: string;
  description: string;
}

interface ResetPasswordFormData {
  password: string;
}

const ResetPassword = () => {
  const { user, setUser } = useUser();
  const { client } = useClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { texts } = useI18n();
  const formText = texts.components.form;
  const popups = texts.popups;
  const accessDenied: accessDeniedText = texts.message.accessDenied;
  const resetPasswordText: ResetPasswordData = texts.pages.user.resetPasswordText;

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

  const token = searchParams.get('token');
  const status = searchParams.get('status');
  const code = searchParams.get('code');
  const http = Number(searchParams.get('http')) || 200;

  useEffect(() => {
    if (!token) {
      setAlert({
        status: 403,
        title: accessDenied.title,
        description: accessDenied.description,
      });
      setTimeout(() => router.push('/'), 3000);
      return;
    }

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
    }
  }, [token, status, code, http, popups, router, texts.popups]);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      if (!token || !client?._id) {
        setAlert({
          status: 400,
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: 'Missing data or invalid link.',
        });
        return;
      }

      if (!data.password) {
        setAlert({
          status: 400,
          title: popups.USER_EDIT_EMPTY_NEW_PASSWORD.title,
          description: popups.USER_EDIT_EMPTY_NEW_PASSWORD.description,
        });
        return;
      }

      const payload = {
        token, // 🔑 viene de la URL
        newPassword: data.password,
        clientId: client._id,
      };

      const response = await resetPasswordConfirm(payload);

      if (response.success && response.user) {
        // ✅ Actualizar el contexto del usuario logueado automáticamente
        setUser({
          ...response.user,
          isLogged: true,
        });

        const popupData = popups?.[response.code] || {};
        setAlert({
          status: 200,
          title: popupData.title || popups.USER_PASSWORD_RESET_SUCCESS.title,
          description: popupData.description || popups.USER_PASSWORD_RESET_SUCCESS.description,
        });

        setTimeout(() => {
          setAlert(null);
          router.push('/');
        }, 3000);
      }
    } catch (error: any) {
      console.error('❌ Error resetting password:', error);
      if (error.response?.data) {
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
        <h1 className={styles.h1}>{resetPasswordText.title}</h1>
        <p className={styles.p}>* {resetPasswordText.info}</p>
      </header>

      <section className={`${styles.section} card`}>
        <FormWrapper<ResetPasswordFormData>
          fields={['password']}
          onSubmit={handleResetPassword}
          button={formText.button.resetPassword}
          initialValues={{ password: '' }}
        />
      </section>

      {loading && <Loading theme={user?.theme || 'light'} />}
      {alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}
    </main>
  );
};

export default ResetPassword;
