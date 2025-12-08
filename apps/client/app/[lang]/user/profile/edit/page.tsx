'use client';

import { useState } from 'react';
import { useUser } from '../../../../../../../packages/contexts/profile/ProfileContext';
import { updateUser } from '../../../../../../../packages/services/profile/profileService';
import styles from './page.module.css';
import { useClient } from '../../../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../../../packages/contexts/i18n/I18nContext';
import AlertPopup from '../../../../../../../packages/components/alert/alertPopup/AlertPopup';
import { FormWrapper } from '../../../../../../../packages/components/userForm';
import { UpdateUserPayload } from '../../../../../../../packages/types';
import { useRouter } from 'next/navigation';
import ThemeToggler from '../../../../../../../packages/components/themeToggler/ThemeToggler';
import LanguageSwitcher from '../../../../../../../packages/components/languageSwitcher/LanguageSwitcher';

export interface ThemeData {
  title: string;
  theme: string;
  lang: string;
}
export interface EditData {
  title: string;
  description: string;
  subheading: string;
  theme: ThemeData;
  personalInfo: string;
  password: string;
}
interface EditFormData {
  name: string;
  email: string;
  password: string;
  address: string;
  profileImage: string;
  phone: string;
  clientId: string;
}

export default function Edit() {
  const { user, refreshUser } = useUser();
  const { client } = useClient();
  const router = useRouter();
  const { texts } = useI18n();
  const popups = texts.popups;
  const edit: EditData = texts?.pages?.user.edit;
  const formText = texts.components.form;

  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  const handleEdit = async (data: UpdateUserPayload) => {
    try {
      if (!data.name || !data.address || !data.phone || !data.clientId) {
        setAlert({
          type: 'error',
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
        return;
      }
      const response = await updateUser(data);
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setAlert({
          type: 'success',
          title: popupData.title || popups.USER_EDIT_USER_UPDATE_SUCCESS.title,
          description: popupData.description || popups.USER_EDIT_USER_UPDATE_SUCCESS.description,
        });
        await refreshUser(); // Para refrescar el contexto y mostrar la nueva imagen
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode;
        const popupData = popups?.[errorKey] || {};
        setAlert({
          type: 'error',
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          description:
            popupData.description ||
            error.response.data.message ||
            popups.GLOBAL_INTERNAL_ERROR.description,
        });
      } else {
        setAlert({
          type: 'error',
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
      }
    }
  };

  if (!user) return <p>Loading...</p>;
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
        <FormWrapper<UpdateUserPayload>
          fields={['name', 'address', 'phone', 'clientId']}
          onSubmit={handleEdit}
          button={formText.button.edit}
          showForgotPassword
          initialValues={{
            name: '',
            address: '',
            phone: '',
            theme: user.theme,
            language: user.language,
            clientId: '',
          }}
        />
      </article>
      {alert && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onClose={() => setAlert(null)}
        />
      )}
    </section>
  );
}
