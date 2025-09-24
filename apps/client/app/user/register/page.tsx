'use client';
import { useState, useEffect } from 'react';
import { registerUser } from '../../../../../packages/services/userService';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';
// import UserContactForm from '../../../../../packages/components/Form/UserContactForm';
import { useClient } from '../../../../../packages/contexts/client/ClientContext';
import { useI18n } from '../../../../../packages/contexts/i18n/I18nContext';
import AlertPopup from '../../../../../packages/components/alert/alertPopup/AlertPopup';

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
  theme: string;
  phone: string;
  clientId: string;
}

const Register = () => {
  const { client } = useClient();
  const router = useRouter();
  const { texts } = useI18n();
  const popups = texts.popups;
  const register: RegisterData = texts?.pages?.user.register;
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleRegister = async (formData: RegisterFormData) => {
    try {
      if (!client?._id) {
        const popupData = popups?.INTERNAL_ERROR || {};
        setAlert({
          type: 'error',
          title: popupData.title || 'Unerwarteter Fehler',
          description:
            popupData.description ||
            'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support.',
        });
        return;
      }
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.address ||
        !formData.phone ||
        !formData.profileImage ||
        !formData.language ||
        !formData.theme ||
        !formData.clientId
      ) {
        const popupData = popups?.INTERNAL_ERROR || {};
        setAlert({
          type: 'error',
          title: popupData.title || 'Unerwarteter Fehler',
          description:
            popupData.description ||
            'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal oder kontaktieren Sie den Support.',
        });
        return;
      }
      const response = await registerUser(formData);
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setAlert({
          type: 'success',
          title: popupData.title || 'Registrierung erfolgreich!',
          description:
            popupData.description ||
            'Bitte überprüfen Sie Ihre E-Mails, um Ihre Adresse zu bestätigen und Ihr Konto zu aktivieren.',
        });
      }
      setTimeout(() => {
        router.push('/user/verify-email');
      }, 3000);
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode || error.response.data.code;
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

  if (!register) {
    return (
      <section className={styles.section}>
        <div
          className={styles.skeleton}
          style={{ width: '100%', height: 504, background: '#eee' }}
        />
      </section>
    );
  }

  return (
    <section className={styles.section}>
      {/* <main className={styles.main}>
        <header className={`${styles.header} card`}>
          <article className={styles.article}>
            <h1 className={styles.h1}>{register?.tilte}</h1>
            <p className={styles.header_p}>{register?.description}</p>
          </article>
          <aside className={styles.aside}>
            <p className={styles.header_p}>{register?.cta.title}</p>
            <Link className={styles.link} href={register?.cta.url}>
              {register?.cta.label}
            </Link>
          </aside>
        </header>
        <aside className={styles.aside_form}>
          <UserContactForm
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
            mode="register"
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

export default Register;
