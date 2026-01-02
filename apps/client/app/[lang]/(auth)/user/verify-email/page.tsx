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
  useAuth,
  useGlobalAlert,
} from '../../../../../../../packages/contexts';
import { useLang } from '../../../../../../../packages/hooks';
import { useVerifyEmailActions } from '@/packages/utils/user/userHandler';

import { FormWrapper } from '../../../../../../../packages/components/user/userForm';
import styles from '../userAuth.module.css';
import { ResendVerificationEmailPayload } from '../../../../../../../packages/types';
import { getPopup } from '../../../../../../../packages/utils/alertType';
import { href } from '../../../../../../../packages/utils/navigation';

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const lang = useLang();

  const { texts } = useI18n();
  const { popups } = texts;

  const formText = texts.components.form;
  const verifyText = texts.pages.user.verifyEmail;
  const loadingMsg = texts.loadings?.message ?? fallbackLoadingMessages;
  const resendButton = formText.button.resendEmail;

  const { auth } = useAuth();
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
            cancelLabel: popupData.close,
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
        if (!login) return;

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
            router.push(href(lang, '/'));
            closeAlert();
          },
        });
      }
    });
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
    <main className={styles.main} aria-labelledby="verify-title" aria-describedby="verify-desc">
      <div className={`${styles.wrapper} card`} role="region" aria-labelledby="verify-title">
        <header className={styles.header}>
          <h1 id="verify-title" className={styles.h1}>
            {verifyText.title}
          </h1>
          <p id="verify-desc" className={styles.header_p}>
            {verifyText.info}
          </p>
        </header>
        <section
          className={styles.section}
          aria-labelledby="verify-title"
          aria-describedby="verify-desc"
          aria-busy={loading}
          role="form"
        >
          <FormWrapper<ResendVerificationEmailPayload>
            fields={['email', 'language', 'clientId'] as const}
            onSubmit={onResendSubmit}
            button={resendButton}
            initialValues={{
              email: auth?.email ?? '',
              clientId: client._id,
              language: profile?.language ?? 'de',
            }}
            loading={loading}
          />
        </section>
      </div>
    </main>
  );
};

export default VerifyEmailPage;
