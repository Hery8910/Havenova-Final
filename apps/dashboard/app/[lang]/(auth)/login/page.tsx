'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
import { useClient } from '@/packages/contexts/client/ClientContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import { FormWrapper } from '@/packages/components/userForm';
import Loading from '@/packages/components/loading/Loading';
import { AlertWrapper } from '@/packages/components/alert';
import { LoginPayload } from '@/packages/types';
import { href } from '@/packages/utils/navigation';
import { useLang } from '@/packages/hooks';
import { loginUser } from '../../../../../../packages/services/auth/authService';

export interface LoginData {
  title: string;
  cta: { title: string; label: string; url: string };
  forgotPassword: { title: string; label: string; url: string };
  image: { src: string; alt: string };
  backgroundImage: string;
  button: string;
}

const Login = () => {
  const { client } = useClient();
  const { texts } = useI18n();
  const router = useRouter();
  const lang = useLang();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const popups = texts.popups;
  const formText = texts.components.form;
  const login: LoginData = texts?.pages?.user.login;

  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

  const handleLogin = async (data: LoginPayload) => {
    setLoading(true);

    try {
      if (!client?._id) {
        const popupData = popups?.INTERNAL_ERROR || {};
        setAlert({
          status: 500,
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          description: popupData.description || popups.GLOBAL_INTERNAL_ERROR.description,
        });
        return;
      }
      if (!data.email || !data.password) {
        return;
      }
      const payload: LoginPayload = {
        email: data.email || '',
        password: data.password || '',
        clientId: client._id,
      };

      const response = await loginUser(payload);
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setRedirecting(true);
        setAlert({
          status: 200,
          title: popupData.title || popups.USER_LOGIN_SUCCESS.title,
          description: popupData.description || popups.USER_LOGIN_SUCCESS.description,
        });
      }
      setTimeout(async () => {
        await refreshUser();
        router.push(href(lang, '/'));
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
      <h1 className={styles.h1}>{login.title}</h1>
      <section className={`${styles.section} card`}>
        <FormWrapper<LoginPayload>
          fields={['email', 'password'] as const}
          onSubmit={handleLogin}
          button={formText.button.login}
          showForgotPassword
          initialValues={{
            clientId: '',
            email: '',
            password: '',
          }}
          loading={loading}
        />
        <aside className={styles.aside}>
          <p className={styles.p}>{login.cta.title}</p>
          <Link className={styles.link} href={login.cta.url}>
            {login.cta.label}
          </Link>
        </aside>
      </section>
    </main>
  );
};

export default Login;
