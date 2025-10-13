'use client';
import { FAQHero, FAQHeroSkeleton } from '@/packages/components/pages/faqHero';
import { ContactSection, FAQList, FAQListSkeleton } from '@/packages/components/common';
import { useI18n } from '@/packages/contexts/i18n/I18nContext';
import styles from './page.module.css';
import { useClient } from '@/packages/contexts/client/ClientContext';
import { useUser } from '@/packages/contexts/user/UserContext';
import { useEffect, useState } from 'react';
import { FaqMessageData } from '@/packages/types';
import { sendContactMessage } from '@/packages/services/userService';
import { AlertWrapper } from '@/packages/components/alert';
import Loading from '@/packages/components/loading/Loading';
import { useSearchParams } from 'next/navigation';

const QuestionsAnswers = () => {
  const { texts } = useI18n();
  const { client } = useClient();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

  const popups = texts.popups;
  const faqHeroTexts = texts.pages.faq.faqHero;
  const faqListTexts = texts.pages.faq.questions;
  const formText = texts.components.form;
  const contactTexts = texts.pages.faq.contactSection;

  if (!user) return null;

  useEffect(() => {
    const status = searchParams.get('status');
    const code = searchParams.get('code');
    const http = Number(searchParams.get('http'));

    if (status && code) {
      const popupData = texts.popups?.[code] || {};
      setAlert({
        status: http || (status === 'success' ? 200 : 400),
        title: popupData.title || (status === 'success' ? 'Success' : 'Error'),
        description: popupData.description || '',
      });
      setTimeout(() => {
        setAlert(null);
      }, 3000);
      // limpiar la URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [searchParams]);

  const handleSubmit = async (data: Partial<FaqMessageData>) => {
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

      const originPath = typeof window !== 'undefined' ? window.location.pathname : '';

      const payload: FaqMessageData = {
        name: data.name || user?.name || '',
        email: data.email || user?.email || '',
        message: data.message || '',
        language: user.language || 'de',
        clientId: client._id,
        originPath,
      };

      const response = await sendContactMessage(payload);

      if (response.success) {
        const popupData = popups?.[response.code] || {};
        console.log(originPath);

        setAlert({
          status: 200,
          title: popupData.title || popups.FAQ_MESSAGE_SUCCESS.title,
          description: popupData.description || response.message,
        });
      }
      setTimeout(() => {
        setAlert(null);
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
      {faqHeroTexts ? <FAQHero {...faqHeroTexts} /> : <FAQHeroSkeleton />}

      {faqListTexts ? <FAQList categories={faqListTexts} /> : <FAQListSkeleton />}

      <ContactSection
        texts={contactTexts}
        handleSubmit={handleSubmit}
        button={formText.button.contact}
      />
      {loading && <Loading theme={user?.theme || 'light'} />}
      {!loading && alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}
    </main>
  );
};

export default QuestionsAnswers;
