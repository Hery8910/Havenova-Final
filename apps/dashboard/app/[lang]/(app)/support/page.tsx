'use client';

import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import styles from './page.module.css';
import { ContactMessageCreatePayload, ContactMessageLanguage } from '../../../../../../packages/types';
import {
  fallbackGlobalError,
  fallbackGlobalLoading,
  useAuth,
  useClient,
  useGlobalAlert,
  useI18n,
  useRequireRole,
} from '../../../../../../packages/contexts';
import { getPopup } from '../../../../../../packages/utils/alertType';
import { createContactMessage } from '../../../../../../packages/services/contact';

type SupportContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  clientId: string;
  language?: ContactMessageLanguage;
};

const SupportPage = () => {
  const isAllowed = useRequireRole('admin');
  const { client } = useClient();
  const { auth } = useAuth();
  const { texts, language } = useI18n();
  const supportTexts = texts.components?.dashboard?.pages?.support;
  const formText = texts.components?.client?.form;
  const supportSubjects = texts.components?.client?.form?.subjects?.support ?? [];
  const popups = texts.popups;
  const { showLoading, showError, showSuccess, closeAlert } = useGlobalAlert();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SupportContactFormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
    clientId: '',
    language,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      clientId: client?._id || prev.clientId,
      name: prev.name || auth?.email || '',
      email: prev.email || auth?.email || '',
      language: prev.language || language,
    }));
  }, [auth?.email, client?._id, language]);

  if (!isAllowed) return null;

  const handleSubmit = async (data: SupportContactFormState) => {
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
        name: data.name || auth?.email || '',
        email: data.email || auth?.email || '',
        message: data.message || '',
        subject: data.subject || '',
        clientId: client._id,
        language: data.language || language,
      };

      const response = await createContactMessage(payload);
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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p>{supportTexts?.heading ?? 'Support'}</p>
      </header>
      <form className={`${styles.section} card`} onSubmit={handleFormSubmit}>
        <p>{supportTexts?.description ?? ''}</p>
        <label>
          {formText.labels.name}
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={formText.placeholders.name}
          />
        </label>
        <label>
          {formText.labels.email}
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={formText.placeholders.email}
          />
        </label>
        <label>
          {formText.labels.subject}
          <select name="subject" value={formData.subject} onChange={handleInputChange}>
            <option value="">{formText.placeholders.subject}</option>
            {supportSubjects.map((subject: string) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>
        <label>
          {formText.labels.message}
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder={formText.placeholders.message}
            rows={5}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading
            ? fallbackGlobalLoading.title
            : formText.button.support ?? formText.button.contact}
        </button>
      </form>
    </main>
  );
};

export default SupportPage;
