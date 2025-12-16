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
import { useEffect, useState } from 'react';
import { useClient } from '@/packages/contexts/client/ClientContext';
import { useLang } from '@/packages/hooks';
import { href } from '@/packages/utils/navigation';
import { Map } from '@/packages/components/map/Map';
import {
  useAuth,
  useGlobalAlert,
  fallbackGlobalError,
  fallbackGlobalLoading,
} from '../../../../../packages/contexts';
import { sendContactMessage } from '@/packages/services/contact';
import { ContactMessageCreatePayload, ContactMessageFormData } from '@/packages/types';
import { getPopup } from '@/packages/utils/alertType';

export default function Contact() {
  const { texts } = useI18n();
  const { profile } = useProfile();
  const { auth } = useAuth();
  const { client } = useClient();
  const router = useRouter();
  const lang = useLang();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const { showSuccess, showError, showLoading, closeAlert } = useGlobalAlert();

  const popups = texts.popups;
  const contactHeroTexts = texts.pages.contact.hero;
  const contactTexts = texts.pages.contact.contactSection;
  const contactInfo = texts.contactInfo;
  const formText = texts.components.form;
  const faqPreviewTexts = texts.components.common.faq;
  const finalCtaTexts = texts.components.common.finalCta;

  if (!profile) return null;

  useEffect(() => {
    const status = searchParams.get('status');
    const code = searchParams.get('code');
    const http = Number(searchParams.get('http'));

    if (status && code) {
      const popupData = texts.popups?.[code] || {};
      const isSuccess = status === 'success';

      const response = {
        status: http || (isSuccess ? 200 : 400),
        title: popupData.title || (isSuccess ? 'Success' : 'Error'),
        description: popupData.description || '',
        cancelLabel: popupData.close || popups.button?.close || 'Close',
      };

      const alertMethod = isSuccess ? showSuccess : showError;
      alertMethod({ response, onCancel: closeAlert });

      // limpiar la URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [closeAlert, popups.button?.close, searchParams, showError, showSuccess, texts.popups]);

  const handleSubmit = async (data: ContactMessageFormData) => {
    setLoading(true);
    try {
      const loadingPopup = getPopup(popups, 'GLOBAL_LOADING', 'GLOBAL_LOADING', fallbackGlobalLoading);
      showLoading({
        response: {
          status: 102,
          title: loadingPopup.title,
          description: loadingPopup.description,
        },
      });

      if (!client?._id) {
        const popupData = getPopup(popups, 'GLOBAL_INTERNAL_ERROR', 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
        showError({
          response: {
            status: 500,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close,
          },
          onCancel: closeAlert,
        });
        return;
      }

      const payload: ContactMessageCreatePayload = {
        userId: auth?.userId || '',
        name: data.name || profile?.name || '',
        email: data.email || auth?.email || '',
        message: data.message || '',
        clientId: client._id,
      };

      const response = await sendContactMessage(payload);

      closeAlert(); // cierra el loading

      const popupData =
        (popups as any)?.[response.code] ||
        (popups as any)?.CONTACT_MESSAGE_CREATED || {
          title: response.success ? 'Mensaje enviado' : 'No pudimos enviar tu mensaje',
          description:
            response.message ||
            (response.success
              ? 'Gracias por contactarnos. Te responderemos pronto.'
              : 'Inténtalo nuevamente en unos minutos.'),
          close: popups.button?.close || 'Close',
        };

      const alertResponse = {
        status: response.success ? 200 : 500,
        title: popupData.title,
        description: popupData.description,
        cancelLabel: popupData.close,
      };

      if (response.success) {
        showSuccess({ response: alertResponse, onCancel: closeAlert });
      } else {
        showError({ response: alertResponse, onCancel: closeAlert });
      }
    } catch (error: any) {
      closeAlert(); // cierra el loading antes de mostrar error
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode;
        const popupData = getPopup(popups, errorKey, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
        showError({
          response: {
            status: error.response.status,
            title: popupData.title,
            description: popupData.description || error.response.data.message,
            cancelLabel: popupData.close,
          },
          onCancel: closeAlert,
        });
      } else {
        const popupData = getPopup(popups, 'GLOBAL_INTERNAL_ERROR', 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
        showError({
          response: {
            status: 500,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close,
          },
          onCancel: closeAlert,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {contactHeroTexts ? <ContactHero {...contactHeroTexts} /> : <ContactHeroSkeleton />}

      <ContactSection
        texts={contactTexts}
        handleSubmit={handleSubmit}
        button={formText.button.contact}
        loading={loading}
      />

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
