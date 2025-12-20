'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { ContactMessageCreatePayload, ContactMessageFormData } from '@/packages/types';
import { useClient } from '@/packages/contexts/client/ClientContext';
import {
  fallbackGlobalError,
  fallbackGlobalLoading,
  useAuth,
  useGlobalAlert,
  useI18n,
} from '@/packages/contexts';
import { getPopup } from '@/packages/utils/alertType';
import { ContactSection } from '@/packages/components/client';
import { sendContactMessage } from '@/packages/services/contact';

const SupportPage = () => {
  const { client } = useClient();
  const { auth } = useAuth();
  const { texts } = useI18n();
  const supportTexts = texts.components?.dashboard?.pages?.support;
  const formText = texts.components.form;
  const supportSubjects = texts.components.form.subjects?.support ?? [];
  const popups = texts.popups;
  const { showLoading, showError, showSuccess, closeAlert } = useGlobalAlert();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: ContactMessageFormData) => {
    setLoading(true);
    try {
      const loadingPopup = getPopup(
        popups,
        'GLOBAL_LOADING',
        'GLOBAL_LOADING',
        fallbackGlobalLoading
      );
      showLoading({
        response: {
          status: 102,
          title: loadingPopup.title,
          description: loadingPopup.description,
        },
      });

      if (!client?._id) {
        const popupData = getPopup(
          popups,
          'GLOBAL_INTERNAL_ERROR',
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );
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
        name: data.name || auth?.email || '',
        email: data.email || auth?.email || '',
        message: data.message || '',
        subject: data.subject || '',
        clientId: client._id,
      };

      const response = await sendContactMessage(payload);
      closeAlert();

      const popupData = (popups as any)?.[response.code] ||
        (popups as any)?.CONTACT_MESSAGE_CREATED || {
          title: response.success ? 'Ticket created' : 'We could not create the ticket',
          description:
            response.message ||
            (response.success
              ? 'Your ticket was created successfully.'
              : 'Please try again in a few minutes.'),
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
      closeAlert();
      const popupData = getPopup(
        popups,
        'GLOBAL_INTERNAL_ERROR',
        'GLOBAL_INTERNAL_ERROR',
        fallbackGlobalError
      );
      showError({
        response: {
          status: 500,
          title: popupData.title,
          description: popupData.description,
          cancelLabel: popupData.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p>{supportTexts?.heading ?? 'Support'}</p>
      </header>
      <ContactSection
        texts={{
          heading: supportTexts?.heading ?? 'Support',
          description: supportTexts?.description ?? '',
        }}
        handleSubmit={handleSubmit}
        button={formText.button.support ?? formText.button.contact}
        loading={loading}
        subjects={supportSubjects}
      />
    </main>
  );
};

export default SupportPage;
