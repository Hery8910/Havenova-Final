'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './page.module.css';
import Image from 'next/image';
import { loginUser } from '../../../../../packages/services/userService';
import Link from 'next/link';
import { useUser } from '../../../../../packages/contexts/user/UserContext';
import { ServiceRequestItem } from '../../../../../packages/types/services';
import { saveUserToStorage } from '../../../../../packages/utils/guestUserStorage';
import { useClient } from '../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../packages/contexts/i18n/I18nContext';
// import UserContactForm from '../../../../../packages/components/Form/UserContactForm';
import AlertPopup from '../../../../../packages/components/alertPopup/AlertPopup';

export interface LoginData {
  title: string;
  cta: { title: string; label: string; url: string };
  forgotPassword: { title: string; label: string; url: string };
  image: { src: string; alt: string };
  backgroundImage: string;
  button: string;
}
interface LoginFormData {
  email: string;
  password: string;
  clientId: string;
}
const Login = () => {
  const { refreshUser } = useUser();
  const { client } = useClient();
  const { texts } = useI18n();
  const router = useRouter();
  const popups = texts.popups;
  const login: LoginData = texts?.pages?.user.login;
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  const handleLogin = async (formData: LoginFormData) => {
    try {
      if (!client?._id) {
        const popupData = popups?.INTERNAL_ERROR || {};
        setAlert({
          type: 'error',
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          description: popupData.description || popups.GLOBAL_INTERNAL_ERROR.description,
        });
        return;
      }
      if (!formData.email || !formData.password) {
        return;
      }
      const response = await loginUser(formData);
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        await refreshUser();
        setAlert({
          type: 'success',
          title: popupData.title || popups.USER_LOGIN_SUCCESS.title,
          description: popupData.description || popups.USER_LOGIN_SUCCESS.description,
        });
      }
      setTimeout(() => {
        router.push('/');
      }, 3000);
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

  return (
    <section className={styles.section}>
      {/* <main className={styles.main}>
        <header className={`${styles.header} card`}>
          <h1 className={styles.h1}>{login?.title}</h1>
          <aside className={styles.aside}>
            <div>
              <p className={styles.header_p}>{login?.cta.title}</p>
              <Link className={styles.link} href={login?.cta.url}>
                {login?.cta.label}
              </Link>
            </div>
            <div>
              <p className={styles.header_p}>{login?.forgotPassword.title}</p>
              <Link className={styles.link} href={login?.forgotPassword.url}>
                {login?.forgotPassword.label}
              </Link>
            </div>
          </aside>
        </header>
        <aside className={styles.aside_form}>
          <UserContactForm
            fields={['email', 'password', 'clientId']}
            onSubmit={handleLogin}
            mode="login"
          />
        </aside>
      </main>
      {alert && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onClose={() => setAlert(null)}
        />
      )} */}
    </section>
  );
};

export default Login;
