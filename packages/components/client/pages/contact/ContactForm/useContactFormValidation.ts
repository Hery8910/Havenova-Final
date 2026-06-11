'use client';

import { useMemo } from 'react';
import type { ContactFormErrors, ContactFormState, ContactFormTexts } from './contactForm.types';

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim().toLowerCase());

export function useContactFormValidation(
  values: ContactFormState,
  errorTexts: ContactFormTexts['error']
) {
  const errors = useMemo<ContactFormErrors>(() => {
    const next: ContactFormErrors = {};
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

  return {
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
}
