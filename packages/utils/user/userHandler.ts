'use client';

import { useRouter } from 'next/navigation';
import {
  getI18nFallbacks,
  useGlobalAlert,
  useAuth,
} from '../../contexts';
import { PopupCode, PopupsTexts } from '../../contexts/alert/alert.types';
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

  const getVerifyEmailErrorConfig = (code?: string) => {
    if (code === 'AUTH_VERIFY_EMAIL_TOKEN_EXPIRED') {
      return {
        kind: 'expired' as const,
        status: 400,
        popupKey: 'AUTH_VERIFY_EMAIL_TOKEN_EXPIRED' as PopupCode,
        fallback: fallbackExpiredToken,
      };
    }

    if (
      code === 'AUTH_VERIFY_EMAIL_TOKEN_INVALID' ||
      code === 'AUTH_USER_NOT_FOUND' ||
      code === 'USER_CLIENT_NOT_FOUND'
    ) {
      return {
        kind: 'invalid' as const,
        status: 400,
        popupKey: 'AUTH_VERIFY_EMAIL_TOKEN_INVALID' as PopupCode,
        fallback: fallbackInvalidToken,
      };
    }

    if (code === 'AUTH_BLOCKED' || code === 'USER_CLIENT_BLOCKED') {
      return {
        kind: 'blocked' as const,
        status: 403,
        popupKey: (code === 'AUTH_BLOCKED' ? 'AUTH_BLOCKED' : 'USER_CLIENT_BLOCKED') as PopupCode,
        fallback: fallbackGlobalError,
      };
    }

    return null;
  };

  const getResendVerificationErrorConfig = (code?: string, fallbackStatus = 500) => {
    switch (code) {
      case 'CLIENT_NOT_FOUND':
        return { status: 404, popupKey: 'CLIENT_NOT_FOUND' as PopupCode };
      case 'VALIDATION_ERROR':
        return { status: 400, popupKey: 'VALIDATION_ERROR' as PopupCode };
      case 'AUTH_BLOCKED':
        return { status: 403, popupKey: 'AUTH_BLOCKED' as PopupCode };
      case 'USER_CLIENT_BLOCKED':
        return { status: 403, popupKey: 'USER_CLIENT_BLOCKED' as PopupCode };
      default:
        return { status: fallbackStatus, popupKey: 'GLOBAL_INTERNAL_ERROR' as PopupCode };
    }
  };

  const getMagicLoginPopupDefaultKey = (code?: string): PopupCode => {
    switch (code) {
      case 'MAGIC_TOKEN_EXPIRED':
        return 'MAGIC_TOKEN_EXPIRED';
      case 'MAGIC_TOKEN_INVALID':
      case 'AUTH_USER_NOT_FOUND':
      case 'USER_CLIENT_NOT_FOUND':
        return 'MAGIC_TOKEN_INVALID';
      default:
        return 'GLOBAL_INTERNAL_ERROR';
    }
  };

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

      const errorConfig = getVerifyEmailErrorConfig(code);

      if (errorConfig?.kind === 'expired') {
        const popupData = getPopup(popups, code, errorConfig.popupKey, errorConfig.fallback);

        showError({
          response: {
            status: errorConfig.status,
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

        return { ok: false, code, status: errorConfig.status, isExpired: true };
      }

      if (errorConfig?.kind === 'invalid' || errorConfig?.kind === 'blocked') {
        const popupData = getPopup(popups, code, errorConfig.popupKey, errorConfig.fallback);

        showError({
          response: {
            status: errorConfig.status,
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

        return { ok: false, code, status: errorConfig.status };
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

      const errorConfig = getVerifyEmailErrorConfig(code);

      if (errorConfig?.kind === 'expired') {
        const popupData = getPopup(popups, code, errorConfig.popupKey, errorConfig.fallback);

        showError({
          response: {
            status: errorConfig.status,
            title: popupData.title,
            description: popupData.description,
            confirmLabel: popupData.confirm ?? fallbackButtons.continue,
            cancelLabel: popups.button?.close ?? fallbackButtons.close,
          },
          onConfirm: closeAlert,
          onCancel: closeAlert,
        });

        return { ok: false, code, status: errorConfig.status, isExpired: true };
      }

      if (errorConfig?.kind === 'invalid' || errorConfig?.kind === 'blocked') {
        const popupData = getPopup(popups, code, errorConfig.popupKey, errorConfig.fallback);

        showError({
          response: {
            status: errorConfig.status,
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

        return { ok: false, code, status: errorConfig.status };
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
        const isExpired = res?.code === 'MAGIC_TOKEN_EXPIRED';
        const isInvalid =
          res?.code === 'MAGIC_TOKEN_INVALID' ||
          res?.code === 'AUTH_USER_NOT_FOUND' ||
          res?.code === 'USER_CLIENT_NOT_FOUND';
        const popupData = getPopup(
          popups,
          res?.code,
          getMagicLoginPopupDefaultKey(res?.code),
          isExpired || isInvalid ? fallbackInvalidToken : fallbackGlobalError
        );

        showError({
          response: {
            status: isExpired ? 401 : isInvalid ? 400 : 401,
            title: popupData.title,
            description: popupData.description,
            confirmLabel:
              isExpired || isInvalid
                ? popupData.confirm ?? fallbackButtons.continue
                : popupData.confirm ?? fallbackButtons.reload,
            cancelLabel: popupData.close,
          },
          onConfirm:
            isExpired || isInvalid
              ? () => {
                  closeAlert();
                  router.push(href(lang, '/user/login'));
                }
              : () => {
                  closeAlert();
                  router.refresh();
                },
          onCancel: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
        });

        return { ok: false, code: res?.code, status: isExpired ? 401 : isInvalid ? 400 : 401 };
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
      const isExpired = code === 'MAGIC_TOKEN_EXPIRED';
      const isInvalid =
        code === 'MAGIC_TOKEN_INVALID' ||
        code === 'AUTH_USER_NOT_FOUND' ||
        code === 'USER_CLIENT_NOT_FOUND';

      const popupData = getPopup(
        popups,
        code,
        getMagicLoginPopupDefaultKey(code),
        isExpired || isInvalid ? fallbackInvalidToken : fallbackGlobalError
      );

      showError({
        response: {
          status,
          title: popupData.title,
          description: popupData.description,
          confirmLabel:
            isExpired || isInvalid
              ? popupData.confirm ?? fallbackButtons.continue
              : popupData.confirm ?? fallbackButtons.reload,
          cancelLabel: popupData.close,
        },
        onConfirm:
          isExpired || isInvalid
            ? () => {
                closeAlert();
                router.push(href(lang, '/user/login'));
              }
            : () => {
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
      const errorConfig = getResendVerificationErrorConfig(code, status);
      const popupData = getPopup(popups, code, errorConfig.popupKey, fallbackGlobalError);
      const canRetry = !code || status >= 500;

      showError({
        response: {
          status: errorConfig.status,
          title: popupData.title,
          description: popupData.description,
          confirmLabel: canRetry ? popupData.confirm ?? fallbackButtons.reload : undefined,
          cancelLabel: popupData.close,
        },
        onConfirm: canRetry
          ? () => {
              closeAlert();
              void handleResendEmail(popups, data);
            }
          : undefined,
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
