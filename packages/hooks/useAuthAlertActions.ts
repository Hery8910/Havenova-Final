'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { getI18nFallbacks } from '../contexts';
import type { PopupsTexts } from '../contexts/alert/alert.types';
import { href } from '../utils';
import { useLang } from './useLang';

type AuthAlertButtons = ReturnType<typeof getI18nFallbacks>['fallbackButtons'];
type AuthConfirmActionKind =
  | 'reload'
  | 'goToHome'
  | 'goToLogin'
  | 'goToRegister'
  | 'openVerification'
  | 'resetPassword'
  | 'requestNewLink';

type AuthCancelActionKind = 'close' | 'goToHome' | 'goToLogin';

interface UseAuthAlertActionsOptions {
  buttons?: PopupsTexts['button'];
  closeAlert: () => void;
}

export function useAuthAlertActions({ buttons, closeAlert }: UseAuthAlertActionsOptions) {
  const router = useRouter();
  const lang = useLang();
  const { fallbackButtons } = getI18nFallbacks(lang);
  const resolvedButtons: AuthAlertButtons = {
    ...fallbackButtons,
    ...buttons,
  };

  const navigateAndClose = useCallback(
    (path: string) => {
      closeAlert();
      router.push(href(lang, path));
    },
    [closeAlert, lang, router]
  );

  const getConfirmActionLabel = useCallback(
    (kind: AuthConfirmActionKind) => {
      switch (kind) {
        case 'reload':
          return resolvedButtons.reload;
        case 'goToHome':
          return resolvedButtons.goToHome;
        case 'goToLogin':
          return resolvedButtons.goToLogin;
        case 'goToRegister':
          return resolvedButtons.goToRegister;
        case 'openVerification':
          return resolvedButtons.openVerification;
        case 'resetPassword':
          return resolvedButtons.resetPassword;
        case 'requestNewLink':
          return resolvedButtons.requestNewLink;
      }
    },
    [resolvedButtons]
  );

  const getConfirmAction = useCallback(
    (kind: AuthConfirmActionKind, retryAction?: () => void) => {
      switch (kind) {
        case 'reload':
          return retryAction
            ? () => {
                closeAlert();
                retryAction();
              }
            : undefined;
        case 'goToHome':
          return () => navigateAndClose('/');
        case 'goToLogin':
          return () => navigateAndClose('/user/login');
        case 'goToRegister':
          return () => navigateAndClose('/user/register');
        case 'openVerification':
          return () => navigateAndClose('/user/verify-email');
        case 'resetPassword':
          return () => navigateAndClose('/user/forgot-password');
        case 'requestNewLink':
          return () => navigateAndClose('/user/forgot-password');
      }
    },
    [closeAlert, navigateAndClose]
  );

  const getCancelActionLabel = useCallback(
    (kind: AuthCancelActionKind = 'close') => {
      switch (kind) {
        case 'goToHome':
          return resolvedButtons.goToHome;
        case 'goToLogin':
          return resolvedButtons.goToLogin;
        default:
          return resolvedButtons.close;
      }
    },
    [resolvedButtons]
  );

  const getCancelAction = useCallback(
    (kind: AuthCancelActionKind = 'close') => {
      switch (kind) {
        case 'goToHome':
          return () => navigateAndClose('/');
        case 'goToLogin':
          return () => navigateAndClose('/user/login');
        default:
          return closeAlert;
      }
    },
    [closeAlert, navigateAndClose]
  );

  return {
    getConfirmAction,
    getConfirmActionLabel,
    getCancelAction,
    getCancelActionLabel,
  };
}
