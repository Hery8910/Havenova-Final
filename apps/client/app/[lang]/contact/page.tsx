'use client';
import { useI18n } from '@/packages/contexts/i18n';
import { useProfile } from '@/packages/contexts/profile/ProfileContext';
import { ContactHero, ContactHeroSkeleton } from '@/packages/components/pages/contactHero';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ContactInfo,
  ContactSection,
  FAQSection,
  FAQSectionSkeleton,
  FinalCTA,
  FinalCTASkeleton,
} from '@/packages/components/common';
import { AlertWrapper } from '@/packages/components/alert';
import { useEffect, useState } from 'react';
import { useClient } from '@/packages/contexts/client/ClientContext';
import { sendContactMessage } from '@/packages/services/profile/profileService';
import Loading from '@/packages/components/loading/Loading';
import { useLang } from '@/packages/hooks';
import { href } from '@/packages/utils/navigation';
import { Map } from '@/packages/components/map/Map';
import { useAuth } from '../../../../../packages/contexts';

export default function Contact() {
  const { texts } = useI18n();
  const { profile } = useProfile();
  const { auth } = useAuth();
  const { client } = useClient();
  const router = useRouter();
  const lang = useLang();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();

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

  if (!profile) return null;

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // const handleSubmit = async (data: Partial<FaqMessageData>) => {
  //   setLoading(true);
  //   try {
  //     if (!client?._id) {
  //       const popupData = popups?.INTERNAL_ERROR || {};
  //       setAlert({
  //         status: 500,
  //         title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
  //         description: popupData.description || popups.GLOBAL_INTERNAL_ERROR.description,
  //       });
  //       return;
  //     }

  //     const originPath = typeof window !== 'undefined' ? window.location.pathname : '';

  //     const payload = {
  //       name: data.name || profile?.name || '',
  //       email: data.email || auth?.email || '',
  //       message: data.message || '',
  //       language: profile.language || 'de',
  //       clientId: client._id,
  //       originPath,
  //     };

  //     const response = await sendContactMessage(payload);

  //     if (response.success) {
  //       const popupData = popups?.[response.code] || {};
  //       setAlert({
  //         status: 200,
  //         title: popupData.title || popups.FAQ_MESSAGE_SUCCESS.title,
  //         description: popupData.description || response.message,
  //       });
  //     }
  //     setTimeout(() => {
  //       setAlert(null);
  //     }, 3000);
  //   } catch (error: any) {
  //     if (error.response && error.response.data) {
  //       const errorKey = error.response.data.errorCode;
  //       const popupData = popups?.[errorKey] || {};
  //       setAlert({
  //         status: error.response.status,
  //         title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
  //         description:
  //           popupData.description ||
  //           error.response.data.message ||
  //           popups.GLOBAL_INTERNAL_ERROR.description,
  //       });
  //     } else {
  //       setAlert({
  //         status: 500,
  //         title: popups.GLOBAL_INTERNAL_ERROR.title,
  //         description: popups.GLOBAL_INTERNAL_ERROR.description,
  //       });
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <main>
      {contactHeroTexts ? <ContactHero {...contactHeroTexts} /> : <ContactHeroSkeleton />}
      {/* 
      <ContactSection
        texts={contactTexts}
        handleSubmit={handleSubmit}
        button={formText.button.contact}
      /> */}

      <ContactInfo {...contactInfo} />

      <Map {...contactInfo.mapSection} />

      {faqPreviewTexts ? (
        <FAQSection {...faqPreviewTexts} onClick={() => router.push(href(lang, '/faq'))} />
      ) : (
        <FAQSectionSkeleton />
      )}

      {finalCtaTexts ? (
        <FinalCTA {...finalCtaTexts} onClick={() => router.push(href(lang, '/services'))} />
      ) : (
        <FinalCTASkeleton />
      )}
    </main>
  );
}
