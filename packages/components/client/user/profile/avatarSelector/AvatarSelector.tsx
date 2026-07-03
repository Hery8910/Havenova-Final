'use client';
import type { JSX } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

import styles from './AvatarSelector.module.css';

import { getI18nFallbacks, useI18n } from '../../../../../contexts/i18n';
import { getPopup } from '@havenova/utils/alertType';
import { useLang } from '../../../../../hooks';
import { href } from '@havenova/utils/navigation';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import { useAuth, useGlobalAlert, useProfile } from '../../../../../contexts';

const avatarList = Array.from({ length: 10 }, (_, i) => `/shared/avatars/avatar-${i + 1}.png`);

export default function AvatarSelector() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackGlobalError, fallbackLoadingMessages, fallbackPopups } =
    getI18nFallbacks(language);
  const dialogTitleId = useId();
  const dialogDescriptionId = useId();
  const dialogRef = useRef<HTMLElement | null>(null);

  const popups = texts.popups;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const avatarSelectorTexts = texts?.pages?.client?.user?.profile?.details?.avatarSelector;

  const { profile, setProfileImage, reloadProfile } = useProfile();
  const { auth } = useAuth();
  const { showError, showSuccess, showLoading, showConfirm, closeAlert } = useGlobalAlert();
  const router = useRouter();
  const lang = useLang();

  const normalizeAvatar = (value?: string) => {
    if (!value) return '';
    if (value.startsWith('/')) return value;
    try {
      const parsed = new URL(value);
      if (parsed.pathname.startsWith('/avatars/')) return parsed.pathname;
    } catch {
      // ignore invalid URLs and return as-is
    }
    return value;
  };

  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    normalizeAvatar(profile?.profileImage) || avatarList[0]
  );

  useEffect(() => {
    setSelectedAvatar(normalizeAvatar(profile?.profileImage) || avatarList[0]);
  }, [profile?.profileImage]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, saving]);

  const openButtonLabel =
    avatarSelectorTexts?.openButton ??
    texts?.components?.client?.form?.labels?.profileImage ??
    'Change profile image';
  const closeButtonLabel = avatarSelectorTexts?.closeButton ?? 'Close avatar selector';
  const dialogTitle = avatarSelectorTexts?.title ?? 'Choose a profile avatar';
  const dialogDescription =
    avatarSelectorTexts?.description ?? 'Select one of the available images for your profile.';
  const avatarOptionsLabel = avatarSelectorTexts?.optionsLabel ?? 'Avatar options';
  const avatarListLabel = avatarSelectorTexts?.listAriaLabel ?? 'Avatar list';
  const chooseAvatarLabel = avatarSelectorTexts?.chooseAvatarAriaLabel ?? 'Choose avatar';
  const selectedAvatarLabel = avatarSelectorTexts?.selectedAvatarAriaLabel ?? 'Selected avatar';
  const submitLabel = avatarSelectorTexts?.submitButton ?? 'Choose selected';
  const savingLabel = avatarSelectorTexts?.saving ?? 'Saving...';

  const handleSubmit = async () => {
    try {
      if (!auth?.isLogged || auth.role === 'guest') {
        const popupData = getPopup(
          popups,
          'USER_NEED_TO_LOGIN',
          'USER_NEED_TO_LOGIN',
          fallbackPopups.USER_NEED_TO_LOGIN
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
        return;
      }

      if (!auth?.clientId || !selectedAvatar) {
        const validationPopup =
          (texts.popups as any)?.VALIDATION_ERROR ??
          (fallbackPopups as any).VALIDATION_ERROR ??
          fallbackGlobalError;

        showError({
          response: {
            status: 400,
            title: validationPopup.title,
            description: validationPopup.description,
            cancelLabel:
              validationPopup.close ?? texts.popups?.button?.close ?? fallbackButtons.close,
          },
          onCancel: closeAlert,
        });
        return;
      }

      setSaving(true);

      const loadingData = loadingText.createUser ?? fallbackLoadingMessages.createUser;
      showLoading({
        response: {
          status: 102,
          title: loadingData.title,
          description: loadingData.description,
        },
      });

      const resolvedAvatar = normalizeAvatar(selectedAvatar);

      await setProfileImage(resolvedAvatar);
      await reloadProfile();
      setOpen(false);

      const successPopup =
        (texts.popups as any)?.AUTH_GET_SUCCESS ?? (fallbackPopups as any).AUTH_GET_SUCCESS;

      showSuccess({
        response: {
          status: 200,
          title: successPopup.title,
          description: successPopup.description,
          cancelLabel: texts.popups?.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
    } catch (error) {
      const errorPopup = texts.popups?.GLOBAL_INTERNAL_ERROR ?? fallbackGlobalError;

      showError({
        response: {
          status: 500,
          title: errorPopup.title,
          description: errorPopup.description,
          cancelLabel: texts.popups?.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setSaving(false);
    }
  };

  const dialogPortal: JSX.Element | null =
    mounted && open
      ? (createPortal(
          <div
            className={`${styles.overlay} card card--neutral`}
            onClick={() => {
              if (!saving) setOpen(false);
            }}
          >
            <article
              ref={dialogRef}
              className={`${styles.article} card card--secondary`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={dialogTitleId}
              aria-describedby={dialogDescriptionId}
              tabIndex={-1}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={styles.closeButton}
                aria-label={closeButtonLabel}
                disabled={saving}
              >
                <IoClose aria-hidden="true" />
              </button>

              <div className={styles.modalContent}>
                <header className={styles.header}>
                  <h3 id={dialogTitleId} className={styles.title}>
                    {dialogTitle}
                  </h3>
                  <p id={dialogDescriptionId} className={styles.description}>
                    {dialogDescription}
                  </p>
                </header>

                <section className={styles.aside} aria-label={avatarOptionsLabel}>
                  <ul className={styles.ul} role="radiogroup" aria-label={avatarListLabel}>
                    {avatarList.map((src, index) => {
                      const isSelected = selectedAvatar === src;
                      const optionName = `${chooseAvatarLabel} ${index + 1}`;

                      return (
                        <li className={styles.li} key={src}>
                          <button
                            type="button"
                            role="radio"
                            className={styles.optionButton}
                            onClick={() => setSelectedAvatar(src)}
                            aria-label={optionName}
                            aria-checked={isSelected}
                            aria-describedby={isSelected ? dialogDescriptionId : undefined}
                          >
                            <Image
                              className={`${styles.image} ${isSelected ? styles.selected : ''}`}
                              src={src}
                              alt=""
                              width={60}
                              height={60}
                              aria-hidden="true"
                            />
                            {isSelected ? (
                              <span className={styles.srOnly}>
                                {selectedAvatarLabel} {index + 1}
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="button button--secondary"
                disabled={saving}
                aria-busy={saving}
              >
                {saving ? savingLabel : submitLabel}
              </button>
            </article>
          </div>,
          document.body
        ) as unknown as JSX.Element)
      : null;

  return (
    <section className={styles.main}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${styles.button} card card--neutral`}
        aria-label={openButtonLabel}
        title={openButtonLabel}
      >
        <MdOutlinePhotoCamera aria-hidden="true" />
      </button>
      {dialogPortal}
    </section>
  );
}
