'use client';

import { useAuth, useI18n, useProfile } from '../../../../../contexts';
import { useLang, useRequireLogin } from '../../../../../hooks';
import { href } from '../../../../../utils/navigation';
import { PROFILE_OVERVIEW_FALLBACKS } from './profileOverview.fallbacks';
import { buildProfileOverviewViewModel } from './profileOverview.helpers';
import { ProfileOverviewPageView } from './ProfileOverviewPage.view';

export function ProfileOverviewPageClient() {
  const { auth, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { texts } = useI18n();
  const lang = useLang();

  useRequireLogin();

  const cookieLabel =
    texts?.pages?.client?.user?.profile?.preferences?.sections?.cookies?.buttonLabel ??
    'Open cookie notice';
  const settingsHref = href(lang, '/profile/settings');
  const ordersHref = href(lang, '/profile/orders');
  const requestsHref = href(lang, '/profile/requests');
  const notificationsHref = href(lang, '/profile/notifications');
  const loading = authLoading || profileLoading;

  if (loading) {
    return (
      <section
        className="profile-overview-loading"
        aria-busy="true"
        aria-label={PROFILE_OVERVIEW_FALLBACKS.loadingAriaLabel}
      />
    );
  }

  const viewModel = buildProfileOverviewViewModel({
    profile,
    auth,
    settingsHref,
    ordersHref,
    requestsHref,
    notificationsHref,
    cookieLabel,
    fallbacks: PROFILE_OVERVIEW_FALLBACKS,
  });

  return <ProfileOverviewPageView viewModel={viewModel} />;
}

export const ProfileOverviewClient = ProfileOverviewPageClient;
