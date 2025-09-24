'use client';

import { useState } from 'react';
import { useUser } from '../../../../../../packages/contexts/user/UserContext';
import { updateUser } from '../../../../../../packages/services/userService';
import styles from './page.module.css';
import { useClient } from '../../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../../packages/contexts/i18n/I18nContext';
// import UserContactForm from '../../../../../../packages/components/Form/UserContactForm';
import { useRouter } from 'next/navigation';
// import ChangePassword from '../../../../../../packages/components/user/changePassword/ChangePassword';
// import AvatarSelector from '../../../../../../packages/components/user/avatarSelector/AvatarSelector';
import AlertPopup from '../../../../../../packages/components/alert/alertPopup/AlertPopup';

export interface EditData {
  title: string;
  description: string;
  subheading: string;
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
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  const handleEdit = async (formData: EditFormData) => {
    try {
      if (!formData.name || !formData.address || !formData.phone || !formData.clientId) {
        setAlert({
          type: 'error',
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
        return;
      }
      const response = await updateUser(formData);
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
    <main className={styles.main}>
      {/* <header className={styles.header}>
        <h3>{edit.title}</h3>
        <p>{edit.description}</p>
      </header>
      <article className={styles.article}>
        <h4 className={styles.h4}>{edit.subheading}</h4>
        <AvatarSelector />
        <ChangePassword />
        <UserContactForm
          fields={['name', 'address', 'email', 'phone', 'clientId']}
          onSubmit={handleEdit}
          mode="edit"
        />
      </article>
      {alert && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onClose={() => setAlert(null)}
        />
      )} */}
    </main>
  );
}
