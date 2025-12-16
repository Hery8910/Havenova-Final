'use client';

import { useRouter } from 'next/navigation';
import {
  fallbackGlobalError,
  fallbackButtons,
  fallbackExpiredToken,
  fallbackInvalidToken,
  fallbackVerifyEmailResended,
  fallbackGlobalLoading,
  useGlobalAlert,
  useAuth,
} from '../../contexts';
import { PopupsTexts } from '../../contexts/alert/alert.types';
import { magicLoginRequest, resendVerificationEmail, verifyEmailRequest } from '../../services';
import { ResendVerificationEmailPayload, VerifyEmailResult } from '../../types';
import { getPopup } from '../alertType';
import { useLang } from '../../hooks';
import { href } from '../navigation';

export function useVerifyEmailActions() {
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  const lang = useLang();

  // -----------------------
  //  handleVerifyEmail
  // -----------------------
  const handleVerifyEmail = async (
    popups: PopupsTexts,
    token: string
  ): Promise<VerifyEmailResult & { isExpired?: boolean }> => {
    try {
      const response = await verifyEmailRequest({ token });
      const { status, code, magicToken, language } = response;

      // 1) SUCCESS
      if (status === 'success') {
        if (!magicToken) {
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

          return { ok: false };
        }

        return {
          ok: true,
          magicToken,
          language: language || 'de',
        };
      }

      // 2) EXPIRED
      if (status === 'expired') {
        const popupData = getPopup(
          popups,
          'USER_VERIFY_EXPIRED_TOKEN',
          'USER_VERIFY_EXPIRED_TOKEN',
          fallbackExpiredToken
        );

        showError({
          response: {
            status: 401,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popups.button?.close ?? fallbackButtons.close,
          },
          onCancel: () => {
            closeAlert();
          },
        });

        return { ok: false, isExpired: true };
      }

      // 3) INVALID (token corrupto, user not found, etc.)
      if (status === 'invalid') {
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
            cancelLabel: popups.button?.close ?? fallbackButtons.close,
          },
          onCancel: () => {
            closeAlert();
            router.push(href(lang, '/'));
          },
        });

        return { ok: false };
      }

      // 4) Cualquier cosa rara
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

      return { ok: false };
    } catch (error: any) {
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

      return { ok: false };
    }
  };

  // -----------------------
  //  handleMagicLogin
  // -----------------------
  const handleMagicLogin = async (popups: PopupsTexts, magicToken: string): Promise<boolean> => {
    try {
      const res = await magicLoginRequest({ token: magicToken });

      // Por si acaso, validamos que venga user
      if (!res?.user) {
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

        return false;
      }

      const { user } = res;

      // Mapeo al tipo de tu contexto Auth
      // Ajusta las propiedades al tipo real de AuthUser
      setAuth({
        ...(auth || {}), // conservas language, theme, etc. si ya existían
        isLogged: true,
        userId: user.userId,
        clientId: user.clientId,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isNewUser: true,
      });

      // El success de login no lo mostramos aquí, lo dejas a la página verify-email
      // para mantener el patrón que ya tienes: 3 loadings + popup final.
      return true;
    } catch (err: any) {
      const code = err?.response?.data?.code;

      const popupData = getPopup(popups, code, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);

      showError({
        response: {
          status: 401,
          title: popupData.title,
          description: popupData.description,
          cancelLabel: popupData.close,
        },
        onCancel: () => {
          closeAlert();
          router.push(href(lang, '/'));
        },
      });

      return false;
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
        'USER_VERIFY_EMAIL_RESENDED',
        fallbackVerifyEmailResended
      );

      showSuccess({
        response: {
          status: 200,
          title: popupData.title,
          description: popupData.description,
          cancelLabel: popupData.close,
        },
        onCancel: () => {
          closeAlert();
        },
      });
    } catch (e: any) {
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
