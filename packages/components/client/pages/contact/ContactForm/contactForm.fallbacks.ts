import {
  DEFAULT_CONTACT_SUBJECTS,
  type ContactFormResolvedTexts,
  type ContactFormTexts,
} from './contactForm.types';

type ContactLocale = 'de' | 'en' | 'es';

const CONTACT_FORM_FALLBACKS: Record<
  ContactLocale,
  Omit<ContactFormResolvedTexts, 'subjectOptions'>
> = {
  de: {
    labels: {
      name: 'Name',
      email: 'E-Mail',
      subject: 'Betreff',
      message: 'Nachricht',
    },
    placeholders: {
      name: 'Max Mustermann',
      email: 'max.mustermann@example.com',
      subject: 'Betreff auswaehlen',
      message: 'Ihre Frage oder Nachricht...',
    },
    submitLabel: 'Nachricht senden',
    successDescription:
      'Vielen Dank fuer Ihre Nachricht. Wir antworten Ihnen so schnell wie moeglich per E-Mail.',
  },
  en: {
    labels: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
    },
    placeholders: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'Select a subject',
      message: 'Your question or message...',
    },
    submitLabel: 'Send message',
    successDescription:
      'Thanks for reaching out. We will reply by email as soon as possible.',
  },
  es: {
    labels: {
      name: 'Nombre',
      email: 'Correo electronico',
      subject: 'Asunto',
      message: 'Mensaje',
    },
    placeholders: {
      name: 'Juan Perez',
      email: 'juan.perez@example.com',
      subject: 'Selecciona un asunto',
      message: 'Tu pregunta o mensaje...',
    },
    submitLabel: 'Enviar mensaje',
    successDescription:
      'Gracias por contactarnos. Te responderemos por correo electronico lo antes posible.',
  },
};

export function resolveContactFormTexts(
  texts: ContactFormTexts | undefined,
  locale: ContactLocale
): ContactFormResolvedTexts {
  const fallback = CONTACT_FORM_FALLBACKS[locale];

  return {
    labels: {
      name: texts?.labels?.name ?? fallback.labels.name,
      email: texts?.labels?.email ?? fallback.labels.email,
      subject: texts?.labels?.subject ?? fallback.labels.subject,
      message: texts?.labels?.message ?? fallback.labels.message,
    },
    placeholders: {
      name: texts?.placeholders?.name ?? fallback.placeholders.name,
      email: texts?.placeholders?.email ?? fallback.placeholders.email,
      subject: texts?.placeholders?.subject ?? fallback.placeholders.subject,
      message: texts?.placeholders?.message ?? fallback.placeholders.message,
    },
    subjectOptions: texts?.subjects?.contact ?? DEFAULT_CONTACT_SUBJECTS,
    submitLabel: texts?.button?.contact ?? fallback.submitLabel,
    successDescription: texts?.feedback?.successDescription ?? fallback.successDescription,
  };
}
