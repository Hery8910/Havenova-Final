'use client';
import { useState, useEffect } from 'react';
import { registerUser } from '../../../../../../packages/services/userService';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
// import UserContactForm from '../../../../../packages/components/Form/UserContactForm';
import { useClient } from '../../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../../packages/contexts/i18n/I18nContext';
import AlertPopup from '../../../../../../packages/components/alert/alertPopup/AlertPopup';
import { RegisterPayload } from '../../../../../../packages/types';
import Loading from '../../../../../../packages/components/loading/Loading';
import { AlertWrapper } from '../../../../../../packages/components/alert';
import { useUser } from '../../../../../../packages/contexts/user/UserContext';
import { FormWrapper } from '../../../../../../packages/components/userForm';

export interface RegisterData {
  tilte: string;
  description: string;
  cta: { title: string; label: string; url: string };
  image: { src: string; alt: string };
  backgroundImage: string;
  button: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  address: string;
  profileImage: string;
  language: string;
  theme: 'light' | 'dark';
  phone: string;
  clientId: string;
}

const Register = () => {
  const { client } = useClient();
  const { user } = useUser();
  const router = useRouter();
  const { texts } = useI18n();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const popups = texts.popups;
  const register: RegisterData = texts?.pages?.user.register;
  const formText = texts.components.form;
  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

  const handleRegister = async (data: RegisterPayload) => {
    setLoading(true);

    try {
      if (!client?._id || !user) {
        const popupData = popups?.INTERNAL_ERROR || {};
        setAlert({
          status: 500,
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          description: popupData.description || popups.GLOBAL_INTERNAL_ERROR.description,
        });

        return;
      }

      const payload: RegisterPayload = {
        name: data.name || '',
        email: data.email || '',
        password: data.password || '',
        address: data.address || '',
        phone: data.phone || '',
        profileImage: data.profileImage || user?.profileImage,
        language: data.language || user?.language,
        theme: data.theme || user?.theme,
        clientId: client._id,
      };

      if (
        !payload.name ||
        !payload.email ||
        !payload.password ||
        !payload.address ||
        !payload.phone ||
        !payload.profileImage ||
        !payload.language ||
        !payload.theme ||
        !payload.clientId
      ) {
        setAlert({
          status: 500,
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
        return;
      }

      const response = await registerUser(payload);
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setRedirecting(true);
        setAlert({
          status: 200,
          title: popupData.title || popups.USER_REGISTER_SUCCESS.title,
          description: popupData.description || popups.USER_REGISTER_SUCCESS.description,
        });
      }
      setTimeout(() => {
        router.push('/user/verify-email');
      }, 3000);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode;
        const popupData = popups?.[errorKey] || {};
        setAlert({
          status: error.response.status,
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          description:
            popupData.description ||
            error.response.data.message ||
            popups.GLOBAL_INTERNAL_ERROR.description,
        });
      } else {
        setAlert({
          status: 500,
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.h1}>{register?.tilte}</h1>
        <p className={styles.header_p}>{register?.description}</p>
      </header>
      <section className={`${styles.section} card`}>
        <FormWrapper<RegisterPayload>
          fields={[
            'name',
            'email',
            'password',
            'address',
            'phone',
            'profileImage',
            'language',
            'theme',
            'clientId',
          ]}
          onSubmit={handleRegister}
          button={formText.button.register}
          initialValues={{
            name: '',
            email: '',
            password: '',
            address: '',
            phone: '',
            profileImage: '',
            language: '',
            theme: 'light',
            clientId: '',
          }}
        />
        <aside className={styles.aside}>
          <p className={styles.header_p}>{register?.cta.title}</p>
          <Link className={styles.link} href={register?.cta.url}>
            {register?.cta.label}
          </Link>
        </aside>
      </section>
      {loading && !redirecting && <Loading theme={user?.theme || 'light'} />}
      {alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}
    </main>
  );
};

export default Register;
