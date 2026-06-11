'use client';

import { useEffect, useState } from 'react';
import { useAuth, useGlobalAlert, useI18n, useProfile } from '../../../../../contexts';
import { getI18nFallbacks } from '../../../../../contexts/i18n';
import { useContactFormSubmission } from './useContactFormSubmission';
import {
  type ContactFormField,
  type ContactFormState,
  type ContactFormTexts,
} from './contactForm.types';
import { useContactFormValidation } from './useContactFormValidation';
import { resolveContactFormTexts } from './contactForm.fallbacks';
import { ContactFormView } from './ContactForm.view';
import { resolvePreferredContactEmail } from '../../../../../utils';

export function ContactFormSection() {
  const { texts, language } = useI18n();
  const { fallbackButtons, fallbackGlobalError, fallbackPopups } = getI18nFallbacks(language);
  const { auth } = useAuth();
  const { profile } = useProfile();
  const { showError, closeAlert } = useGlobalAlert();
  const { submit } = useContactFormSubmission();

  const formTexts = texts?.components?.client?.form as ContactFormTexts | undefined;
  const resolvedTexts = resolveContactFormTexts(formTexts, language);
  const errorTexts = formTexts?.error;
  const submitLabel = resolvedTexts.submitLabel;
  const successDescription = resolvedTexts.successDescription;
  const sendingLabel = `${submitLabel}...`;
  const profileEmail = profile?.contactEmail;
  const sessionEmail = auth?.email;

  const [values, setValues] = useState<ContactFormState>({
    name: profile?.name ?? '',
    email: resolvePreferredContactEmail(profileEmail, sessionEmail),
    subject: '',
    message: '',
  });
  const [touched, setTouched] = useState<Record<ContactFormField, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      name: prev.name || profile?.name || '',
      email: prev.email || resolvePreferredContactEmail(profileEmail, sessionEmail),
    }));
  }, [profile?.name, profileEmail, sessionEmail]);

  const { errors, hasErrors } = useContactFormValidation(values, errorTexts);

  const handleChange = (field: ContactFormField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: ContactFormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (hasErrors) {
      const validationPopup =
        (texts.popups as any)?.VALIDATION_ERROR ??
        (fallbackPopups as any).VALIDATION_ERROR ??
        fallbackGlobalError;

      showError({
        response: {
          status: 400,
          title: validationPopup.title,
          description: validationPopup.description,
          cancelLabel: validationPopup.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });
      return;
    }

    try {
      setSubmitting(true);
      const wasSubmitted = await submit(
        {
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
          profileImage: profile?.profileImage,
        },
        {
          successTitle: submitLabel,
          successDescription,
        }
      );
      if (!wasSubmitted) return;

      setValues((prev) => ({
        ...prev,
        subject: '',
        message: '',
      }));
      setTouched({
        name: false,
        email: false,
        subject: false,
        message: false,
      });
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  const showFieldError = (field: ContactFormField) =>
    (touched[field] || submitted) && errors[field];

  return (
    <ContactFormView
      values={values}
      submitting={submitting}
      submitLabel={submitLabel}
      sendingLabel={sendingLabel}
      subjectOptions={resolvedTexts.subjectOptions}
      labels={resolvedTexts.labels}
      placeholders={resolvedTexts.placeholders}
      onChange={handleChange}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
      showFieldError={showFieldError}
    />
  );
}
