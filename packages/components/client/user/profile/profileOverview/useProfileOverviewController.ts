'use client';

import { useMemo } from 'react';
import { useAuth, useI18n, useProfile } from '../../../../../contexts';
import { useLang, useRequireLogin } from '../../../../../hooks';
import { href } from '../../../../../utils/navigation';
import { PROFILE_OVERVIEW_FALLBACKS } from './profileOverview.fallbacks';
import { buildProfileOverviewViewModel } from './profileOverview.helpers';

export function useProfileOverviewController() {
  const { auth, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { texts } = useI18n();
  const lang = useLang();

  useRequireLogin();

  const loading = authLoading || profileLoading;
  const cookieLabel =
    texts?.pages?.client?.user?.profile?.preferences?.sections?.cookies?.buttonLabel ??
    'Open cookie notice';

  const viewModel = useMemo(
    () =>
      buildProfileOverviewViewModel({
        profile,
        auth,
        settingsHref: href(lang, '/profile/settings'),
        ordersHref: href(lang, '/profile/orders'),
        requestsHref: href(lang, '/profile/requests'),
        notificationsHref: href(lang, '/profile/notifications'),
        cookieLabel,
        fallbacks: PROFILE_OVERVIEW_FALLBACKS,
      }),
    [auth, cookieLabel, lang, profile]
  );

  return {
    loading,
    loadingAriaLabel: PROFILE_OVERVIEW_FALLBACKS.loadingAriaLabel,
    viewModel,
  };
}
