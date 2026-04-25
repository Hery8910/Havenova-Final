'use client';
import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

import styles from './AvatarSelector.module.css';

import {
  getI18nFallbacks,
  useI18n,
} from '../../../../../contexts/i18n';
import { getPopup } from '@havenova/utils/alertType';
import { useLang } from '../../../../../hooks';
import { href } from '@havenova/utils/navigation';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import { useAuth, useGlobalAlert, useProfile } from '../../../../../contexts';

const avatarList = Array.from({ length: 10 }, (_, i) => `/avatars/avatar-${i + 1}.png`);

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

  return (
    <section className={styles.main}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={styles.button}
        aria-label={
          texts?.components?.client?.form?.labels?.profileImage || 'Change profile image'
        }
        title={texts?.components?.client?.form?.labels?.profileImage || 'Change profile image'}
      >
        <MdOutlinePhotoCamera aria-hidden="true" />
      </button>
      {mounted &&
        open &&
        createPortal(
          <div
            className={styles.overlay}
            onClick={() => {
              if (!saving) setOpen(false);
            }}
          >
            <article
              ref={dialogRef}
              className={`${styles.article} glass-panel--base`}
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
                aria-label="Close avatar selector"
                disabled={saving}
              >
                <IoClose aria-hidden="true" />
              </button>

              <div className={styles.modalContent}>
                <header className={styles.header}>
                  <h3 id={dialogTitleId} className={styles.title}>
                    Choose a profile avatar
                  </h3>
                  <p id={dialogDescriptionId} className={styles.description}>
                    Select one of the available images for your profile.
                  </p>
                </header>

                <aside className={styles.aside} aria-label="Avatar options">
                  <ul className={styles.ul} role="listbox" aria-label="Avatar list">
                    {avatarList.map((src) => (
                      <li
                        className={styles.li}
                        key={src}
                        role="option"
                        aria-selected={selectedAvatar === src}
                        tabIndex={0}
                        onClick={() => setSelectedAvatar(src)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedAvatar(src);
                          }
                        }}
                        aria-label={`Choose avatar ${src.split('/').pop()}`}
                      >
                        <Image
                          className={`${styles.image} ${selectedAvatar === src ? styles.selected : ''}`}
                          src={src}
                          alt=""
                          width={60}
                          height={60}
                          aria-hidden="true"
                        />
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className={styles.submitButton}
                disabled={saving}
                aria-busy={saving}
              >
                {saving ? 'Saving...' : 'Choose Selected'}
              </button>
            </article>
          </div>,
          document.body
        )}
    </section>
  );
}
