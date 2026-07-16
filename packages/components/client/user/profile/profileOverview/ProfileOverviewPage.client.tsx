'use client';

import { ProfileOverviewPageView } from './ProfileOverviewPage.view';
import { useProfileOverviewController } from './useProfileOverviewController';

export function ProfileOverviewPageClient() {
  const { loading, loadingAriaLabel, viewModel } = useProfileOverviewController();

  if (loading) {
    return (
      <section
        className="profile-overview-loading"
        aria-busy="true"
        aria-label={loadingAriaLabel}
      />
    );
  }

  return <ProfileOverviewPageView viewModel={viewModel} />;
}
