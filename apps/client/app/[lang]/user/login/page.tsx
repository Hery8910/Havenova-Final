'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { loginUser } from '@/packages/services/userService';
import Link from 'next/link';
import { useUser } from '@/packages/contexts/user/UserContext';
import { useClient } from '@/packages/contexts/client/ClientContext';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import { FormWrapper } from '@/packages/components/userForm';
import Loading from '@/packages/components/loading/Loading';
import { AlertWrapper } from '@/packages/components/alert';
import { LoginPayload } from '@/packages/types';
import { href } from '@/packages/utils/navigation';
import { useLang } from '@/packages/hooks';

export interface LoginData {
  title: string;
  cta: { title: string; label: string; url: string };
  forgotPassword: { title: string; label: string; url: string };
  image: { src: string; alt: string };
  backgroundImage: string;
  button: string;
}

const Login = () => {
  const { refreshUser } = useUser();
  const { client } = useClient();
  const { user } = useUser();
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
    <section className={styles.section}>
      <main className={styles.main}>
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
          <FormWrapper<LoginPayload>
            fields={['email', 'password']}
            onSubmit={handleLogin}
            button={formText.button.login}
            initialValues={{
              clientId: '',
              email: '',
              password: '',
            }}
          />
        </aside>
      </main>
      {loading && !redirecting && <Loading theme={user?.theme || 'light'} />}
      {alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}
    </section>
  );
};

export default Login;
