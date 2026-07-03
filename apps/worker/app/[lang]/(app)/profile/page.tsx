'use client';

import { useState } from 'react';
import Image from 'next/image';

import styles from './page.module.css';
import { getPopup } from '@/packages/utils/alertType';
import type { UpdateWorkerProfilePayload } from '@/packages/types';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackLoadingMessages,
  fallbackPopups,
  useGlobalAlert,
  useI18n,
  useWorker,
} from '@/packages/contexts';
import { FormWrapper } from '@/packages/components/client/user/profile';
import LanguageSwitcher from '@/packages/components/languageSwitcher/LanguageSwitcher';
import ThemeToggler from '@/packages/components/themeToggler/ThemeToggler';

type WorkerProfileFormData = Pick<UpdateWorkerProfilePayload, 'name' | 'phone'>;

type WorkerProfileTexts = {
  manageAccount?: string;
  memberSince?: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  theme?: {
    title?: string;
  };
  language?: {
    title?: string;
  };
};

export default function WorkerProfilePage() {
  const { texts } = useI18n();
  const popups = texts.popups;
  const formText = texts.components.client.form;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const profileTexts = texts.pages?.client?.user?.profile as WorkerProfileTexts | undefined;
  const alertButtons = { ...fallbackButtons, ...texts.popups?.button };

  const { worker, updateWorker, reloadWorker } = useWorker();
  const { showError, showLoading, showSuccess, closeAlert } = useGlobalAlert();
  const [saving, setSaving] = useState(false);

  const handleProfileUpdate = async (data: WorkerProfileFormData) => {
    try {
      if (!worker.userClientId || !worker.clientId) {
        const popupData = getPopup(
          popups,
          'USER_NEED_TO_LOGIN',
          'USER_NEED_TO_LOGIN',
          fallbackPopups.USER_NEED_TO_LOGIN
        );

        showError({
          response: {
            status: 401,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close ?? alertButtons.close,
          },
          onCancel: closeAlert,
        });
        return false;
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

      await updateWorker({
        name: data.name?.trim(),
        phone: data.phone?.trim(),
      });
      await reloadWorker();

      const successPopup = getPopup(
        popups,
        'WORKER_UPDATED',
        'WORKER_UPDATED',
        fallbackPopups.AUTH_GET_SUCCESS
      );

      showSuccess({
        response: {
          status: 200,
          title: successPopup.title,
          description: successPopup.description,
          cancelLabel: alertButtons.close,
        },
        onCancel: closeAlert,
      });

      return true;
    } catch {
      const errorPopup = getPopup(
        popups,
        'GLOBAL_INTERNAL_ERROR',
        'GLOBAL_INTERNAL_ERROR',
        fallbackGlobalError
      );

      showError({
        response: {
          status: 500,
          title: errorPopup.title,
          description: errorPopup.description,
          cancelLabel: errorPopup.close ?? alertButtons.close,
        },
        onCancel: closeAlert,
      });

      return false;
    } finally {
      setSaving(false);
    }
  };

  const editButton = formText.button.edit;
  const avatarAlt = worker.name ? `${worker.name} avatar` : 'Worker avatar';

  return (
    <div className={styles.wrapper}>
      <section
        className={`${styles.section} glass-panel--base`}
        aria-labelledby="worker-profile-title"
        aria-describedby="worker-profile-description"
      >
        <header className={styles.header}>
          <p className={styles.eyebrow}>Worker Profile</p>
          <h1 id="worker-profile-title" className={styles.h1}>
            {worker.name || profileTexts?.manageAccount || 'Manage worker account'}
          </h1>
          <p id="worker-profile-description" className={styles.subtitle}>
            Validate the worker complement beyond login with account details and preferences.
          </p>
          <div className={styles.avatarWrap}>
            <Image
              src={worker.profileImage || '/shared/avatars/avatar-1.png'}
              alt={avatarAlt}
              width={84}
              height={84}
              className={styles.image}
            />
          </div>
          <p className={styles.identity}>{worker.email || '-'}</p>
          <p className={styles.meta}>
            {profileTexts?.memberSince ?? 'Member since'}{' '}
            {worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : '-'}
          </p>
        </header>

        <div className={styles.content}>
          <article className={styles.infoCard}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{profileTexts?.email ?? 'Email'}</span>
                <span className={styles.infoValue}>{worker.email || '-'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{profileTexts?.phone ?? 'Phone'}</span>
                <span className={styles.infoValue}>{worker.phone || '-'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{profileTexts?.address ?? 'Address'}</span>
                <span className={styles.infoValue}>{worker.address || '-'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Role</span>
                <span className={styles.infoValue}>{worker.roles?.join(', ') || 'worker'}</span>
              </div>
            </div>
          </article>

          <article className={styles.preferencesCard}>
            <div className={styles.preferenceHeader}>
              <div>
                <p className={styles.preferenceEyebrow}>Preferences</p>
                <h2 className={styles.preferenceTitle}>Worker session complement</h2>
              </div>
            </div>
            <div className={styles.preferenceGrid}>
              <div className={styles.preferenceItem}>
                <span className={styles.infoLabel}>
                  {profileTexts?.language?.title ?? 'Language'}
                </span>
                <LanguageSwitcher triggerDisplay="icon-with-value" dropdownPlacement="bottom" />
              </div>
              <div className={styles.preferenceItem}>
                <span className={styles.infoLabel}>{profileTexts?.theme?.title ?? 'Theme'}</span>
                <ThemeToggler display="icon-with-value" variant="surface" />
              </div>
            </div>
          </article>

          <article className={styles.formCard}>
            <FormWrapper<WorkerProfileFormData>
              key={`${worker.name ?? ''}-${worker.phone ?? ''}-${worker.updatedAt ?? ''}`}
              fields={['name', 'phone'] as const}
              onSubmit={handleProfileUpdate}
              button={editButton}
              initialValues={{
                name: worker.name || '',
                phone: worker.phone || '',
              }}
              loading={saving}
            />
          </article>
        </div>
      </section>
    </div>
  );
}
