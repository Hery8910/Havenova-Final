'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { PopupCode, useI18n } from '@/packages/contexts';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackGlobalLoading,
  useGlobalAlert,
} from '@/packages/contexts';
import {
  AuthPageShell,
  FormWrapper,
} from '@/packages/components/client/user/auth';
import styles from '@/packages/components/client/user/auth/authShell/authShell.module.css';
import { getPopup } from '@/packages/utils/alertType';
import { resetPassword } from '@/packages/services';
import { href } from '../../../../../../../packages/utils';
import { useAuthAlertActions, useLang } from '../../../../../../../packages/hooks';
import Link from 'next/link';
import { IoMdArrowRoundBack } from 'react-icons/io';

export interface ResetPasswordData {
  title: string;
  info: string;
  button: string;
  linkErrors?: {
    invalidOrExpired?: string;
    missingToken?: string;
  };
}
export interface accessDeniedText {
  title: string;
  description: string;
}

interface ResetPasswordFormData {
  password: string;
}

const ResetPasswordContent = () => {
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const lang = useLang();
  const searchParams = useSearchParams();
  const homeHref = href(lang, '/');

  const { texts } = useI18n();
  const formText = texts.components.client.form;
  const navText = texts.components.client.navbar.accessibility;
  const popups = texts.popups;
  const alertButtons = { ...fallbackButtons, ...popups.button };
  const resetPasswordText: ResetPasswordData = texts.pages.client.user.resetPasswordText;
  const invalidOrExpiredLinkCopy = resetPasswordText.linkErrors?.invalidOrExpired;
  const missingTokenCopy = resetPasswordText.linkErrors?.missingToken;
  const invalidTokenPopupDescription = getPopup(
    popups,
    'USER_RESET_PASSWORD_INVALID_TOKEN',
    'USER_RESET_PASSWORD_INVALID_TOKEN',
    fallbackGlobalError
  ).description;
  const resetButton = resetPasswordText.button || formText.button.resetPassword;

  const [loading, setLoading] = useState(false);
  const { getConfirmAction, getConfirmActionLabel, getCancelAction, getCancelActionLabel } =
    useAuthAlertActions({
      buttons: alertButtons,
      closeAlert,
    });

  const token = searchParams.get('token');
  const status = searchParams.get('status');
  const code = searchParams.get('code');
  const http = Number(searchParams.get('http')) || 200;
  const hasFatalLinkState = !token || status === 'error';

  const getResetPasswordErrorStatus = (errorCode?: string, fallbackStatus = 500) => {
    switch (errorCode) {
      case 'USER_RESET_PASSWORD_INVALID_TOKEN':
      case 'USER_RESET_PASSWORD_TOKEN_EXPIRED':
      case 'VALIDATION_ERROR':
        return 400;
      case 'AUTH_BLOCKED':
      case 'USER_CLIENT_BLOCKED':
        return 403;
      case 'AUTH_USER_NOT_FOUND':
      case 'USER_CLIENT_NOT_FOUND':
        return 404;
      default:
        return fallbackStatus;
    }
  };

  const getResetPasswordPopupDefaultKey = (errorCode?: string): PopupCode => {
    switch (errorCode) {
      case 'USER_RESET_PASSWORD_INVALID_TOKEN':
        return 'USER_RESET_PASSWORD_INVALID_TOKEN';
      case 'USER_RESET_PASSWORD_TOKEN_EXPIRED':
        return 'USER_RESET_PASSWORD_TOKEN_EXPIRED';
      case 'AUTH_BLOCKED':
        return 'AUTH_BLOCKED';
      case 'USER_CLIENT_BLOCKED':
        return 'USER_CLIENT_BLOCKED';
      case 'AUTH_USER_NOT_FOUND':
      case 'USER_CLIENT_NOT_FOUND':
        return 'USER_RESET_PASSWORD_INVALID_TOKEN';
      case 'VALIDATION_ERROR':
        return 'VALIDATION_ERROR';
      default:
        return 'GLOBAL_INTERNAL_ERROR';
    }
  };

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
          status: 400,
          title: popupData.title,
          description: popupData.description,
          cancelLabel: getCancelActionLabel('goToHome'),
        },
        onCancel: getCancelAction('goToHome'),
      });

      return;
    }

    if (status === 'error') {
      const popupData = getPopup(
        popups,
        code || undefined,
        getResetPasswordPopupDefaultKey(code || undefined),
        fallbackGlobalError
      );

      showError({
        response: {
          status: http || 400,
          title: popupData.title,
          description:
            popupData.description || invalidTokenPopupDescription || invalidOrExpiredLinkCopy,
          confirmLabel: getConfirmActionLabel('requestNewLink'),
          cancelLabel: getCancelActionLabel('goToHome'),
        },
        onConfirm: getConfirmAction('requestNewLink'),
        onCancel: getCancelAction('goToHome'),
      });
    }
  }, [
    closeAlert,
    code,
    getCancelAction,
    getCancelActionLabel,
    getConfirmAction,
    getConfirmActionLabel,
    http,
    invalidOrExpiredLinkCopy,
    invalidTokenPopupDescription,
    popups,
    showError,
    status,
    token,
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
            description: popupData.description || missingTokenCopy,
            confirmLabel: getConfirmActionLabel('requestNewLink'),
            cancelLabel: getCancelActionLabel('goToHome'),
          },
          onConfirm: getConfirmAction('requestNewLink'),
          onCancel: getCancelAction('goToHome'),
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
          getResetPasswordPopupDefaultKey(response.code),
          fallbackGlobalError
        );

        showError({
          response: {
            status: getResetPasswordErrorStatus(response.code, 400),
            title: popupData.title,
            description: popupData.description,
            confirmLabel:
              response.code === 'USER_RESET_PASSWORD_INVALID_TOKEN' ||
              response.code === 'USER_RESET_PASSWORD_TOKEN_EXPIRED'
                ? getConfirmActionLabel('requestNewLink')
                : undefined,
            cancelLabel: getCancelActionLabel(),
          },
          onConfirm:
            response.code === 'USER_RESET_PASSWORD_INVALID_TOKEN' ||
            response.code === 'USER_RESET_PASSWORD_TOKEN_EXPIRED'
              ? getConfirmAction('requestNewLink')
              : undefined,
          onCancel: getCancelAction(),
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
          confirmLabel: getConfirmActionLabel('goToLogin'),
        },
        onConfirm: getConfirmAction('goToLogin'),
      });
    } catch (error) {
      const err = error as { response?: { data?: { code?: string }; status?: number } };
      const code = err.response?.data?.code;
      const popupData = getPopup(
        popups,
        code,
        getResetPasswordPopupDefaultKey(code),
        fallbackGlobalError
      );
      const canRequestNewLink =
        code === 'USER_RESET_PASSWORD_INVALID_TOKEN' ||
        code === 'USER_RESET_PASSWORD_TOKEN_EXPIRED';
      const canRetry = !code || (err.response?.status ?? 500) >= 500;

      showError({
        response: {
          status: getResetPasswordErrorStatus(code, err.response?.status ?? 500),
          title: popupData.title,
          description: popupData.description,
          confirmLabel:
            canRequestNewLink || canRetry
              ? canRequestNewLink
                ? getConfirmActionLabel('requestNewLink')
                : getConfirmActionLabel('reload')
              : undefined,
          cancelLabel: getCancelActionLabel(),
        },
        onConfirm: canRequestNewLink
          ? getConfirmAction('requestNewLink')
          : canRetry
            ? getConfirmAction('reload', () => void handleResetPassword(data))
            : undefined,
        onCancel: getCancelAction(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      headingId="reset-password-title"
      descriptionId="reset-password-description"
      title={resetPasswordText.title || formText.labels.resetPassword}
      description={resetPasswordText.info}
      homeHref={homeHref}
      homeLabel={navText.homeLink}
      logoAlt={navText.logoAlt}
      footerLabel={navText.authFooter}
      footer={
        <div className={styles.authFooterActions}>
          <Link className={`${styles.link} ${styles.mutedLink}`} href={href(lang, '/user/login')}>
            {formText.button.login}
          </Link>
          <Link className={`${styles.link} ${styles.mutedLink}`} href={homeHref}>
            <IoMdArrowRoundBack /> {navText.homeLink}
          </Link>
        </div>
      }
    >
      {hasFatalLinkState ? null : (
        <FormWrapper<ResetPasswordFormData>
          showHintPassword
          fields={['password'] as const}
          onSubmit={handleResetPassword}
          button={resetButton}
          initialValues={{ password: '' }}
          loading={loading}
        />
      )}
    </AuthPageShell>
  );
};

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
