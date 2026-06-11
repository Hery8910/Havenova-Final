'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import {
  PopupCode,
  fallbackButtons,
  fallbackGlobalError,
  fallbackLoginSuccess,
  fallbackLoadingMessages,
  fallbackVerifyEmailSuccess,
  useAuth,
  useClient,
  useGlobalAlert,
  useI18n,
  useProfile,
} from '../../../../../../../packages/contexts';
import { useLang } from '../../../../../../../packages/hooks';

import { FormWrapper } from '../../../../../../../packages/components/client/user/auth';
import styles from '../userAuth.module.css';
import { ResendVerificationEmailPayload } from '../../../../../../../packages/types';
import { getPopup } from '../../../../../../../packages/utils/alertType';
import { href } from '../../../../../../../packages/utils';
import { useVerifyEmailActions } from '../../../../../../../packages/utils';
import Link from 'next/link';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { AuthPageShell } from '../AuthPageShell';
import { useAuthAutoRedirect } from '../useAuthAutoRedirect';
import { useAuthAlertActions } from '../useAuthAlertActions';

const VerifyEmailPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const lang = useLang();
  const homeHref = href(lang, '/');

  const { texts } = useI18n();
  const { popups } = texts;
  const alertButtons = popups.button ?? fallbackButtons;

  const formText = texts.components.client.form;
  const navText = texts.components.client.navbar.accessibility;
  const registerText = texts.pages.client.user.register;
  const verifyText = texts.pages.client.user.verifyEmail;
  const autoRedirectDescription = verifyText.autoRedirectDescription;
  const loadingMsg = texts.loadings?.message ?? fallbackLoadingMessages;
  const resendButton = formText.button.resendEmail;

  const { auth, refreshAuth } = useAuth();
  const { profile } = useProfile();
  const { client } = useClient();

  const [loading, setLoading] = useState(false);

  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const { handleVerifyEmail, handleMagicLogin, handleResendEmail } = useVerifyEmailActions();

  // Evitar doble ejecución del efecto en modo dev / StrictMode
  const didRunRef = useRef(false);
  const { getAutoRedirectDescription, scheduleRedirect: scheduleHomeRedirect } =
    useAuthAutoRedirect({
      redirectTo: homeHref,
      closeAlert,
    });
  const { getConfirmAction, getConfirmActionLabel, getCancelAction, getCancelActionLabel } =
    useAuthAlertActions({
      buttons: alertButtons,
      closeAlert,
    });

  const getVerifyFlowPopupDefaultKey = (code?: string, status?: number): PopupCode => {
    switch (code) {
      case 'AUTH_VERIFY_EMAIL_TOKEN_EXPIRED':
        return 'AUTH_VERIFY_EMAIL_TOKEN_EXPIRED';
      case 'AUTH_VERIFY_EMAIL_TOKEN_INVALID':
      case 'AUTH_USER_NOT_FOUND':
      case 'USER_CLIENT_NOT_FOUND':
        return 'AUTH_VERIFY_EMAIL_TOKEN_INVALID';
      case 'MAGIC_TOKEN_EXPIRED':
        return 'MAGIC_TOKEN_EXPIRED';
      case 'MAGIC_TOKEN_INVALID':
        return 'MAGIC_TOKEN_INVALID';
      default:
        return (status ?? 500) < 500 ? 'AUTH_VERIFY_EMAIL_TOKEN_INVALID' : 'GLOBAL_INTERNAL_ERROR';
    }
  };

  const getRefreshSyncErrorCopy = useCallback(() => {
    return {
      title: verifyText.sessionSyncError?.title,
      description: verifyText.sessionSyncError?.description,
    };
  }, [verifyText.sessionSyncError?.description, verifyText.sessionSyncError?.title]);

  const openVerifyFlowLoading = useCallback(() => {
    const verifyLoading = loadingMsg.verifyEmail ?? fallbackLoadingMessages.verifyEmail;

    showLoading({
      response: {
        status: 102,
        title: verifyLoading.title,
        description: verifyLoading.description,
      },
    });
  }, [loadingMsg.verifyEmail, showLoading]);

  useEffect(() => {
    // Evita doble ejecución en Strict Mode
    if (didRunRef.current) return;
    didRunRef.current = true;

    // Envuelve en microtarea para asegurar que React estabilizó el árbol antes de correr
    Promise.resolve().then(async () => {
      if (!token) {
        // Sin token, esta ruta actua como pantalla segura para reenviar el email.
        // El flujo de verificacion automatica solo debe correr cuando el usuario llega
        // desde el enlace del correo.
        return;
      }

      try {
        // Mantiene un único loading visible para todo el flujo compuesto:
        // verify-email -> magic-login -> refreshAuth.
        openVerifyFlowLoading();

        const result = await handleVerifyEmail(popups, token);

        if (!result.ok) return;

        // Aquí controlamos ambos casos:
        // - usuario nuevo → validación normal
        // - usuario ya verificado → evitar flujos dobles
        const magicToken = result.magicToken;

        if (!magicToken) {
          // El email se verificó, pero no hay token para auto-login.
          // Mostramos éxito y redirigimos a login manualmente para evitar colgar la app.
          const popupData = getPopup(
            popups,
            'USER_VERIFY_EMAIL_SUCCESS',
            'USER_VERIFY_EMAIL_SUCCESS',
            fallbackVerifyEmailSuccess
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
          return;
        }

        const login = await handleMagicLogin(popups, magicToken);
        if (!login.ok) return;

        const refreshResult = await refreshAuth();

        if (!refreshResult.syncedFromServer || !refreshResult.auth.isLogged) {
          if (!refreshResult.userNotified) {
            const syncCopy = getRefreshSyncErrorCopy();

            showError({
              response: {
                status: refreshResult.isOffline ? 503 : 500,
                title: syncCopy.title,
                description: syncCopy.description,
                confirmLabel: getConfirmActionLabel('reload'),
                cancelLabel: getCancelActionLabel('goToLogin'),
              },
              onConfirm: getConfirmAction('reload', () => router.refresh()),
              onCancel: getCancelAction('goToLogin'),
            });
          }
          return;
        }

        // 4) Done!
        const popupData = getPopup(
          popups,
          'USER_LOGIN_SUCCESS',
          'USER_LOGIN_SUCCESS',
          fallbackLoginSuccess
        );

        showSuccess({
          response: {
            status: 200,
            title: popupData.title,
            description: getAutoRedirectDescription(popupData.description, autoRedirectDescription),
            cancelLabel: '',
          },
        });
        scheduleHomeRedirect();
      } catch (error) {
        const err = error as { response?: { data?: { code?: string }; status?: number } };
        const code = err.response?.data?.code;
        const status = err.response?.status ?? 500;

        const popupData = getPopup(
          popups,
          code,
          getVerifyFlowPopupDefaultKey(code, status),
          fallbackGlobalError
        );

        showError({
          response: {
            status,
            title: popupData.title,
            description: popupData.description,
            confirmLabel: getConfirmActionLabel('reload'),
            cancelLabel: getCancelActionLabel('goToHome'),
          },
          onConfirm: getConfirmAction('reload', () => router.refresh()),
          onCancel: getCancelAction('goToHome'),
        });
      }
    });
  }, [
    closeAlert,
    handleMagicLogin,
    handleVerifyEmail,
    lang,
    openVerifyFlowLoading,
    popups,
    refreshAuth,
    router,
    showError,
    showSuccess,
    token,
    autoRedirectDescription,
    getCancelAction,
    getCancelActionLabel,
    getAutoRedirectDescription,
    getConfirmAction,
    getConfirmActionLabel,
    getRefreshSyncErrorCopy,
    scheduleHomeRedirect,
  ]);

  // ---------------------------
  // RESEND VERIFICATION EMAIL (desde el formulario)
  // ---------------------------
  const onResendSubmit = async (data: ResendVerificationEmailPayload) => {
    setLoading(true);

    const payload: ResendVerificationEmailPayload = {
      email: data.email || auth?.email || '',
      language: profile?.language || lang || 'de',
      clientId: client._id,
    };

    try {
      await handleResendEmail(popups, payload);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <AuthPageShell
      headingId="verify-title"
      descriptionId="verify-desc"
      title={verifyText.title}
      description={verifyText.info}
      homeHref={homeHref}
      homeLabel={navText.homeLink}
      logoAlt={navText.logoAlt}
      footerLabel={navText.authFooter}
      footer={
        <>
          <div className={styles.authFooterActions}>
            <Link className={styles.link} href={href(lang, '/user/login')}>
              {formText.button.login}
            </Link>
          </div>
          <div className={`${styles.authFooterActions} ${styles.authFooterSecondary}`}>
            <Link className={`${styles.link} ${styles.mutedLink}`} href={href(lang, '/user/register')}>
              {registerText.title}
            </Link>
            <Link className={`${styles.link} ${styles.mutedLink}`} href={homeHref}>
              <IoMdArrowRoundBack /> {navText.homeLink}
            </Link>
          </div>
        </>
      }
    >
      <FormWrapper<ResendVerificationEmailPayload>
        fields={['email', 'language', 'clientId'] as const}
        onSubmit={onResendSubmit}
        button={resendButton}
        initialValues={{
          email: auth?.email ?? '',
          clientId: client._id,
          language: profile?.language ?? lang ?? 'de',
        }}
        loading={loading}
      />
    </AuthPageShell>
  );
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
