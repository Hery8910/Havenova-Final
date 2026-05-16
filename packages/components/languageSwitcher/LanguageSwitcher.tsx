'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { HiMiniLanguage } from 'react-icons/hi2';
import type { AppLanguage } from '../../types';
import { useOptionalProfileContext } from '../../contexts/profile/ProfileContext';
import { useOptionalWorkerContext } from '../../contexts/worker/WorkerContext';
import sharedStyles from '../client/navbar/NavbarShared.module.css';
import styles from './LanguageSwitcher.module.css';
import type { ResolvedNavbarLanguageSwitcher } from '../client/navbar/navbar.shared';

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
  labels?: ResolvedNavbarLanguageSwitcher;
}

type DropdownPosition = {
  top: number;
  right: number;
};

export default function LanguageSwitcher({
  presentation = 'dropdown',
  triggerDisplay = 'icon',
  labels,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
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
  const firstOptionRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const titleId = useId();

  const setLanguage = profileContext?.setLanguage ?? workerContext?.setLanguage;
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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isModalPresentation) {
          event.preventDefault();
          event.stopPropagation();
        }
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown, isModalPresentation);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown, isModalPresentation);
    };
  }, [isModalPresentation, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    firstOptionRef.current?.focus();
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || isModalPresentation) return;

    const updateDropdownPosition = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect();

      if (!triggerRect) return;

      setDropdownPosition({
        top: triggerRect.bottom + 24,
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
  }, [isModalPresentation, isOpen]);

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

  const closeSwitcher = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const switcherContent = (
    <div
      className={
        isModalPresentation
          ? `${styles.modalRoot} ${isOpen ? styles.modalRootOpen : ''} card--neutral`
          : `${styles.dropdown} ${isOpen ? styles.dropdownOpen : ''}`
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
          onClick={closeSwitcher}
          tabIndex={isOpen ? 0 : -1}
        />
      ) : null}
      <section
        ref={panelRef}
        id={menuId}
        className={`card card--neutral ${styles.panel} ${
          isModalPresentation ? styles.modalPanel : ''
        } ${isOpen ? styles.panelOpen : ''}`}
        aria-labelledby={isOpen ? titleId : undefined}
        aria-hidden={!isOpen}
        role={isModalPresentation ? 'dialog' : undefined}
        aria-modal={isModalPresentation ? 'true' : undefined}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={`${sharedStyles.panelTitle} ${styles.title}`}>
            {labels?.title ?? 'Language'}
          </h2>
        </div>

        <ul
          className={`${sharedStyles.panelList} ${
            isModalPresentation
              ? sharedStyles.panelListAnimated
              : sharedStyles.panelListAnimatedDown
          } ${styles.list}`}
        >
          {languageOptions.map((option) => {
            const isCurrent = option.code === currentLang;

            return (
              <li key={option.code}>
                <button
                  ref={option.code === currentLang ? firstOptionRef : undefined}
                  type="button"
                  className={`button button--ghost ${styles.optionButton} ${
                    isCurrent ? styles.optionButtonCurrent : ''
                  }`}
                  onClick={() => void switchLanguage(option.code)}
                  aria-current={isCurrent ? 'true' : undefined}
                  aria-label={isCurrent ? option.label : option.switchLabel}
                >
                  <span className={`badge badge--primary ${styles.optionBadge}`} aria-hidden>
                    {option.shortLabel}
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
        } ${isOpen ? `${sharedStyles.iconButtonActive} ${styles.triggerOpen}` : ''}`}
        aria-label={triggerLabel}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((prev) => !prev)}
        title={triggerLabel}
      >
        <HiMiniLanguage aria-hidden />
        {shouldShowCurrentValue ? (
          <span className={styles.triggerValue}>{currentLanguage.label}</span>
        ) : null}
      </button>

      {isMounted ? (createPortal(switcherContent, document.body) as unknown as JSX.Element) : null}
    </div>
  );
}
