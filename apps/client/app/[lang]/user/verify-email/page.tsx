'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useProfile } from '../../../../../../packages/contexts/profile/ProfileContext';
import { useClient } from '../../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../../packages/contexts/i18n/I18nContext';
import {
  fallbackGlobalError,
  fallbackLoginSuccess,
  useAuth,
  useGlobalAlert,
} from '../../../../../../packages/contexts';
import { useLang } from '../../../../../../packages/hooks';
import { useVerifyEmailActions } from '@/packages/utils/user/userHandler';

import { FormWrapper } from '../../../../../../packages/components/userForm';
import styles from './page.module.css';
import { ResendVerificationEmailPayload } from '../../../../../../packages/types';
import { getPopup } from '../../../../../../packages/utils/alertType';
import { href } from '../../../../../../packages/utils/navigation';

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const lang = useLang();

  const { texts } = useI18n();
  const { popups } = texts;

  const formText = texts.components.form;
  const verifyText = texts.pages.user.verifyEmail;
  const loadingMsg = texts.loadings.message;

  const { auth, refreshAuth } = useAuth();
  const { profile } = useProfile();
  const { client } = useClient();

  const [loading, setLoading] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);

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
            cancelLabel: popupData.close,
          },
          onCancel: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
        });

        return;
      }

      try {
        // 1) Loading Verificación
        showLoading({
          response: {
            status: 102,
            title: loadingMsg.verifyEmail.title,
            description: loadingMsg.verifyEmail.description,
          },
        });

        const result = await handleVerifyEmail(popups, token);

        if (!result.ok) return;

        // Aquí controlamos ambos casos:
        // - usuario nuevo → validación normal
        // - usuario ya verificado → evitar flujos dobles
        const magicToken = result.magicToken;

        if (!magicToken) {
          return;
        }

        // 2) Loading Login
        showLoading({
          response: {
            status: 102,
            title: loadingMsg.login.title,
            description: loadingMsg.login.description,
          },
        });

        const login = await handleMagicLogin(popups, magicToken);
        if (!login) return;

        // 3) Loading Refresh
        showLoading({
          response: {
            status: 102,
            title: loadingMsg.createUser.title,
            description: loadingMsg.createUser.description,
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
            confirmLabel: popups.button.continue,
          },
          onConfirm: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
        });
      } catch (err) {
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
            cancelLabel: popupData.close,
          },
          onCancel: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
        });
      }
    });

    // SOLO deps vacías → se ejecuta una sola vez
  }, []);

  // ---------------------------
  // RESEND VERIFICATION EMAIL (desde el formulario)
  // ---------------------------
  const onResendSubmit = async (data: any) => {
    setLoading(true);

    const payload: ResendVerificationEmailPayload = {
      email: data.email || auth?.email || '',
      language: profile?.language || 'de',
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
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.h1}>{verifyText.title}</h1>
        <p className={styles.p}>* {verifyText.info}</p>
      </header>

      {showResendForm && (
        <section className={`${styles.section} card`}>
          <FormWrapper
            fields={['email', 'language', 'clientId']}
            onSubmit={onResendSubmit}
            button={formText.button.resendEmail}
            initialValues={{
              email: auth?.email ?? '',
              clientId: client._id,
              language: profile?.language ?? 'de',
            }}
            loading={loading}
          />
        </section>
      )}
    </main>
  );
};

export default VerifyEmailPage;
