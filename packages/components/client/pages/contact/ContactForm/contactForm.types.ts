export type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactFormField = keyof ContactFormState;

export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

export interface ContactFormTexts {
  labels?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  placeholders?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  error?: {
    name?: { required?: string };
    email?: { required?: string; invalid?: string };
    subject?: { required?: string };
    message?: { required?: string; tooShort?: string; tooLong?: string };
  };
  subjects?: {
    contact?: string[];
  };
  button?: {
    contact?: string;
  };
  feedback?: {
    successDescription?: string;
  };
}

export interface ContactFormResolvedTexts {
  labels: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  placeholders: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  subjectOptions: string[];
  submitLabel: string;
  successDescription: string;
}

export const DEFAULT_CONTACT_SUBJECTS = [
  'Pricing question',
  'Service request',
  'Availability and schedules',
  'Changes or cancellations',
  'Other',
];
