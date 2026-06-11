'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useLang } from '../../../../../../packages/hooks';
import { href } from '../../../../../../packages/utils';
import { fallbackButtons } from '../../../../../../packages/contexts';

type AuthAlertButtons = typeof fallbackButtons;
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
  buttons: AuthAlertButtons;
  closeAlert: () => void;
}

export function useAuthAlertActions({ buttons, closeAlert }: UseAuthAlertActionsOptions) {
  const router = useRouter();
  const lang = useLang();

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
          return buttons.reload;
        case 'goToHome':
          return buttons.goToHome;
        case 'goToLogin':
          return buttons.goToLogin;
        case 'goToRegister':
          return buttons.goToRegister;
        case 'openVerification':
          return buttons.openVerification;
        case 'resetPassword':
          return buttons.resetPassword;
        case 'requestNewLink':
          return buttons.requestNewLink;
      }
    },
    [buttons]
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
          return buttons.goToHome;
        case 'goToLogin':
          return buttons.goToLogin;
        default:
          return buttons.close;
      }
    },
    [buttons]
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
