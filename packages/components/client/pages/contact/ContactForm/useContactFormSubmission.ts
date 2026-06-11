'use client';

import { useClient, useGlobalAlert, useI18n } from '../../../../../contexts';
import { getI18nFallbacks } from '../../../../../contexts/i18n';
import { createContactMessage } from '../../../../../services/contact';
import type { ContactMessageCreatePayload } from '../../../../../types/contact';
import { getPopup } from '../../../../../utils/alertType';

export interface ContactFormSubmissionValues {
  name: string;
  email: string;
  subject: string;
  message: string;
  profileImage?: string;
}

export function useContactFormSubmission() {
  const { client } = useClient();
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackGlobalError, fallbackGlobalLoading } =
    getI18nFallbacks(language);
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();

  const buildPayload = (
    values: ContactFormSubmissionValues
  ): ContactMessageCreatePayload | null => {
    if (!client?._id) return null;

    return {
      clientId: client._id,
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
      profileImage: values.profileImage,
      language,
    };
  };

  const submit = async (
    values: ContactFormSubmissionValues,
    feedback: { successTitle: string; successDescription: string }
  ) => {
    const payload = buildPayload(values);

    if (!payload) {
      const popupData = getPopup(
        texts.popups,
        'GLOBAL_INTERNAL_ERROR',
        'GLOBAL_INTERNAL_ERROR',
        fallbackGlobalError
      );

      showError({
        response: {
          status: 500,
          title: popupData.title,
          description: popupData.description,
          cancelLabel: popupData.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
      return false;
    }

    const loadingPopup = getPopup(
      texts.popups,
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

    try {
      await createContactMessage(payload);

      closeAlert();
      showSuccess({
        response: {
          status: 200,
          title: feedback.successTitle,
          description: feedback.successDescription,
          cancelLabel: texts.popups?.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });

      return true;
    } catch (error: any) {
      closeAlert();
      const errorKey = error?.response?.data?.errorCode;
      const popupData = getPopup(
        texts.popups,
        errorKey,
        'GLOBAL_INTERNAL_ERROR',
        fallbackGlobalError
      );

      showError({
        response: {
          status: error?.response?.status || 500,
          title: popupData.title,
          description: popupData.description || error?.response?.data?.message,
          cancelLabel: popupData.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
      return false;
    }
  };

  return { submit };
}
