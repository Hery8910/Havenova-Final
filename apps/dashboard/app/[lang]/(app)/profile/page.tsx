'use client';
import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import styles from './page.module.css';
import { getPopup } from '../../../../../../packages/utils/alertType';
import { UpdateAdminProfilePayload } from '../../../../../../packages/types';
import {
  useAdmin,
  fallbackButtons,
  fallbackGlobalError,
  fallbackLoadingMessages,
  fallbackPopups,
  useGlobalAlert,
  useI18n,
} from '../../../../../../packages/contexts';
import { useLang } from '../../../../../../packages/hooks';
import { useRequireLogin } from '../../../../../../packages/hooks/useRequireLogin';
import { href } from '../../../../../../packages/utils';
import { FormWrapper } from '../../../../../../packages/components/client/user/profile';

type ProfileFormData = Pick<
  UpdateAdminProfilePayload,
  'name' | 'phone'
>;
export interface ProfileData {
  greeting?: string;
  manageAccount: string;
  memberSince: string;
  verified: string;
  notVerified?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  theme: {
    title: string;
    light: string;
    dark: string;
  };
  language: {
    title: string;
    lang: string;
  };
  notLoggedInTitle: string;
  notLoggedInText: string;
  loginButton: string;
}

const Profile = () => {
  const { texts } = useI18n();
  const profileTexts: ProfileData = texts?.pages?.client.user.profile;
  const popups = texts.popups;
  const formText = texts.components.client.form;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const [saving, setSaving] = useState(false);

  const { admin, updateAdmin, reloadAdmin } = useAdmin();
  const { showError, showConfirm, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const router = useRouter();
  const lang = useLang();

  useRequireLogin();

  const handleProfileUpdate = async (data: ProfileFormData) => {
    try {
      if (!admin.userClientId || !admin.clientId) {
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

      setSaving(true);

      const loadingData = loadingText.createUser ?? fallbackLoadingMessages.createUser;

      showLoading({
        response: {
          status: 102,
          title: loadingData.title,
          description: loadingData.description,
        },
      });

      await updateAdmin({
        name: data?.name?.trim(),
        phone: data?.phone?.trim(),
      });
      await reloadAdmin();

      const successPopup = getPopup(
        popups,
        'AUTH_GET_SUCCESS',
        'AUTH_GET_SUCCESS',
        fallbackPopups.AUTH_GET_SUCCESS
      );

      showSuccess({
        response: {
          status: 200,
          title: successPopup.title,
          description: successPopup.description,
          cancelLabel: texts.popups?.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
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
          cancelLabel: errorPopup.close ?? texts.popups?.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setSaving(false);
    }
  };

  const editButton = formText.button.edit;
  const avatarAlt = admin.name
    ? `${admin.name} avatar`
    : (profileTexts?.manageAccount ?? 'User avatar');

  return (
    <div className={styles.wrapper}>
      <section
        className={`${styles.section} glass-panel--base`}
        aria-labelledby="profile-title"
        aria-describedby="profile-description"
      >
        <header className={styles.header}>
          <p className={styles.eyebrow}>Account Overview</p>
          <h1 id="profile-title" className={styles.h1}>
            {admin.name || profileTexts?.name}
          </h1>
          <div className={styles.avatarWrap}>
            <Image
              src={admin.profileImage || '/shared/avatars/avatar-1.png'}
              alt={avatarAlt}
              width={84}
              height={84}
              className={styles.image}
            />
          </div>
          <p className={styles.identity}>{admin.email || ''}</p>
          <p className={styles.meta}>
            {profileTexts?.memberSince}{' '}
            {admin?.createdAt ? new Date(admin.createdAt).toLocaleDateString() : ''}
          </p>
          <aside aria-label={profileTexts?.manageAccount}></aside>
        </header>

        <div className={styles.content}>
          <article className={styles.infoCard}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{profileTexts?.email}</span>
                <span className={styles.infoValue}>{admin.email || '-'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{profileTexts?.phone}</span>
                <span className={styles.infoValue}>{admin.phone || '-'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>{profileTexts?.address}</span>
                <span className={styles.infoValue}>{admin.address || '-'}</span>
              </div>
            </div>
          </article>

          <article className={styles.formCard}>
            <FormWrapper<ProfileFormData>
              key={`${admin.name ?? ''}-${admin.phone ?? ''}-${admin.updatedAt ?? ''}`}
              fields={['name', 'phone'] as const}
              onSubmit={handleProfileUpdate}
              button={editButton}
              initialValues={{
                name: admin.name || '',
                phone: admin.phone || '',
              }}
              loading={saving}
            />
          </article>
        </div>
      </section>
    </div>
  );
};

export default Profile;
