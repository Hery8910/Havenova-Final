'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TbPointFilled } from 'react-icons/tb';

import { FormWrapper } from '@/packages/components/user/userForm';
import { ButtonProps } from '@/packages/components/common/button/Button';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import { useProfile } from '@/packages/contexts/profile/ProfileContext';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackLoadingMessages,
  useAuth,
  useGlobalAlert,
} from '@/packages/contexts';
import { UpdateUserProfilePayload } from '@/packages/types';
import { fallbackPopups } from '@/packages/contexts/i18n';
import { href } from '@/packages/utils/navigation';
import { useLang } from '@/packages/hooks';
import { useRequireLogin } from '@/packages/hooks/useRequireLogin';

import styles from './page.module.css';
import { getPopup } from '../../../../../../packages/utils/alertType';
import AvatarSelector from '../../../../../../packages/components/user/avatarSelector/AvatarSelector';

type ProfileFormData = Pick<
  UpdateUserProfilePayload,
  'clientId' | 'name' | 'address' | 'phone' | 'language'
>;
export interface ProfileData {
  greeting: string;
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
  const profileTexts: ProfileData = texts?.pages?.user.profile;
  const popups = texts.popups;
  const formText = texts.components.form;
  const loadingText = texts.loadings?.message ?? fallbackLoadingMessages;
  const [saving, setSaving] = useState(false);

  const { profile: userProfile, updateProfile, reloadProfile } = useProfile();
  const { auth, loading: authLoading } = useAuth();
  const { showError, showConfirm, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const router = useRouter();
  const lang = useLang();

  useRequireLogin();

  const handleProfileUpdate = async (data: ProfileFormData) => {
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

      setSaving(true);

      const loadingData = loadingText.createUser ?? fallbackLoadingMessages.createUser;

      showLoading({
        response: {
          status: 102,
          title: loadingData.title,
          description: loadingData.description,
        },
      });

      await updateProfile({
        name: data?.name?.trim(),
        address: data?.address?.trim(),
        phone: data?.phone?.trim(),
      });
      await reloadProfile();

      const successPopup =
        (texts.popups as any)?.AUTH_GET_SUCCESS ?? fallbackPopups.AUTH_GET_SUCCESS;

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
          cancelLabel: errorPopup.close ?? texts.popups?.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setSaving(false);
    }
  };

  const editButton = formText.button.edit as ButtonProps;
  const avatarAlt = userProfile.name
    ? `${userProfile.name} avatar`
    : profileTexts?.manageAccount ?? 'User avatar';

  return (
    <div className={styles.wrapper}>
      <section
        className={`${styles.section} card`}
        aria-labelledby="profile-title"
        aria-describedby="profile-description"
      >
        <header className={styles.header}>
          <h3 id="profile-title" className={styles.h3}>
            {userProfile.name || profileTexts?.name}
          </h3>
          <div className={styles.div}>
            <Image
              src={userProfile.profileImage || '/avatars/avatar-1.svg'}
              alt={avatarAlt}
              width={70}
              height={70}
              className={styles.image}
            />
            <AvatarSelector />
          </div>
          <p>{auth.email}</p>
          <p>
            {profileTexts?.memberSince}{' '}
            {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : ''}
          </p>
          <aside aria-label={profileTexts?.manageAccount}></aside>
        </header>

        <FormWrapper<ProfileFormData>
          key={`${userProfile.name ?? ''}-${userProfile.address ?? ''}-${userProfile.phone ?? ''}`}
          fields={['name', 'address', 'phone'] as const}
          onSubmit={handleProfileUpdate}
          button={editButton}
          initialValues={{
            clientId: auth.clientId || '',
            name: userProfile.name || '',
            address: userProfile.address || '',
            phone: userProfile.phone || '',
            language: userProfile.language || 'de',
          }}
          loading={saving}
        />
      </section>
    </div>
  );
};

export default Profile;
