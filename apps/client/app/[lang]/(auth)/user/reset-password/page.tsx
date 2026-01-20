'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useClient } from '@/packages/contexts/client/ClientContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import { fallbackButtons, fallbackGlobalError, fallbackGlobalLoading, useGlobalAlert } from '@/packages/contexts';
import { FormWrapper } from '@/packages/components/user/userForm';
import { getPopup } from '@/packages/utils/alertType';
import { resetPassword } from '@/packages/services';
import styles from '../userAuth.module.css';
import { href } from '../../../../../../../packages/utils/navigation';
import { useLang } from '../../../../../../../packages/hooks';

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
  clientId: string;
}

const ResetPassword = () => {
  const { client } = useClient();
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const router = useRouter();
  const lang = useLang();
  const searchParams = useSearchParams();

  const { texts } = useI18n();
  const formText = texts.components.client.form;
  const popups = texts.popups;
  // const accessDenied: accessDeniedText = texts.message.accessDenied;
  const resetPasswordText: ResetPasswordData = texts.pages.client.user.resetPasswordText;
  const resetButton = formText.button.resetPassword;

  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token');
  const status = searchParams.get('status');
  const code = searchParams.get('code');
  const http = Number(searchParams.get('http')) || 200;

  useEffect(() => {
    if (!token) {
      const popupData = getPopup(
        popups,
        'GLOBAL_INTERNAL_ERROR',
        'GLOBAL_INTERNAL_ERROR',
        fallbackGlobalError
      );

      showError({
        response: {
          status: 500,
          title: popupData.title,
          description: popupData.description,
          cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
        },
        onCancel: () => {
          closeAlert();
          router.push(href(lang, '/'));
        },
      });

      return;
    }

    if (status === 'error') {
      const popupData = getPopup(
        popups,
        code || undefined,
        'GLOBAL_INTERNAL_ERROR',
        fallbackGlobalError
      );

      showError({
        response: {
          status: http || 400,
          title: popupData.title,
          description:
            popupData.description ||
            texts.popups.GLOBAL_INTERNAL_ERROR.description ||
            'Invalid or expired link.',
          cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
        },
        onCancel: () => {
          closeAlert();
          router.push('/');
        },
      });
    }
  }, [
    token,
    status,
    code,
    http,
    popups,
    router,
    showError,
    closeAlert,
    lang,
    texts.popups.GLOBAL_INTERNAL_ERROR.description,
  ]);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setLoading(true);

    try {
      if (!token || !client?._id) {
        const popupData = getPopup(
          popups,
          'GLOBAL_INTERNAL_ERROR',
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description || 'Missing data or invalid link.',
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onCancel: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
        });
        return;
      }

      if (!data.password) {
        const popupData = getPopup(
          popups,
          'USER_EDIT_EMPTY_NEW_PASSWORD',
          'USER_EDIT_EMPTY_NEW_PASSWORD',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onCancel: closeAlert,
        });
        return;
      }

      const payload = {
        token,
        newPassword: data.password,
        clientId: client._id,
      };

      const loadingData = getPopup(
        popups,
        'GLOBAL_LOADING',
        'GLOBAL_LOADING',
        fallbackGlobalLoading
      );

      showLoading({
        response: {
          status: 102,
          title: loadingData.title,
          description: loadingData.description,
        },
      });

      const response = await resetPassword(payload);

      if (response.success) {
        const popupData = getPopup(
          popups,
          response.code,
          'USER_PASSWORD_RESET_SUCCESS',
          fallbackGlobalError
        );

        showSuccess({
          response: {
            status: 200,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onCancel: () => {
            closeAlert();
            router.push('/');
          },
        });
      }
    } catch (error) {
      const err = error as { response?: { data?: { code?: string }; status?: number } };
      const code = err.response?.data?.code;
      const popupData = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);

      showError({
        response: {
          status: err.response?.status ?? 500,
          title: popupData.title,
          description: popupData.description,
          cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main} aria-labelledby="reset-title" aria-describedby="reset-desc">
      <div className={`${styles.wrapper} card`} role="region" aria-labelledby="reset-title">
        <header className={styles.header}>
          <h1 id="reset-title" className={styles.h1}>
            {resetPasswordText.title}
          </h1>
          <p id="reset-desc" className={styles.header_p}>
            * {resetPasswordText.info}
          </p>
        </header>

        <section
          className={`${styles.section} card`}
          aria-labelledby="reset-title"
          aria-describedby="reset-desc"
          aria-busy={loading}
          role="form"
        >
          <FormWrapper<ResetPasswordFormData>
            fields={['password', 'clientId'] as const}
            onSubmit={handleResetPassword}
            button={resetButton}
            initialValues={{ password: '', clientId: client._id }}
            loading={loading}
          />
        </section>
      </div>
    </main>
  );
};

export default ResetPassword;
