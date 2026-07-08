'use client';

import { useAuth } from '../../../../../contexts/auth/authContext';
import { useI18n } from '../../../../../contexts/i18n/I18nContext';
import { useLang } from '../../../../../hooks/useLang';
import {
  SideNav,
} from '../../../../sideNav';
import {
  buildDefaultProfileNavFooterItems,
  buildDefaultProfileNavMainItems,
  resolveProfileNavLabels,
  toSideNavItems,
} from './profileNav.helpers';
import type { ProfileNavProps } from './profileNav.types';

export function ProfileNav({
  mainItems,
  footerItems,
  className,
  collapseBreakpoint,
  footerListLabel,
  id,
  initialCollapsed,
}: ProfileNavProps = {}) {
  const { logout } = useAuth();
  const { texts } = useI18n();
  const lang = useLang();
  const labels = resolveProfileNavLabels(texts);

  const resolvedMainItems = toSideNavItems(
    mainItems ?? buildDefaultProfileNavMainItems(lang, labels),
  );

  const resolvedFooterItems = toSideNavItems(
    footerItems ?? buildDefaultProfileNavFooterItems(lang, labels),
  );

  return (
    <SideNav
      className={className}
      mainItems={resolvedMainItems}
      footerItems={resolvedFooterItems}
      onLogout={logout}
      logoutLabel={labels.logout}
      navigationLabel={labels.navigationLabel}
      mainListLabel={labels.mainListLabel}
      footerListLabel={footerListLabel ?? labels.footerListLabel}
      collapseLabel={labels.collapse}
      expandLabel={labels.expand}
      collapseBreakpoint={collapseBreakpoint}
      id={id}
      initialCollapsed={initialCollapsed}
    />
  );
}
