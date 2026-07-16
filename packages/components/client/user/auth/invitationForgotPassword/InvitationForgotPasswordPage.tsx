'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IoMdArrowRoundBack } from 'react-icons/io';

import {
  getI18nFallbacks,
  useAuth,
  useClient,
  useGlobalAlert,
  useI18n,
} from '@/packages/contexts';
import { useAuthAlertActions, useLang } from '@/packages/hooks';
import { forgotPassword } from '@/packages/services';
import type { ForgotPasswordPayload } from '@/packages/types';
import { getPopup } from '@/packages/utils/alertType';
import { href, userAuthRoutes } from '@/packages/utils';

import { AuthPageShell } from '../authShell';
import { FormWrapper } from '../userForm';
import styles from '../authShell/authShell.module.css';

export interface ForgotPasswordData {
  title: string;
  info: string;
  button: string;
}

export const InvitationForgotPasswordPage = () => {
  const headingId = 'forgot-password-title';
  const descriptionId = 'forgot-password-description';
  const { client } = useClient();
  const { auth } = useAuth();
  const { texts } = useI18n();
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();
  const [loading, setLoading] = useState(false);
  const lang = useLang();
  const {
    fallbackButtons,
    fallbackForgotPasswordSuccess,
    fallbackGlobalError,
    fallbackLoadingMessages,
  } = getI18nFallbacks(lang);
  const homeHref = href(lang, '/');

  const popups = texts.popups;
  const alertButtons = { ...fallbackButtons, ...popups.button };
  const formText = texts.components.client.form;
  const navText = texts.components.client.navbar.accessibility;
  const forgotPasswordText: ForgotPasswordData = texts.pages.client.user.forgotPasswordText;
  const forgotButton = formText.button.forgotPassword;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const { getConfirmAction, getConfirmActionLabel, getCancelAction, getCancelActionLabel } =
    useAuthAlertActions({
      buttons: alertButtons,
      closeAlert,
    });

  const getErrorStatus = (code?: string, fallbackStatus = 500) => {
    switch (code) {
      case 'CLIENT_NOT_FOUND':
        return 404;
      case 'VALIDATION_ERROR':
        return 400;
      default:
        return fallbackStatus;
    }
  };

  const getDefaultPopupKey = (code?: string) => {
    switch (code) {
      case 'CLIENT_MISSING_CLIENT_ID':
        return 'CLIENT_MISSING_CLIENT_ID';
      case 'CLIENT_NOT_FOUND':
        return 'CLIENT_NOT_FOUND';
      case 'VALIDATION_ERROR':
        return 'VALIDATION_ERROR';
      default:
        return 'GLOBAL_INTERNAL_ERROR';
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordPayload) => {
    try {
      setLoading(true);

      if (!client?._id) {
        const popupData = getPopup(
          popups,
          'CLIENT_MISSING_CLIENT_ID',
          'CLIENT_MISSING_CLIENT_ID',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: getCancelActionLabel(),
          },
          onCancel: getCancelAction(),
        });
        return;
      }

      const payload: ForgotPasswordPayload = {
        email: data.email?.trim() || auth?.email || '',
        language: data.language || lang || 'de',
        clientId: data.clientId || client._id,
      };

      const loadingData = loadingText.forgotPassword ?? fallbackLoadingMessages.forgotPassword;

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
          getDefaultPopupKey(response.code),
          fallbackGlobalError
        );

        showError({
          response: {
            status: getErrorStatus(response.code, 400),
            title: popupData.title,
            description: popupData.description,
            cancelLabel: getCancelActionLabel(),
          },
          onCancel: getCancelAction(),
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
          confirmLabel: getConfirmActionLabel('goToLogin'),
          cancelLabel: getCancelActionLabel(),
        },
        onConfirm: getConfirmAction('goToLogin'),
        onCancel: getCancelAction(),
      });
    } catch (error) {
      const err = error as { response?: { data?: { code?: string }; status?: number } };
      const code = err.response?.data?.code;
      const popupData = getPopup(popups, code, getDefaultPopupKey(code), fallbackGlobalError);
      const canRetry = !code || (err.response?.status ?? 500) >= 500;

      showError({
        response: {
          status: getErrorStatus(code, err.response?.status ?? 500),
          title: popupData.title,
          description: popupData.description,
          confirmLabel: canRetry ? getConfirmActionLabel('reload') : undefined,
          cancelLabel: getCancelActionLabel(),
        },
        onConfirm: canRetry ? getConfirmAction('reload', () => void handleForgotPassword(data)) : undefined,
        onCancel: getCancelAction(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      headingId={headingId}
      descriptionId={descriptionId}
      title={forgotPasswordText.title}
      description={forgotPasswordText.info}
      homeHref={homeHref}
      homeLabel={navText.homeLink}
      logoAlt={navText.logoAlt}
      footerLabel={navText.authFooter}
      footer={
        <div className={styles.authFooterActions}>
          <Link className={styles.link} href={href(lang, userAuthRoutes.login)}>
            {formText.button.login}
          </Link>
          <Link className={`${styles.link} ${styles.mutedLink}`} href={homeHref}>
            <IoMdArrowRoundBack /> {navText.homeLink}
          </Link>
        </div>
      }
    >
      <FormWrapper<ForgotPasswordPayload>
        fields={['email', 'language', 'clientId'] as const}
        onSubmit={handleForgotPassword}
        button={forgotButton}
        initialValues={{
          clientId: client?._id || '',
          email: auth?.email || '',
          language: lang || 'de',
        }}
        loading={loading}
      />
    </AuthPageShell>
  );
};
