'use client';

import { useState } from 'react';
import styles from './page.module.css';
import {
  fallbackGlobalError,
  useAdmin,
  useI18n,
  type AlertVisualState,
} from '@/packages/contexts';
import AlertPopup from '@/packages/components/alert/alertPopup/AlertPopup';
import { FormWrapper } from '@/packages/components/client/user/profile';
import ThemeToggler from '@/packages/components/themeToggler/ThemeToggler';
import LanguageSwitcher from '@/packages/components/languageSwitcher/LanguageSwitcher';
import { getPopup } from '@/packages/utils/alertType';

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
  const { admin, updateAdmin, reloadAdmin } = useAdmin();
  const { texts } = useI18n();
  const popups = texts.popups;
  const edit: EditData = texts.pages.client.user.edit;
  const formText = texts.components.client.form;
  const editButton = formText.button.edit;
  const globalErrorPopup = getPopup(
    popups,
    'GLOBAL_INTERNAL_ERROR',
    'GLOBAL_INTERNAL_ERROR',
    fallbackGlobalError
  );
  const authGetSuccessPopup = getPopup(
    popups,
    'AUTH_GET_SUCCESS',
    'AUTH_GET_SUCCESS',
    fallbackGlobalError
  );

  const [alert, setAlert] = useState<{
    variant: Extract<AlertVisualState, 'success' | 'error'>;
    title: string;
    description: string;
  } | null>(null);

  const handleEdit = async (data: EditFormData) => {
    try {
      if (!data.name || !data.phone) {
        setAlert({
          variant: 'error',
          title: globalErrorPopup.title,
          description: globalErrorPopup.description,
        });
        return;
      }
      await updateAdmin({
        name: data.name,
        phone: data.phone,
      });

      setAlert({
        variant: 'success',
        title: authGetSuccessPopup.title,
        description: authGetSuccessPopup.description,
      });
      await reloadAdmin();
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } catch {
      setAlert({
        variant: 'error',
        title: globalErrorPopup.title,
        description: globalErrorPopup.description,
      });
    }
  };

  if (!admin) return <p>Loading...</p>;
  return (
    <section className={`${styles.section} glass-panel--base`}>
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
            name: admin.name || '',
            phone: admin.phone || '',
          }}
          loading={false}
        />
        {admin.address ? <p>{admin.address}</p> : null}
      </article>
      {alert && (
        <AlertPopup
          variant={alert.variant}
          title={alert.title}
          description={alert.description}
          media={{
            kind: 'image',
            src: `/shared/alert/${alert.variant}.svg`,
            alt: alert.variant === 'success' ? 'Success' : 'Error',
          }}
          primaryAction={{ label: 'Cerrar', onAction: () => setAlert(null) }}
        />
      )}
    </section>
  );
}
