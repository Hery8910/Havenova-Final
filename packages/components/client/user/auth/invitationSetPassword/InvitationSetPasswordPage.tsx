'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoMdArrowRoundBack } from 'react-icons/io';

import { useLang } from '@/packages/hooks';
import {
  getI18nFallbacks,
  useGlobalAlert,
  useI18n,
} from '@/packages/contexts';
import { AuthPageShell, FormWrapper } from '@/packages/components/client/user/auth';
import {
  acceptTenantUserInvitation,
  resetPassword,
  resolveInvite,
  resolveTenantUserInvitation,
} from '@/packages/services';
import { getPopup } from '@/packages/utils/alertType';
import { href, userAuthRoutes } from '@/packages/utils';

import styles from '../authShell/authShell.module.css';

type InvitationResolvedData = {
  emailMasked?: string;
};

export interface InvitationResetPasswordText {
  title: string;
  info: string;
  button: string;
  invite?: {
    title?: string;
    info?: string;
    resolvedDescription?: string;
  };
}

interface InvitationResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export const InvitationSetPasswordPage = () => {
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const router = useRouter();
  const lang = useLang();
  const { fallbackButtons, fallbackGlobalError, fallbackLoadingMessages } = getI18nFallbacks(lang);
  const searchParams = useSearchParams();

  const { texts } = useI18n();
  const formText = texts.components.client.form;
  const popups = texts.popups;
  const alertButtons = { ...fallbackButtons, ...popups.button };
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const resetPasswordText: InvitationResetPasswordText = texts.pages.client.user.resetPasswordText;
  const resetButton = formText.button.resetPassword;
  const globalErrorPopup = getPopup(
    popups,
    'GLOBAL_INTERNAL_ERROR',
    'GLOBAL_INTERNAL_ERROR',
    fallbackGlobalError
  );

  const [loading, setLoading] = useState(false);
  const [inviteResolved, setInviteResolved] = useState(false);
  const [inviteData, setInviteData] = useState<InvitationResolvedData | null>(null);

  const resetToken = searchParams.get('token');
  const inviteToken = searchParams.get('inviteToken');
  const isTenantUserInvite = inviteToken?.startsWith('tui_') ?? false;
  const status = searchParams.get('status');
  const code = searchParams.get('code');
  const http = Number(searchParams.get('http')) || 200;

  useEffect(() => {
    if (!resetToken && !inviteToken) {
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
          cancelLabel: alertButtons.goToHome,
        },
        onCancel: () => {
          closeAlert();
          router.push(href(lang, '/'));
        },
      });

      return;
    }

    if (status === 'error') {
      const popupData = getPopup(
        popups,
        code || undefined,
        'GLOBAL_INTERNAL_ERROR',
        fallbackGlobalError
      );

      showError({
        response: {
          status: http || 400,
          title: popupData.title,
          description: popupData.description || globalErrorPopup.description || 'Invalid or expired link.',
          cancelLabel: alertButtons.goToHome,
        },
        onCancel: () => {
          closeAlert();
          router.push('/');
        },
      });
      return;
    }

    if (inviteToken) {
      void (async () => {
        try {
          const response = isTenantUserInvite
            ? await resolveTenantUserInvitation({ inviteToken })
            : await resolveInvite({ inviteToken });
          setInviteData(response.data ?? null);
          setInviteResolved(true);
        } catch (error) {
          const err = error as { response?: { data?: { code?: string }; status?: number } };
          const popupData = getPopup(
            popups,
            err.response?.data?.code,
            'GLOBAL_INTERNAL_ERROR',
            fallbackGlobalError
          );

          showError({
            response: {
              status: err.response?.status ?? 400,
              title: popupData.title,
              description: popupData.description,
              cancelLabel: alertButtons.goToLogin,
            },
            onCancel: () => {
              closeAlert();
              router.push(href(lang, userAuthRoutes.login));
            },
          });
        }
      })();
    }
  }, [
    resetToken,
    inviteToken,
    isTenantUserInvite,
    alertButtons.goToHome,
    alertButtons.goToLogin,
    status,
    code,
    http,
    popups,
    router,
    showError,
    closeAlert,
    lang,
    globalErrorPopup.description,
  ]);

  const handleResetPassword = async (data: InvitationResetPasswordFormData) => {
    setLoading(true);

    try {
      if (!resetToken && !inviteToken) {
        const popupData = getPopup(
          popups,
          'GLOBAL_INTERNAL_ERROR',
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description || 'Missing token or invalid link.',
            cancelLabel: alertButtons.goToLogin,
          },
          onCancel: () => {
            closeAlert();
            router.push(href(lang, userAuthRoutes.login));
          },
        });
        return;
      }

      if (inviteToken && !inviteResolved) {
        const popupData = getPopup(
          popups,
          'GLOBAL_INTERNAL_ERROR',
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: alertButtons.close,
          },
          onCancel: closeAlert,
        });
        return;
      }

      if (!data.password) {
        const popupData = getPopup(
          popups,
          'USER_EDIT_EMPTY_NEW_PASSWORD',
          'USER_EDIT_EMPTY_NEW_PASSWORD',
          fallbackGlobalError
        );

        showError({
          response: {
            status: 400,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: alertButtons.close,
          },
          onCancel: closeAlert,
        });
        return;
      }

      const loadingData = loadingText.resetPassword ?? fallbackLoadingMessages.resetPassword;

      showLoading({
        response: {
          status: 102,
          title: loadingData.title,
          description: loadingData.description,
        },
      });

      const response =
        inviteToken && isTenantUserInvite
          ? await acceptTenantUserInvitation({ inviteToken, newPassword: data.password })
          : await resetPassword({
              ...(inviteToken ? { inviteToken } : { token: resetToken as string }),
              newPassword: data.password,
            });

      if (response.success) {
        const popupData = getPopup(
          popups,
          response.code,
          'USER_RESET_PASSWORD_SUCCESS',
          fallbackGlobalError
        );

        showSuccess({
          response: {
            status: 200,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: alertButtons.goToLogin,
          },
          onCancel: () => {
            closeAlert();
            router.push(href(lang, userAuthRoutes.login));
          },
        });
      }
    } catch (error) {
      const err = error as { response?: { data?: { code?: string }; status?: number } };
      const responseCode = err.response?.data?.code;
      const popupData = getPopup(popups, responseCode, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);

      showError({
        response: {
          status: err.response?.status ?? 500,
          title: popupData.title,
          description: popupData.description,
          cancelLabel: alertButtons.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setLoading(false);
    }
  };

  const homeHref = href(lang, '/');
  const navText = texts.components.client.navbar.accessibility;
  const inviteTitle = resetPasswordText.invite?.title || resetPasswordText.title;
  const inviteInfo = resetPasswordText.invite?.info || resetPasswordText.info;
  const inviteResolvedDescriptionTemplate =
    resetPasswordText.invite?.resolvedDescription || resetPasswordText.info;
  const inviteResolvedDescription = inviteData?.emailMasked
    ? inviteResolvedDescriptionTemplate.replace('{email}', inviteData.emailMasked)
    : inviteInfo;
  const title = inviteToken ? inviteTitle : resetPasswordText.title;
  const description = inviteToken
    ? inviteResolved
      ? inviteResolvedDescription
      : inviteInfo
    : resetPasswordText.info;

  return (
    <AuthPageShell
      headingId="reset-title"
      descriptionId="reset-desc"
      title={title}
      description={description}
      homeHref={homeHref}
      homeLabel={navText.homeLink}
      logoAlt={navText.logoAlt}
      footerLabel={navText.authFooter}
      footer={
        <div className={styles.authFooterActions}>
          <Link
            className={`${styles.link} ${styles.mutedLink}`}
            href={href(lang, userAuthRoutes.login)}
          >
            {texts.components.client.form.button.login}
          </Link>
          <Link className={`${styles.link} ${styles.mutedLink}`} href={homeHref}>
            <IoMdArrowRoundBack /> {navText.homeLink}
          </Link>
        </div>
      }
    >
      <FormWrapper<InvitationResetPasswordFormData>
        showHintPassword
        fields={['password', 'confirmPassword'] as const}
        onSubmit={handleResetPassword}
        button={resetButton}
        initialValues={{ password: '', confirmPassword: '' }}
        loading={loading || Boolean(inviteToken && !inviteResolved)}
      />
    </AuthPageShell>
  );
};
