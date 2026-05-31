'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { useProfile } from '../../../../../../../packages/contexts/profile/ProfileContext';
import { useClient } from '../../../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../../../packages/contexts/i18n/I18nContext';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackLoginSuccess,
  fallbackLoadingMessages,
  fallbackVerifyEmailSuccess,
  useAuth,
  useGlobalAlert,
} from '../../../../../../../packages/contexts';
import { useLang } from '../../../../../../../packages/hooks';

import { FormWrapper } from '../../../../../../../packages/components/client/user/auth';
import styles from '../userAuth.module.css';
import { ResendVerificationEmailPayload } from '../../../../../../../packages/types';
import { getPopup } from '../../../../../../../packages/utils/alertType';
import { href } from '../../../../../../../packages/utils/navigation';
import { useVerifyEmailActions } from '../../../../../../../packages/utils';
import Link from 'next/link';
import { PopupCode } from '../../../../../../../packages/contexts/alert/alert.types';
import { IoMdArrowRoundBack } from 'react-icons/io';

const VerifyEmailPageContent = () => {
  const AUTO_REDIRECT_MS = 4000;
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const lang = useLang();

  const { texts } = useI18n();
  const { popups } = texts;
  const alertButtons = popups.button ?? fallbackButtons;

  const formText = texts.components.client.form;
  const navText = texts.components.client.navbar.accessibility;
  const registerText = texts.pages.client.user.register;
  const verifyText = texts.pages.client.user.verifyEmail;
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
  const redirectTimeoutRef = useRef<number | null>(null);

  const clearRedirectTimeout = useCallback(() => {
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
  }, []);

  const getAutoRedirectDescription = useCallback(
    (baseDescription: string) => {
      const redirectCopy =
        lang === 'de'
          ? 'Sie werden in wenigen Sekunden zur Startseite weitergeleitet.'
          : lang === 'es'
            ? 'Serás redirigido a la página de inicio en unos segundos.'
            : 'You will be redirected to the homepage in a few seconds.';

      return `${baseDescription} ${redirectCopy}`.trim();
    },
    [lang]
  );

  const scheduleHomeRedirect = useCallback(() => {
    clearRedirectTimeout();
    redirectTimeoutRef.current = window.setTimeout(() => {
      closeAlert();
      router.push(href(lang, '/'));
    }, AUTO_REDIRECT_MS);
  }, [AUTO_REDIRECT_MS, clearRedirectTimeout, closeAlert, lang, router]);

  useEffect(() => {
    return () => {
      clearRedirectTimeout();
    };
  }, [clearRedirectTimeout]);

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
        // 1) Loading Verificación
        const verifyLoading = loadingMsg.verifyEmail ?? fallbackLoadingMessages.verifyEmail;
        showLoading({
          response: {
            status: 102,
            title: verifyLoading.title,
            description: verifyLoading.description,
          },
        });

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
              confirmLabel: alertButtons.goToLogin,
              cancelLabel: alertButtons.close,
            },
            onConfirm: () => {
              router.push(href(lang, '/user/login'));
              closeAlert();
            },
            onCancel: closeAlert,
          });
          return;
        }

        // 2) Loading Login
        const loginLoading = loadingMsg.login ?? fallbackLoadingMessages.login;
        showLoading({
          response: {
            status: 102,
            title: loginLoading.title,
            description: loginLoading.description,
          },
        });

        const login = await handleMagicLogin(popups, magicToken);
        if (!login.ok) return;

        await refreshAuth();

        // 3) Loading Refresh
        const createUserLoading = loadingMsg.createUser ?? fallbackLoadingMessages.createUser;
        showLoading({
          response: {
            status: 102,
            title: createUserLoading.title,
            description: createUserLoading.description,
          },
        });

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
            description: getAutoRedirectDescription(popupData.description),
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
            confirmLabel: alertButtons.reload,
            cancelLabel: alertButtons.goToHome,
          },
          onConfirm: () => {
            closeAlert();
            router.refresh();
          },
          onCancel: () => {
            router.push(href(lang, '/'));
            closeAlert();
          },
        });
      }
    });
  }, [
    closeAlert,
    handleMagicLogin,
    handleVerifyEmail,
    lang,
    loadingMsg.createUser,
    loadingMsg.login,
    loadingMsg.verifyEmail,
    popups,
    refreshAuth,
    router,
    showError,
    showLoading,
    showSuccess,
    token,
    clearRedirectTimeout,
    getAutoRedirectDescription,
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
    <section
      className={`${styles.authSection} card card--primary`}
      aria-labelledby="verify-title"
      aria-describedby="verify-desc"
    >
      <Link className={styles.authBrand} href={href(lang, '/')} aria-label={navText.homeLink}>
        <Image
          className={styles.authBrandImage}
          src="/logos/logo-small-dark.webp"
          alt={navText.logoAlt}
          width={80}
          height={80}
          priority
        />
      </Link>
      <div className={styles.authFormContainer}>
        <header className={styles.authHeader}>
          <h1 id="verify-title" className={styles.authTitle}>
            {verifyText.title}
          </h1>
          <p id="verify-desc" className={styles.authDescription}>
            {verifyText.info}
          </p>
        </header>

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
      </div>

      <footer className={styles.authFooter}>
        <div className={styles.authFooterActions}>
          <Link className={styles.link} href={href(lang, '/user/register')}>
            {registerText.title}
          </Link>
        </div>
        <div className={`${styles.authFooterActions} ${styles.authFooterSecondary}`}>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
