'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { HiMiniLanguage } from 'react-icons/hi2';
import type { AppLanguage } from '../../types';
import { useOptionalAdminContext } from '../../contexts/admin/AdminContext';
import { useOptionalProfileContext } from '../../contexts/profile/ProfileContext';
import { useOptionalWorkerContext } from '../../contexts/worker/WorkerContext';
import sharedStyles from '../client/navbar/NavbarShared.module.css';
import linkListStyles from '../client/navbar/components/NavbarLinkList.module.css';
import styles from './LanguageSwitcher.module.css';
import type { ResolvedNavbarLanguageSwitcher } from '../client/navbar/navbar.shared';
import { useFocusTrap } from '../../utils/accessibility/useFocusTrap';

const SUPPORTED_LANGUAGES: AppLanguage[] = ['de', 'en', 'es'];

type LanguageOption = {
  code: AppLanguage;
  label: string;
  shortLabel: string;
  switchLabel: string;
};

interface LanguageSwitcherProps {
  presentation?: 'dropdown' | 'modal';
  triggerDisplay?: 'icon' | 'icon-with-value';
  dropdownPlacement?: 'top' | 'bottom';
  panelVariant?: 'default' | 'navbar';
  labels?: ResolvedNavbarLanguageSwitcher;
  portalContainer?: HTMLElement | null;
}

type DropdownPosition = {
  top: number;
  right: number;
};

export default function LanguageSwitcher({
  presentation = 'dropdown',
  triggerDisplay = 'icon',
  dropdownPlacement = 'bottom',
  panelVariant = 'default',
  labels,
  portalContainer,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const adminContext = useOptionalAdminContext();
  const profileContext = useOptionalProfileContext();
  const workerContext = useOptionalWorkerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    right: 0,
  });
  const switcherRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const currentOptionRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const titleId = useId();

  const setLanguage =
    adminContext?.setLanguage ?? profileContext?.setLanguage ?? workerContext?.setLanguage;
  const currentPathLang = pathname.split('/')[1];
  const currentLang = SUPPORTED_LANGUAGES.includes(currentPathLang as AppLanguage)
    ? (currentPathLang as AppLanguage)
    : 'de';
  const isModalPresentation = presentation === 'modal';

  const languageOptions: LanguageOption[] = [
    {
      code: 'de',
      label: labels?.options?.de?.label ?? 'Deutsch',
      shortLabel: labels?.options?.de?.shortLabel ?? 'DE',
      switchLabel: labels?.options?.de?.switchLabel ?? 'Switch language to German',
    },
    {
      code: 'en',
      label: labels?.options?.en?.label ?? 'English',
      shortLabel: labels?.options?.en?.shortLabel ?? 'EN',
      switchLabel: labels?.options?.en?.switchLabel ?? 'Switch language to English',
    },
    {
      code: 'es',
      label: labels?.options?.es?.label ?? 'Español',
      shortLabel: labels?.options?.es?.shortLabel ?? 'ES',
      switchLabel: labels?.options?.es?.switchLabel ?? 'Switch language to Spanish',
    },
  ];
  const currentLanguage =
    languageOptions.find((option) => option.code === currentLang) ?? languageOptions[0];
  const shouldShowCurrentValue = triggerDisplay === 'icon-with-value';
  const triggerLabel = isOpen
    ? (labels?.closeButtonLabel ?? 'Close language selector')
    : `${labels?.currentLanguageLabel ?? labels?.title ?? 'Language'}: ${currentLanguage.label}`;

  const closeSwitcher = ({ restoreFocus = true }: { restoreFocus?: boolean } = {}) => {
    setIsOpen(false);

    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  };

  useFocusTrap({
    enabled: isOpen,
    containerRef: panelRef,
    initialFocusRef: currentOptionRef,
    returnFocusRef: triggerRef,
    onEscape: () => closeSwitcher({ restoreFocus: false }),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (!switcherRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || isModalPresentation) return;

    const updateDropdownPosition = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      const panelHeight = panelRef.current?.offsetHeight ?? 0;

      if (!triggerRect) return;

      setDropdownPosition({
        top:
          dropdownPlacement === 'top'
            ? Math.max(16, triggerRect.top - panelHeight - 24)
            : triggerRect.bottom + 24,
        right: window.innerWidth - triggerRect.right,
      });
    };

    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [dropdownPlacement, isModalPresentation, isOpen]);

  const switchLanguage = async (nextLanguage: AppLanguage) => {
    if (nextLanguage === currentLang) {
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    Cookies.set('lang', nextLanguage, { path: '/', expires: 365 });

    if (setLanguage) {
      await setLanguage(nextLanguage);
    }

    const segments = pathname.split('/');

    if (SUPPORTED_LANGUAGES.includes(segments[1] as AppLanguage)) {
      segments[1] = nextLanguage;
    }

    setIsOpen(false);
    triggerRef.current?.focus();
    router.push(segments.join('/'));
  };

  const switcherContent = (
    <div
      className={
        isModalPresentation
          ? `${styles.modalRoot} ${isOpen ? styles.modalRootOpen : ''} card--neutral`
          : `${styles.dropdown} ${
              dropdownPlacement === 'top' ? styles.dropdownTop : styles.dropdownBottom
            } ${isOpen ? styles.dropdownOpen : ''}`
      }
      style={
        isModalPresentation
          ? undefined
          : {
              top: `${dropdownPosition.top}px`,
              right: `${dropdownPosition.right}px`,
            }
      }
      onPointerDown={isModalPresentation ? (event) => event.stopPropagation() : undefined}
    >
      {isModalPresentation ? (
        <button
          type="button"
          className={styles.modalBackdrop}
          aria-label={labels?.closeButtonLabel ?? 'Close language selector'}
          onClick={() => closeSwitcher()}
          tabIndex={isOpen ? 0 : -1}
        />
      ) : null}
      <section
        ref={panelRef}
        id={menuId}
        className={`card card--neutral ${styles.panel} ${
          isModalPresentation ? styles.modalPanel : ''
        } ${isOpen ? styles.panelOpen : ''}`}
        tabIndex={-1}
        aria-labelledby={isOpen ? titleId : undefined}
        aria-hidden={!isOpen}
        role={isModalPresentation ? 'dialog' : undefined}
        aria-modal={isModalPresentation ? 'true' : undefined}
      >
        <div
          className={`${styles.header} ${sharedStyles.panelHeader} ${
            panelVariant === 'navbar' ? styles.headerNavbar : ''
          }`}
        >
          <h2
            id={titleId}
            className={`type-label ${sharedStyles.panelTitle} ${styles.title} ${
              panelVariant === 'navbar' ? styles.titleNavbar : ''
            }`}
          >
            {labels?.title ?? 'Language'}
          </h2>
        </div>

        <ul
          className={`${sharedStyles.panelList} ${
            isModalPresentation
              ? sharedStyles.panelListAnimated
              : sharedStyles.panelListAnimatedDown
          } ${panelVariant === 'navbar' ? linkListStyles.panelList : ''} ${styles.list}`}
        >
          {languageOptions.map((option) => {
            const isCurrent = option.code === currentLang;

            return (
              <li
                key={option.code}
                className={panelVariant === 'navbar' ? linkListStyles.panelItem : ''}
              >
                <button
                  ref={option.code === currentLang ? currentOptionRef : undefined}
                  type="button"
                  className={[
                    'button',
                    'button--ghost',
                    panelVariant === 'navbar' ? linkListStyles.panelButton : styles.optionButton,
                    panelVariant === 'navbar' ? styles.optionButtonNavbar : '',
                    isCurrent ? styles.optionButtonCurrent : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => void switchLanguage(option.code)}
                  aria-current={isCurrent ? 'true' : undefined}
                  aria-label={isCurrent ? option.label : option.switchLabel}
                >
                  <span className={styles.optionMetaShell} aria-hidden>
                    <span className={styles.optionMeta}>{option.shortLabel}</span>
                  </span>
                  <span className={styles.optionLabel}>{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );

  return (
    <div className={styles.switcher} ref={switcherRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`button button--ghost ${sharedStyles.iconButton} ${styles.trigger} ${
          shouldShowCurrentValue ? styles.triggerWithValue : ''
        }`}
        aria-label={triggerLabel}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => {
          if (isOpen) {
            closeSwitcher();
            return;
          }

          setIsOpen(true);
        }}
        title={triggerLabel}
      >
        <HiMiniLanguage aria-hidden />
        {shouldShowCurrentValue ? (
          <span className={` ${styles.triggerValue} type-body-sm`}>{currentLanguage.label}</span>
        ) : null}
      </button>

      {isMounted
        ? (createPortal(
            switcherContent,
            portalContainer ?? document.body
          ) as unknown as JSX.Element)
        : null}
    </div>
  );
}
