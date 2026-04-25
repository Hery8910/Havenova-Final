'use client';

import { useRouter } from 'next/navigation';
import {
  getI18nFallbacks,
  useGlobalAlert,
  useAuth,
} from '../../contexts';
import { PopupsTexts } from '../../contexts/alert/alert.types';
import { magicLoginRequest, resendVerificationEmail, verifyEmailRequest } from '../../services';
import { MagicLoginResult, ResendVerificationEmailPayload, VerifyEmailResult } from '../../types';
import { getPopup } from '../alertType';
import { useLang } from '../../hooks';
import { href } from '../navigation';

export function useVerifyEmailActions() {
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const lang = useLang();
  const {
    fallbackGlobalError,
    fallbackButtons,
    fallbackExpiredToken,
    fallbackInvalidToken,
    fallbackVerifyEmailResent,
    fallbackGlobalLoading,
  } = getI18nFallbacks(lang);

  // -----------------------
  //  handleVerifyEmail
  // -----------------------
  const handleVerifyEmail = async (
    popups: PopupsTexts,
    token: string
  ): Promise<VerifyEmailResult & { isExpired?: boolean }> => {
    try {
      const response = await verifyEmailRequest({ token });
      const { success, code, magicToken, language } = response;

      if (success) {
        return {
          ok: true,
          code,
          magicToken: magicToken || undefined,
          language: language || 'de',
        };
      }

      if (code === 'AUTH_VERIFY_EMAIL_TOKEN_EXPIRED' || code === 'USER_VERIFY_EXPIRED_TOKEN') {
        const popupData = getPopup(
          popups,
          code,
          'USER_VERIFY_EXPIRED_TOKEN',
          fallbackExpiredToken
        );

        showError({
          response: {
            status: 401,
            title: popupData.title,
            description: popupData.description,
            confirmLabel: popupData.confirm ?? popups.button?.continue ?? fallbackButtons.continue,
            cancelLabel: popups.button?.close ?? fallbackButtons.close,
          },
          onConfirm: closeAlert,
          onCancel: () => {
            closeAlert();
          },
        });

        return { ok: false, code, status: 401, isExpired: true };
      }

      if (
        code === 'AUTH_VERIFY_EMAIL_TOKEN_INVALID' ||
        code === 'USER_VERIFY_INVALID_TOKEN' ||
        code === 'USER_VERIFY_MISSING_TOKEN' ||
        code === 'AUTH_USER_NOT_FOUND' ||
        code === 'USER_CLIENT_NOT_FOUND'
      ) {
        const popupData = getPopup(
          popups,
          code || 'USER_VERIFY_INVALID_TOKEN',
          'USER_VERIFY_INVALID_TOKEN',
          fallbackInvalidToken
        );

        showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description,
            confirmLabel: popupData.confirm ?? fallbackButtons.continue,
            cancelLabel: popups.button?.close ?? fallbackButtons.close,
          },
          onConfirm: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
          onCancel: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
        });

        return { ok: false, code, status: 400 };
      }

      const popupData = getPopup(
        popups,
        code,
        'GLOBAL_INTERNAL_ERROR',
        fallbackGlobalError
      );

      showError({
        response: {
          status: 500,
          title: popupData.title,
          description: popupData.description,
          confirmLabel: popupData.confirm ?? fallbackButtons.reload,
          cancelLabel: popupData.close,
        },
        onConfirm: () => {
          closeAlert();
          router.refresh();
        },
        onCancel: () => {
          closeAlert();
          router.push(href(lang, '/'));
        },
      });

      return { ok: false, code: code || 'GLOBAL_INTERNAL_ERROR', status: 500 };
    } catch (error: any) {
      const code = error?.response?.data?.code;
      const status = error?.response?.status ?? 500;

      if (code === 'AUTH_VERIFY_EMAIL_TOKEN_EXPIRED' || code === 'USER_VERIFY_EXPIRED_TOKEN') {
        const popupData = getPopup(
          popups,
          code,
          'USER_VERIFY_EXPIRED_TOKEN',
          fallbackExpiredToken
        );

        showError({
          response: {
            status,
            title: popupData.title,
            description: popupData.description,
            confirmLabel: popupData.confirm ?? fallbackButtons.continue,
            cancelLabel: popups.button?.close ?? fallbackButtons.close,
          },
          onConfirm: closeAlert,
          onCancel: closeAlert,
        });

        return { ok: false, code, status, isExpired: true };
      }

      if (
        code === 'AUTH_VERIFY_EMAIL_TOKEN_INVALID' ||
        code === 'USER_VERIFY_INVALID_TOKEN' ||
        code === 'USER_VERIFY_MISSING_TOKEN' ||
        code === 'AUTH_USER_NOT_FOUND' ||
        code === 'USER_CLIENT_NOT_FOUND'
      ) {
        const popupData = getPopup(
          popups,
          code,
          'USER_VERIFY_INVALID_TOKEN',
          fallbackInvalidToken
        );

        showError({
          response: {
            status,
            title: popupData.title,
            description: popupData.description,
            confirmLabel: popupData.confirm ?? fallbackButtons.continue,
            cancelLabel: popups.button?.close ?? fallbackButtons.close,
          },
          onConfirm: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
          onCancel: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
        });

        return { ok: false, code, status };
      }

      const popupData = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);

      showError({
        response: {
          status,
          title: popupData.title,
          description: popupData.description,
          confirmLabel: popupData.confirm ?? fallbackButtons.reload,
          cancelLabel: popupData.close,
        },
        onConfirm: () => {
          closeAlert();
          router.refresh();
        },
        onCancel: () => {
          closeAlert();
          router.push(href(lang, '/'));
        },
      });

      return { ok: false, code, status };
    }
  };

  // -----------------------
  //  handleMagicLogin
  // -----------------------
  const handleMagicLogin = async (
    popups: PopupsTexts,
    magicToken: string
  ): Promise<MagicLoginResult> => {
    try {
      const res = await magicLoginRequest({ token: magicToken });

      if (!res?.success || !res?.user) {
        const popupData = getPopup(
          popups,
          res?.code,
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 401,
            title: popupData.title,
            description: popupData.description,
            confirmLabel: popupData.confirm ?? fallbackButtons.reload,
            cancelLabel: popupData.close,
          },
          onConfirm: () => {
            closeAlert();
            router.refresh();
          },
          onCancel: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
        });

        return { ok: false, code: res?.code, status: 401 };
      }

      const { user } = res;

      setAuth({
        authId: user.authId,
        userClientId: user.userClientId,
        userId: user.userId,
        clientId: user.clientId,
        email: user.email,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
        isLogged: true,
        isNewUser: true,
        tosAccepted: auth?.tosAccepted,
        cookiePrefs: auth?.cookiePrefs,
      });

      // El success de login no lo mostramos aquí, lo dejas a la página verify-email
      // para mantener el patrón que ya tienes: 3 loadings + popup final.
      return { ok: true, code: res.code };
    } catch (err: any) {
      const code = err?.response?.data?.code;
      const status = err?.response?.status ?? 401;

      const popupData = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);

      showError({
        response: {
          status,
          title: popupData.title,
          description: popupData.description,
          confirmLabel: popupData.confirm ?? fallbackButtons.reload,
          cancelLabel: popupData.close,
        },
        onConfirm: () => {
          closeAlert();
          router.refresh();
        },
        onCancel: () => {
          closeAlert();
          router.push(href(lang, '/'));
        },
      });

      return { ok: false, code, status };
    }
  };

  // -----------------------
  //  handleResendEmail
  // -----------------------
  const handleResendEmail = async (popups: PopupsTexts, data: ResendVerificationEmailPayload) => {
    const loadingData = getPopup(popups, 'GLOBAL_LOADING', 'GLOBAL_LOADING', fallbackGlobalLoading);

    showLoading({
      response: {
        status: 102,
        title: loadingData.title,
        description: loadingData.description,
      },
    });

    try {
      const res = await resendVerificationEmail({
        email: data.email || auth?.email || '',
        language: data.language || 'de',
        clientId: data.clientId,
      });

      const popupData = getPopup(
        popups,
        res.code,
        'USER_VERIFY_EMAIL_RESENT',
        fallbackVerifyEmailResent
      );

      showSuccess({
        response: {
          status: 200,
          title: popupData.title,
          description: popupData.description,
          confirmLabel: popupData.confirm ?? fallbackButtons.continue,
          cancelLabel: popupData.close,
        },
        onConfirm: closeAlert,
        onCancel: () => {
          closeAlert();
        },
      });
    } catch (e: any) {
      const code = e?.response?.data?.code;
      const status = e?.response?.status ?? 500;
      const popupData = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);

      showError({
        response: {
          status,
          title: popupData.title,
          description: popupData.description,
          confirmLabel: popupData.confirm ?? fallbackButtons.reload,
          cancelLabel: popupData.close,
        },
        onConfirm: () => {
          closeAlert();
          void handleResendEmail(popups, data);
        },
        onCancel: () => {
          closeAlert();
        },
      });
    }
  };

  return {
    handleVerifyEmail,
    handleMagicLogin,
    handleResendEmail,
  };
}
