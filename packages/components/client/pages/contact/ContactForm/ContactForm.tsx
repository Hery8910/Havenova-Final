'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './ContactForm.module.css';
import { createContactMessage } from '../../../../../services/contact';
import { useAuth, useGlobalAlert, useI18n, useProfile } from '../../../../../contexts';
import {
  fallbackButtons,
  fallbackGlobalError,
  fallbackGlobalLoading,
  fallbackPopups,
} from '../../../../../contexts/i18n';
import { getPopup } from '../../../../../utils/alertType';

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const DEFAULT_SUBJECTS = [
  'Pricing question',
  'Service request',
  'Availability and schedules',
  'Changes or cancellations',
  'Other',
];

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim().toLowerCase());

export function ContactFormSection() {
  const { texts } = useI18n();
  const { auth } = useAuth();
  const { profile } = useProfile();
  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();

  const formTexts = texts?.components?.client?.form;
  const labels = formTexts?.labels;
  const placeholders = formTexts?.placeholders;
  const errorTexts = formTexts?.error;
  const subjectOptions = formTexts?.subjects?.contact ?? DEFAULT_SUBJECTS;
  const submitLabel = formTexts?.button?.contact || 'Send message';
  const sendingLabel = `${submitLabel}...`;

  const [values, setValues] = useState<ContactFormState>({
    name: profile?.name ?? '',
    email: auth?.email ?? '',
    subject: '',
    message: '',
  });
  const [touched, setTouched] = useState<Record<keyof ContactFormState, boolean>>({
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
      email: prev.email || auth?.email || '',
    }));
  }, [profile?.name, auth?.email]);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof ContactFormState, string>> = {};
    const nameValue = values.name.trim();
    const emailValue = values.email.trim();
    const subjectValue = values.subject.trim();
    const messageValue = values.message.trim();

    if (!nameValue) next.name = errorTexts?.name?.required ?? 'Name is required.';
    if (!emailValue) next.email = errorTexts?.email?.required ?? 'Email is required.';
    if (emailValue && !isValidEmail(emailValue))
      next.email = errorTexts?.email?.invalid ?? 'Invalid email format.';
    if (!subjectValue) next.subject = errorTexts?.subject?.required ?? 'Subject is required.';
    if (!messageValue) next.message = errorTexts?.message?.required ?? 'Message is required.';
    if (messageValue && messageValue.length < 10)
      next.message = errorTexts?.message?.tooShort ?? 'Message must be at least 10 characters';
    if (messageValue && messageValue.length > 1000)
      next.message = errorTexts?.message?.tooLong ?? 'Message must not exceed 1000 characters';

    return next;
  }, [values, errorTexts]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleChange = (field: keyof ContactFormState, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof ContactFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (hasErrors || !auth?.clientId) {
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

    setSubmitting(true);
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
      await createContactMessage({
        clientId: auth.clientId,
        userId: auth.userId || undefined,
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        profileImage: profile?.profileImage,
      });

      closeAlert();
      showSuccess({
        response: {
          status: 200,
          title: submitLabel,
          description:
            texts?.pages?.client?.contact?.hero?.subtitle ||
            'Thanks for reaching out. We will reply by email as soon as possible.',
          cancelLabel: texts.popups?.button?.close ?? fallbackButtons.close,
        },
        onCancel: closeAlert,
      });

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
    } finally {
      setSubmitting(false);
    }
  };

  const showFieldError = (field: keyof ContactFormState) =>
    (touched[field] || submitted) && errors[field];

  return (
    <section className={styles.section} aria-labelledby="contact-form-title">
      <article className={`${styles.card} card--glass`}>
        <header className={styles.header}>
          <p className={styles.kicker} id="contact-form-title">
            {submitLabel}
          </p>
          <p className={styles.subtitle}>
            {texts?.pages?.client?.contact?.hero?.subtitle ||
              'Tell us what you need and we will respond by email.'}
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <label className={styles.field} htmlFor="contact-name">
              <span className={styles.label}>{labels?.name ?? 'Name'}</span>
              <input
                id="contact-name"
                className={styles.input}
                type="text"
                name="name"
                autoComplete="name"
                placeholder={placeholders?.name ?? 'John Doe'}
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                aria-invalid={!!showFieldError('name')}
                aria-describedby="contact-name-error"
                required
              />
              <span
                id="contact-name-error"
                className={styles.error}
                aria-live="polite"
              >
                {showFieldError('name') ?? ''}
              </span>
            </label>

            <label className={styles.field} htmlFor="contact-email">
              <span className={styles.label}>{labels?.email ?? 'Email'}</span>
              <input
                id="contact-email"
                className={styles.input}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder={placeholders?.email ?? 'john.doe@example.com'}
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                aria-invalid={!!showFieldError('email')}
                aria-describedby="contact-email-error"
                required
              />
              <span
                id="contact-email-error"
                className={styles.error}
                aria-live="polite"
              >
                {showFieldError('email') ?? ''}
              </span>
            </label>
          </div>

          <label className={styles.field} htmlFor="contact-subject">
            <span className={styles.label}>{labels?.subject ?? 'Subject'}</span>
            <select
              id="contact-subject"
              className={styles.input}
              name="subject"
              value={values.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              onBlur={() => handleBlur('subject')}
              aria-invalid={!!showFieldError('subject')}
              aria-describedby="contact-subject-error"
              required
            >
              <option value="" disabled>
                {placeholders?.subject ?? 'Select a subject'}
              </option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <span
              id="contact-subject-error"
              className={styles.error}
              aria-live="polite"
            >
              {showFieldError('subject') ?? ''}
            </span>
          </label>

          <label className={styles.field} htmlFor="contact-message">
            <span className={styles.label}>{labels?.message ?? 'Message'}</span>
            <textarea
              id="contact-message"
              className={styles.textarea}
              name="message"
              rows={6}
              placeholder={placeholders?.message ?? 'Your question or message...'}
              value={values.message}
              onChange={(e) => handleChange('message', e.target.value)}
              onBlur={() => handleBlur('message')}
              aria-invalid={!!showFieldError('message')}
              aria-describedby="contact-message-error"
              required
            />
            <span
              id="contact-message-error"
              className={styles.error}
              aria-live="polite"
            >
              {showFieldError('message') ?? ''}
            </span>
          </label>

          <div className={styles.actions}>
            <button className={`button ${styles.submit}`} type="submit" disabled={submitting}>
              {submitting ? sendingLabel : submitLabel}
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}
