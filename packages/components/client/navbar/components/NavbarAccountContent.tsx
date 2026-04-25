import { LuLogOut } from 'react-icons/lu';
import type { NavLinkItem } from '../navbar.types';
import { NavbarLinkList } from './NavbarLinkList';

export interface NavbarAccountContentProps {
  authIsLogged: boolean;
  userLinks: NavLinkItem[];
  logoutLabel: string;
  onItemClick: (href: string) => void;
  onLogoutClick: () => void;
  bellSlot?: (() => JSX.Element) | null;
  listClassName: string;
  buttonClassName: string;
  itemClassName?: string;
  iconClassName?: string;
  featureListClassName?: string;
  featureItemClassName?: string;
}

export function NavbarAccountContent({
  authIsLogged,
  userLinks,
  logoutLabel,
  onItemClick,
  onLogoutClick,
  bellSlot,
  listClassName,
  buttonClassName,
  itemClassName,
  iconClassName,
  featureListClassName,
  featureItemClassName,
}: NavbarAccountContentProps) {
  const BellSlot = bellSlot;

  return (
    <>
      {BellSlot ? (
        <ul className={featureListClassName ?? listClassName}>
          <li className={featureItemClassName ?? itemClassName}>
            <BellSlot />
          </li>
        </ul>
      ) : null}
      <NavbarLinkList
        items={userLinks}
        onItemClick={onItemClick}
        listClassName={listClassName}
        itemClassName={itemClassName}
        buttonClassName={buttonClassName}
        iconClassName={iconClassName}
      />
      {authIsLogged ? (
        <ul className={listClassName}>
          <li className={itemClassName}>
            <button
              type="button"
              className={buttonClassName}
              onClick={onLogoutClick}
              aria-label={logoutLabel}
            >
              <span className={iconClassName}>
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
