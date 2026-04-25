'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackGlobalLoading,
  useGlobalAlert,
} from '@/packages/contexts';
import { FormWrapper } from '@/packages/components/client/user/auth';
import { getPopup } from '@/packages/utils/alertType';
import { resetPassword } from '@/packages/services';
import styles from '../userAuth.module.css';
import { href } from '../../../../../../../packages/utils/navigation';
import { useLang } from '../../../../../../../packages/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { IoMdArrowRoundBack } from 'react-icons/io';

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
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const router = useRouter();
  const lang = useLang();
  const searchParams = useSearchParams();

  const { texts } = useI18n();
  const formText = texts.components.client.form;
  const navText = texts.components.client.navbar.accessibility;
  const popups = texts.popups;
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
        'USER_RESET_PASSWORD_INVALID_TOKEN',
        'USER_RESET_PASSWORD_INVALID_TOKEN',
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
        'USER_RESET_PASSWORD_INVALID_TOKEN',
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
          confirmLabel: popupData.confirm ?? popups.button?.continue ?? fallbackButtons.continue,
          cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
        },
        onConfirm: () => {
          closeAlert();
          router.push(href(lang, '/user/forgot-password'));
        },
        onCancel: () => {
          closeAlert();
          router.push(href(lang, '/'));
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
      if (!token) {
        const popupData = getPopup(
          popups,
          'USER_RESET_PASSWORD_INVALID_TOKEN',
          'USER_RESET_PASSWORD_INVALID_TOKEN',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description || 'Missing token or invalid link.',
            confirmLabel: popupData.confirm ?? popups.button?.continue ?? fallbackButtons.continue,
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onConfirm: () => {
            closeAlert();
            router.push(href(lang, '/user/forgot-password'));
          },
          onCancel: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
        });
        return;
      }

      const payload = {
        token,
        newPassword: data.password,
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
            confirmLabel:
              response.code === 'USER_RESET_PASSWORD_INVALID_TOKEN' ||
              response.code === 'USER_RESET_PASSWORD_TOKEN_EXPIRED'
                ? popupData.confirm ?? popups.button?.continue ?? fallbackButtons.continue
                : undefined,
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onConfirm:
            response.code === 'USER_RESET_PASSWORD_INVALID_TOKEN' ||
            response.code === 'USER_RESET_PASSWORD_TOKEN_EXPIRED'
              ? () => {
                  closeAlert();
                  router.push(href(lang, '/user/forgot-password'));
                }
              : undefined,
          onCancel: closeAlert,
        });
        return;
      }

      const popupData = getPopup(
        popups,
        response.code,
        'USER_RESET_PASSWORD_SUCCESS',
        fallbackGlobalError
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
        onCancel: () => {
          closeAlert();
          router.push(href(lang, '/user/login'));
        },
      });
    } catch (error) {
      const err = error as { response?: { data?: { code?: string }; status?: number } };
      const code = err.response?.data?.code;
      const popupData = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
      const canRequestNewLink =
        code === 'USER_RESET_PASSWORD_INVALID_TOKEN' || code === 'USER_RESET_PASSWORD_TOKEN_EXPIRED';
      const canRetry = !code || (err.response?.status ?? 500) >= 500;

      showError({
        response: {
          status: err.response?.status ?? 500,
          title: popupData.title,
          description: popupData.description,
          confirmLabel:
            canRequestNewLink || canRetry
              ? popupData.confirm ??
                (canRequestNewLink
                  ? popups.button?.continue ?? fallbackButtons.continue
                  : popups.button?.reload ?? fallbackButtons.reload)
              : undefined,
          cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
        },
        onConfirm: canRequestNewLink
          ? () => {
              closeAlert();
              router.push(href(lang, '/user/forgot-password'));
            }
          : canRetry
            ? () => {
                closeAlert();
                void handleResetPassword(data);
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
      aria-labelledby="reset-password-title"
      aria-describedby="reset-password-description"
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
          <h1 id="reset-password-title" className={styles.authTitle}>
            {resetPasswordText.title || formText.labels.resetPassword}
          </h1>
          <p id="reset-password-description" className={styles.authDescription}>
            {resetPasswordText.info}
          </p>
        </div>
      </header>

      <div className={styles.authFormContainer}>
        <FormWrapper<ResetPasswordFormData>
          showHintPassword
          fields={['password'] as const}
          onSubmit={handleResetPassword}
          button={resetButton}
          initialValues={{ password: '' }}
          loading={loading}
        />
      </div>

      <footer className={styles.authFooter}>
        <div className={styles.authFooterActions}>
          <Link className={`${styles.link} ${styles.mutedLink}`} href={href(lang, '/user/login')}>
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

export default ResetPassword;
