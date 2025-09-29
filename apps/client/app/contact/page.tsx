'use client';
import { useI18n } from '../../../../packages/contexts/i18n';
import { useUser } from '../../../../packages/contexts/user/UserContext';
import { ContactHero, ContactHeroSkeleton } from '@/packages/components/pages/contactHero';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import {
  ContactInfo,
  ContactSection,
  FAQSection,
  FAQSectionSkeleton,
  FinalCTA,
  FinalCTASkeleton,
} from '../../../../packages/components/common';
import { AlertWrapper } from '../../../../packages/components/alert';
import { useEffect, useState } from 'react';
import { FaqMessageData } from '../../../../packages/types';
import { useClient } from '../../../../packages/contexts/client/ClientContext';
import { sendContactMessage } from '../../../../packages/services/userService';
import Loading from '../../../../packages/components/loading/Loading';

export default function Contact() {
  const { texts } = useI18n();
  const { user } = useUser();
  const { client } = useClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const theme = user?.theme || 'light';
  const [isMobile, setIsMobile] = useState(false);

  const popups = texts.popups;
  const contactHeroTexts = texts.pages.contact.hero;
  const contactTexts = texts.pages.contact.contactSection;
  const contactInfo = texts.contactInfo;
  const formText = texts.components.form;
  const faqPreviewTexts = texts.components.common.faq;
  const finalCtaTexts = texts.components.common.finalCta;

  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

      const payload: FaqMessageData = {
        name: data.name || user?.name || '',
        email: data.email || user?.email || '',
        message: data.message || '',
        language: user.language || 'de',
        clientId: client._id,
      };

      const response = await sendContactMessage(payload);

      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setAlert({
          status: 200,
          title: popupData.title || popups.FAQ_MESSAGE_SUCCESS.title,
          description: popupData.description || response.message,
        });
      }
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
    <main>
      {contactHeroTexts ? <ContactHero {...contactHeroTexts} /> : <ContactHeroSkeleton />}

      {loading && <Loading theme={user.theme || 'light'} />}
      {!loading && alert && <AlertWrapper response={alert} onClose={() => setAlert(null)} />}

      <ContactSection
        texts={contactTexts}
        handleSubmit={handleSubmit}
        button={formText.button.contact}
      />

      <ContactInfo {...contactInfo} theme={theme} isMobile={isMobile} />

      {faqPreviewTexts ? (
        <FAQSection {...faqPreviewTexts} onClick={() => router.push('/faq')} />
      ) : (
        <FAQSectionSkeleton />
      )}

      {finalCtaTexts ? (
        <FinalCTA {...finalCtaTexts} onClick={() => router.push('/services')} />
      ) : (
        <FinalCTASkeleton />
      )}
    </main>
  );
}
