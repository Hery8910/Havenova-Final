'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

import styles from './AvatarSelector.module.css';

import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackLoadingMessages,
  fallbackPopups,
  useI18n,
} from '../../../contexts/i18n';
import { getPopup } from '@havenova/utils/alertType';
import { useLang } from '../../../hooks';
import { href } from '@havenova/utils/navigation';
import { MdOutlinePhotoCamera } from 'react-icons/md';
import { useAuth, useGlobalAlert, useProfile } from '../../../contexts';

const avatarList = Array.from({ length: 10 }, (_, i) => `/avatars/avatar-${i + 1}.svg`);

export default function AvatarSelector() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { texts } = useI18n();

  const popups = texts.popups;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;

  const { profile, setProfileImage, reloadProfile } = useProfile();
  const { auth } = useAuth();
  const { showError, showSuccess, showLoading, showConfirm, closeAlert } = useGlobalAlert();
  const router = useRouter();
  const lang = useLang();

  const normalizeAvatar = (value?: string) => {
    if (!value) return '';
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      if (value.startsWith(origin)) return value.slice(origin.length);
    }
    return value;
  };

  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    normalizeAvatar(profile?.profileImage) || avatarList[0]
  );

  useEffect(() => {
    setSelectedAvatar(normalizeAvatar(profile?.profileImage) || avatarList[0]);
  }, [profile?.profileImage]);

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

      const resolvedAvatar =
        selectedAvatar.startsWith('http') || selectedAvatar.startsWith('https')
          ? selectedAvatar
          : typeof window !== 'undefined'
          ? `${window.location.origin}${selectedAvatar}`
          : selectedAvatar;

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
        aria-label={texts?.components?.client?.form?.labels?.name || 'Change profile image'}
        title={texts?.components?.client?.form?.labels?.profileImage || 'Change profile image'}
      >
        <MdOutlinePhotoCamera aria-hidden="true" />
      </button>
      {open && (
        <article
          className={`${styles.article} card`}
          role="dialog"
          aria-modal="true"
          aria-label="Choose a profile avatar"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="button_close"
            aria-label="Close avatar selector"
          >
            <IoClose aria-hidden="true" />
          </button>
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
      )}
    </section>
  );
}
