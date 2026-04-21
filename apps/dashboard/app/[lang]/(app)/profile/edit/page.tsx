'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useProfile } from '@/packages/contexts/profile/ProfileContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import AlertPopup from '@/packages/components/alert/alertPopup/AlertPopup';
import { FormWrapper } from '@/packages/components/client/user/auth';
import ThemeToggler from '@/packages/components/themeToggler/ThemeToggler';
import LanguageSwitcher from '@/packages/components/languageSwitcher/LanguageSwitcher';
import { formatUserAddress } from '@/packages/types';

export interface ThemeData {
  title: string;
  theme: string;
  lang: string;
}
export interface EditData {
  title: string;
  description: string;
  subheading?: string;
  theme: ThemeData;
  personalInfo: string;
  password: string;
}
interface EditFormData {
  name: string;
  phone: string;
}

export default function Edit() {
  const { profile, updateProfile, reloadProfile } = useProfile();
  const { texts } = useI18n();
  const popups = texts.popups;
  const edit: EditData = texts.pages.client.user.edit;
  const formText = texts.components.client.form;
  const editButton = formText.button.edit;

  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  const handleEdit = async (data: EditFormData) => {
    try {
      if (!data.name || !data.phone) {
        setAlert({
          type: 'error',
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
        return;
      }
      await updateProfile({
        name: data.name,
        phone: data.phone,
      });

      setAlert({
        type: 'success',
        title: popups.AUTH_GET_SUCCESS.title,
        description: popups.AUTH_GET_SUCCESS.description,
      });
      await reloadProfile();
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } catch {
      setAlert({
        type: 'error',
        title: popups.GLOBAL_INTERNAL_ERROR.title,
        description: popups.GLOBAL_INTERNAL_ERROR.description,
      });
    }
  };

  if (!profile) return <p>Loading...</p>;
  return (
    <section className={`${styles.section} card`}>
      <header className={styles.header}>
        <h3>{edit.title}</h3>
        <p>{edit.description}</p>
      </header>
      <article className={styles.article}>
        <h4 className={styles.h4}>{edit.theme.title}</h4>
        <aside>
          <div>
            <p>{edit.theme.theme}</p>
            <ThemeToggler />
          </div>
          <div>
            <p>{edit.theme.lang}</p>
            <LanguageSwitcher />
          </div>
        </aside>
      </article>
      <article className={styles.article}>
        <h4 className={styles.h4}>{edit.personalInfo}</h4>
        <FormWrapper<EditFormData>
          fields={['name', 'phone'] as const}
          onSubmit={handleEdit}
          button={editButton}
          initialValues={{
            name: profile.name || '',
            phone: profile.phone || '',
          }}
          loading={false}
        />
        {profile.primaryAddress && <p>{formatUserAddress(profile.primaryAddress)}</p>}
      </article>
      {alert && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onCancel={() => setAlert(null)}
        />
      )}
    </section>
  );
}
