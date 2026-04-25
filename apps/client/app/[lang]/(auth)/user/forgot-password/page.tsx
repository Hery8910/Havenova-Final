'use client';
import { useState } from 'react';
import styles from '../userAuth.module.css';
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
import { FormWrapper } from '@/packages/components/client/user/auth';
import { getPopup } from '@/packages/utils/alertType';
import { forgotPassword } from '@/packages/services';
import { ForgotPasswordPayload } from '@/packages/types';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { href } from '@/packages/utils/navigation';
import { IoMdArrowRoundBack } from 'react-icons/io';

export interface ForgotPasswordData {
  title: string;
  info: string;
  button: string;
}

const ForgotPassword = () => {
  const headingId = 'forgot-password-title';
  const descriptionId = 'forgot-password-description';

  const { client } = useClient();
  const router = useRouter();
  const { texts } = useI18n();
  const { auth } = useAuth();
  const { profile } = useProfile();
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();
  const [loading, setLoading] = useState(false);
  const lang = useLang();

  const popups = texts.popups;
  const formText = texts.components.client.form;
  const navText = texts.components.client.navbar.accessibility;
  const forgotPasswordText: ForgotPasswordData = texts.pages.client.user.forgotPasswordText;
  const forgotButton = formText.button.forgotPassword;

  const handleForgotPassword = async (data: ForgotPasswordPayload) => {
    try {
      setLoading(true);

      if (!client?._id) {
        const popupData = getPopup(
          popups,
          'CLIENT_MISSING_CLIENT_ID',
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

      if (!payload.clientId) {
        const popupData = getPopup(
          popups,
          'CLIENT_MISSING_CLIENT_ID',
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

      if (!response.success) {
        const popupData = getPopup(
          popups,
          response.code,
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

      const popupData = getPopup(
        popups,
        response.code,
        'USER_FORGOT_PASSWORD_EMAIL_SENT',
        fallbackForgotPasswordSuccess
      );

      showSuccess({
        response: {
          status: 200,
          title: popupData.title,
          description: popupData.description,
          confirmLabel: popupData.confirm ?? popups.button?.continue ?? fallbackButtons.continue,
          cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
        },
        onConfirm: () => {
          closeAlert();
          router.push(href(lang, '/user/login'));
        },
        onCancel: closeAlert,
      });
    } catch (error) {
      const err = error as { response?: { data?: { code?: string }; status?: number } };
      const code = err.response?.data?.code;

      const popupData = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
      const canRetry = !code || (err.response?.status ?? 500) >= 500;

      showError({
        response: {
          status: err.response?.status ?? 500,
          title: popupData.title,
          description: popupData.description,
          confirmLabel: canRetry
            ? popupData.confirm ?? popups.button?.reload ?? fallbackButtons.reload
            : undefined,
          cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
        },
        onConfirm: canRetry
          ? () => {
              closeAlert();
              void handleForgotPassword(data);
            }
          : undefined,
        onCancel: closeAlert,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={styles.authSection}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
    >
      <header className={styles.authHeader}>
        <Image
          className={styles.logoImage}
          src={'/logos/vertical-logo-auth.webp'}
          alt="Havenova Logo"
          width={100}
          height={100}
          priority
        />

        <div className={styles.authHeaderText}>
          <h1 id={headingId} className={styles.authTitle}>
            {forgotPasswordText.title}
          </h1>
          <p id={descriptionId} className={styles.authDescription}>
            {forgotPasswordText.info}
          </p>
        </div>
      </header>

      <div className={styles.authFormContainer}>
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
      </div>

      <footer className={styles.authFooter}>
        <div className={styles.authFooterActions}>
          <Link className={styles.link} href={href(lang, '/user/login')}>
            {formText.button.login}
          </Link>
          <Link className={`${styles.link} ${styles.mutedLink}`} href={href(lang, '/')}>
            <IoMdArrowRoundBack /> {navText.homeLink}
          </Link>
        </div>
      </footer>
    </section>
  );
};

export default ForgotPassword;
