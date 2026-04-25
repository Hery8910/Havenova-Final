'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

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
import Image from 'next/image';
import { IoMdArrowRoundBack } from 'react-icons/io';

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const lang = useLang();

  const { texts } = useI18n();
  const { popups } = texts;

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

  useEffect(() => {
    // Evita doble ejecución en Strict Mode
    if (didRunRef.current) return;
    didRunRef.current = true;

    // Envuelve en microtarea para asegurar que React estabilizó el árbol antes de correr
    Promise.resolve().then(async () => {
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
            confirmLabel: popupData.confirm ?? popups.button?.continue ?? fallbackButtons.continue,
            cancelLabel: popupData.close,
          },
          onConfirm: () => {
            router.push(href(lang, '/user/login'));
            closeAlert();
          },
          onCancel: () => {
            router.push(href(lang, '/'));
            closeAlert();
          },
        });

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
              confirmLabel: popups.button?.continue ?? fallbackButtons.continue,
              cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
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
            description: popupData.description,
            confirmLabel: popups.button?.continue ?? fallbackButtons.continue,
            cancelLabel: popupData.close ?? popups.button?.close ?? fallbackButtons.close,
          },
          onConfirm: () => {
            router.push(href(lang, '/'));
            closeAlert();
          },
          onCancel: () => {
            router.push(href(lang, '/'));
            closeAlert();
          },
        });
      } catch (error) {
        const err = error as { response?: { data?: { code?: string }; status?: number } };
        const code = err.response?.data?.code;

        const popupData = getPopup(
          popups,
          code,
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );

        showError({
          response: {
            status: err.response?.status ?? 500,
            title: popupData.title,
            description: popupData.description,
            confirmLabel: popupData.confirm ?? popups.button?.reload ?? fallbackButtons.reload,
            cancelLabel: popupData.close ?? fallbackButtons.close,
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
      className={styles.authSection}
      aria-labelledby="verify-title"
      aria-describedby="verify-desc"
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
          <h1 id="verify-title" className={styles.authTitle}>
            {verifyText.title}
          </h1>
          <p id="verify-desc" className={styles.authDescription}>
            {verifyText.info}
          </p>
        </div>
      </header>

      <div className={styles.authFormContainer}>
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
          <div className={`${styles.authFooterActions} ${styles.authFooterSecondary}`}>
            <Link className={`${styles.link} ${styles.mutedLink}`} href={href(lang, '/user/login')}>
              {formText.button.login}
            </Link>
            <Link className={`${styles.link} ${styles.mutedLink}`} href={href(lang, '/')}>
              <IoMdArrowRoundBack /> {navText.homeLink}
            </Link>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default VerifyEmailPage;
