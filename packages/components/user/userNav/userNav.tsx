'use client';
import styles from './userNav.module.css';
import { useRouter } from 'next/navigation';
import { useAuth, useI18n } from '../../../contexts';
import { useLang } from '../../../hooks';
import { href } from '../../../utils';
import { CgProfile } from 'react-icons/cg';
import { useEffect, useRef, useState } from 'react';

export interface UserNavProps {
  isMobile: boolean;
}

export function UserNav({ isMobile }: UserNavProps) {
  const router = useRouter();
  const { auth } = useAuth();
  const { texts } = useI18n();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarTexts = texts?.components?.client?.avatar;
  const navbarTexts = texts?.components?.client?.navbar;
  const profileNavTexts = texts?.pages?.client?.user?.profileNav;
  const profileLabel = avatarTexts?.profile?.label ?? navbarTexts?.profile?.label ?? 'Profile';
  const profileAria = avatarTexts?.profile?.ariaLabel ?? profileLabel;
  const registerLabel =
    avatarTexts?.register?.label ?? navbarTexts?.register?.[0]?.label ?? 'Register';
  const registerAria = avatarTexts?.register?.ariaLabel ?? registerLabel;
  const loginLabel = avatarTexts?.login?.label ?? navbarTexts?.register?.[1]?.label ?? 'Login';
  const loginAria = avatarTexts?.login?.ariaLabel ?? loginLabel;
  const detailsLabel = profileNavTexts?.profile ?? 'Details';
  const requestsLabel = profileNavTexts?.requests ?? 'Requests';
  const notificationsLabel = profileNavTexts?.notifications ?? 'Notifications';
  const settingsLabel = profileNavTexts?.settings ?? 'Settings';
  const editLabel = texts?.pages?.client?.user?.edit?.title ?? 'Edit';

  const guestLinks = [
    { href: '/user/register', label: registerLabel, ariaLabel: registerAria },
    { href: '/user/login', label: loginLabel, ariaLabel: loginAria },
  ];

  const userGroups = [
    {
      title: detailsLabel,
      links: [
        { href: '/profile', label: detailsLabel },
        { href: '/profile/edit', label: editLabel },
      ],
    },
    {
      title: requestsLabel,
      links: [{ href: '/profile/requests', label: requestsLabel }],
    },
    {
      title: notificationsLabel,
      links: [{ href: '/profile/notification', label: notificationsLabel }],
    },
    {
      title: settingsLabel,
      links: [{ href: '/profile/edit', label: settingsLabel }],
    },
  ];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleNavigate = (path: string) => {
    setOpen(false);
    router.push(href(lang, path));
  };

  return (
    <section className={styles.section} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={styles.icon}
        aria-label={profileAria}
        aria-expanded={open}
        aria-controls="avatar-navigation-menu"
      >
        <CgProfile />
      </button>

      {open && (
        <div
          id="avatar-navigation-menu"
          className={`${styles.dropdownPanel} ${isMobile ? styles.dropdownPanelMobile : styles.dropdownPanelDesktop}`}
        >
          <div className={styles.dropdownInner}>
            {auth.isLogged ? (
              <nav className={styles.nav} aria-label={profileAria}>
                <ul className={styles.groupList}>
                  {userGroups.map((group) => (
                    <li key={group.title} className={styles.groupItem}>
                      <span className={styles.groupTitle}>{group.title}</span>
                      <div className={styles.linkColumn}>
                        {group.links.map((link) => (
                          <button
                            key={link.href}
                            type="button"
                            onClick={() => handleNavigate(link.href)}
                            className={styles.navLink}
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <nav className={styles.nav} aria-label={profileAria}>
                <ul className={styles.guestList}>
                  {guestLinks.map((link) => (
                    <li key={link.href} className={styles.guestItem}>
                      <button
                        type="button"
                        onClick={() => handleNavigate(link.href)}
                        className={styles.navLink}
                        aria-label={link.ariaLabel}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
