'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { fallbackButtons } from '../contexts';
import { useGlobalAlert } from '../contexts/alert';
import { useI18n } from '../contexts/i18n';
import { useAuth } from '../contexts/auth/authContext';
import { useLang } from './useLang';
import { href } from '../utils/navigation';
import { fallbackPopups } from '../contexts/i18n/fallbackText.de';
import { getPopup } from '../utils/alertType/getPopup';

/**
 * Reusable guard to require a logged-in (non-guest) user.
 * Shows a confirm dialog offering to continue browsing or go to login,
 * then redirects accordingly.
 */
export const useRequireLogin = () => {
  const { auth, loading: authLoading } = useAuth();
  const { showConfirm, closeAlert } = useGlobalAlert();
  const { texts } = useI18n();
  const router = useRouter();
  const lang = useLang();
  const popups = texts.popups;

  useEffect(() => {
    if (authLoading) return;
    if (auth?.isLogged && auth.role !== 'guest') return;

    const popupData = getPopup(
      popups,
      'USER_NEED_TO_LOGIN',
      'USER_NEED_TO_LOGIN',
      (fallbackPopups as any).USER_NEED_TO_LOGIN
    );

    showConfirm({
      response: {
        status: 401,
        title: popupData.title,
        description: popupData.description,
        confirmLabel:
          popupData.confirm ?? texts.popups?.button?.continue ?? fallbackButtons.continue,
        cancelLabel: popupData.close ?? texts.popups?.button?.close ?? fallbackButtons.close,
      },
      onConfirm: () => {
        closeAlert();
        router.push(href(lang, '/user/login'));
      },
      onCancel: () => {
        closeAlert();
        router.push(href(lang, '/'));
      },
    });
  }, [
    auth?.isLogged,
    auth?.role,
    authLoading,
    closeAlert,
    lang,
    popups,
    router,
    showConfirm,
    texts.popups,
  ]);
};
