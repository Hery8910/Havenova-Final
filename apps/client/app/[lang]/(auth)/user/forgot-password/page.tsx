'use client';
import { useState } from 'react';
import {
  getI18nFallbacks,
  PopupCode,
  useAuth,
  useClient,
  useGlobalAlert,
  useI18n,
  useProfile,
} from '@/packages/contexts';
import { useAuthAlertActions, useLang } from '@/packages/hooks';
import {
  AuthPageShell,
  FormWrapper,
} from '@/packages/components/client/user/auth';
import styles from '@/packages/components/client/user/auth/authShell/authShell.module.css';
import { getPopup } from '@/packages/utils/alertType';
import { forgotPassword } from '@/packages/services';
import { ForgotPasswordPayload } from '@/packages/types';
import Link from 'next/link';
import { href } from '@/packages/utils';
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
  const { texts } = useI18n();
  const { auth } = useAuth();
  const { profile } = useProfile();
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
  const alertButtons = popups.button ?? fallbackButtons;
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

  const getForgotPasswordErrorStatus = (code?: string, fallbackStatus = 500) => {
    switch (code) {
      case 'CLIENT_NOT_FOUND':
        return 404;
      case 'VALIDATION_ERROR':
        return 400;
      default:
        return fallbackStatus;
    }
  };

  const getForgotPasswordPopupDefaultKey = (code?: string): PopupCode => {
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

        return showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: getCancelActionLabel(),
          },
          onCancel: getCancelAction(),
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
          getForgotPasswordPopupDefaultKey(response.code),
          fallbackGlobalError
        );

        showError({
          response: {
            status: getForgotPasswordErrorStatus(response.code, 400),
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

      const popupData = getPopup(
        popups,
        code,
        getForgotPasswordPopupDefaultKey(code),
        fallbackGlobalError
      );
      const canRetry = !code || (err.response?.status ?? 500) >= 500;

      showError({
        response: {
          status: getForgotPasswordErrorStatus(code, err.response?.status ?? 500),
          title: popupData.title,
          description: popupData.description,
          confirmLabel: canRetry ? getConfirmActionLabel('reload') : undefined,
          cancelLabel: getCancelActionLabel(),
        },
        onConfirm: canRetry
          ? getConfirmAction('reload', () => void handleForgotPassword(data))
          : undefined,
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
          <Link className={styles.link} href={href(lang, '/user/login')}>
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
          language: profile?.language || lang || 'de',
        }}
        loading={loading}
      />
    </AuthPageShell>
  );
};

export default ForgotPassword;
