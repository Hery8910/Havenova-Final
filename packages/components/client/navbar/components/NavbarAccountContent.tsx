import { LuLogOut } from 'react-icons/lu';
import type { NavLinkItem } from '../navbar.types';
import sharedStyles from '../NavbarShared.module.css';
import { NavbarLinkList } from './NavbarLinkList';
import styles from './NavbarLinkList.module.css';

export interface NavbarAccountContentProps {
  authIsLogged: boolean;
  userLinks: NavLinkItem[];
  logoutLabel: string;
  onItemClick: (href: string) => void;
  onLogoutClick: () => void;
  bellSlot?: (() => JSX.Element) | null;
  animated?: boolean;
  animationDirection?: 'up' | 'down';
}

export function NavbarAccountContent({
  authIsLogged,
  userLinks,
  logoutLabel,
  onItemClick,
  onLogoutClick,
  bellSlot,
  animated = false,
  animationDirection = 'up',
}: NavbarAccountContentProps) {
  const BellSlot = bellSlot;
  const animatedClassName =
    animationDirection === 'down' ? sharedStyles.panelListAnimatedDown : sharedStyles.panelListAnimated;
  const panelListClassName = `${sharedStyles.panelList} ${animated ? animatedClassName : ''} ${styles.panelList}`.trim();
  const panelButtonClassName = `button button--ghost ${styles.panelButton}`;

  return (
    <>
      {BellSlot ? (
        <ul className={panelListClassName}>
          <li className={styles.panelItem}>
            <BellSlot />
          </li>
        </ul>
      ) : null}
      {userLinks.length ? (
        <NavbarLinkList
          items={userLinks}
          onItemClick={onItemClick}
          animated={animated}
          animationDirection={animationDirection}
        />
      ) : null}
      {authIsLogged ? (
        <ul className={panelListClassName}>
          <li className={styles.panelItem}>
            <button
              type="button"
              className={panelButtonClassName}
              onClick={onLogoutClick}
              aria-label={logoutLabel}
            >
              <span className={styles.panelIcon}>
                <LuLogOut aria-hidden />
              </span>
              <span>{logoutLabel}</span>
            </button>
          </li>
        </ul>
      ) : null}
    </>
  );
}
