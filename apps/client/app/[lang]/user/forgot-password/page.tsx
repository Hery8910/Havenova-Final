'use client';
import { useState } from 'react';
import styles from './page.module.css';
import { useClient } from '@/packages/contexts/client/ClientContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import {
  fallbackButtons,
  fallbackForgotPasswordLoading,
  fallbackForgotPasswordSuccess,
  fallbackGlobalError,
  useAuth,
  useGlobalAlert,
  useProfile,
} from '@/packages/contexts';
import { useLang } from '@/packages/hooks';
import { FormWrapper } from '@/packages/components/userForm';
import { ButtonProps } from '@/packages/components/common/button/Button';
import { getPopup } from '@/packages/utils/alertType';
import { forgotPassword } from '@/packages/services';
import { ForgotPasswordPayload } from '@/packages/types';

export interface ForgotPasswordData {
  title: string;
  info: string;
  button: string;
}

const ForgotPassword = () => {
  const headingId = 'forgot-password-title';
  const descriptionId = 'forgot-password-description';
  const srOnly: React.CSSProperties = {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    border: 0,
  };

  const { client } = useClient();
  const { texts } = useI18n();
  const { auth } = useAuth();
  const { profile } = useProfile();
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();
  const [loading, setLoading] = useState(false);
  const lang = useLang();

  const popups = texts.popups;
  const formText = texts.components.form;
  const forgotPasswordText: ForgotPasswordData = texts?.pages?.user.forgotPasswordText;
  const forgotButton = formText.button.forgotPassword as ButtonProps;

  const handleForgotPassword = async (data: ForgotPasswordPayload) => {
    try {
      setLoading(true);

      if (!client?._id) {
        const popupData = getPopup(
          popups,
          'GLOBAL_INTERNAL_ERROR',
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );

        return showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onCancel: closeAlert,
        });
      }

      const payload: ForgotPasswordPayload = {
        email: data.email?.trim() || auth?.email || '',
        language: data.language || profile?.language || lang || 'de',
        clientId: data.clientId || client._id,
      };

      if (!payload.email || !payload.language || !payload.clientId) {
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
            description: popupData.description,
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onCancel: closeAlert,
        });
        return;
      }

      const loadingData = getPopup(
        popups,
        'GLOBAL_LOADING',
        'GLOBAL_LOADING',
        fallbackForgotPasswordLoading
      );

      showLoading({
        response: {
          status: 102,
          title: loadingData.title,
          description: loadingData.description,
        },
      });

      const response = await forgotPassword(payload);

      if (response.success) {
        const popupData = getPopup(
          popups,
          response.code,
          'USER_FORGOT_PASSWORD_EMAIL_SENDED',
          fallbackForgotPasswordSuccess
        );

        showSuccess({
          response: {
            status: 200,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onCancel: closeAlert,
        });
      }
    } catch (error: any) {
      const code = error?.response?.data?.code;

      const popupData = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);

      showError({
        response: {
          status: error?.response?.status ?? 500,
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
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 id={headingId} className={styles.h1}>
          {forgotPasswordText.title}
        </h1>
        <p id={descriptionId} className={styles.p}>
          * {forgotPasswordText.info}
        </p>
      </header>
      <section
        className={`${styles.section} card`}
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        aria-busy={loading}
        role="form"
      >
          <FormWrapper<ForgotPasswordPayload>
            fields={['email', 'language', 'clientId'] as const}
            onSubmit={handleForgotPassword}
            button={forgotButton}
            initialValues={{
              clientId: client?._id || '',
              email: auth?.email || '',
            language: profile?.language || lang || 'de',
          }}
          loading={loading}
        />
        <p style={srOnly} role="status" aria-live="polite">
          {loading ? fallbackForgotPasswordLoading.description : ''}
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
