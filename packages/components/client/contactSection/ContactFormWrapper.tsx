'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '../../../contexts/i18n';
import { useProfile } from '../../../contexts/profile';
import { useAuth } from '../../../contexts/auth';
import { useClient } from '../../../contexts/client/ClientContext';
import { ButtonProps } from '../button/Button';
import { ContactMessageFormData } from '../../../types';
import { validateEmail, validateMessage, validateName } from '../../../utils/validators';
import ContactForm from './ContactForm';

type ContactField = 'name' | 'email' | 'subject' | 'message';

interface ContactFormWrapperProps {
  onSubmit: (data: ContactMessageFormData) => void | Promise<void>;
  button: ButtonProps;
  loading: boolean;
  subjects: string[];
}

const initialValues: ContactMessageFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  clientId: '',
  userId: '',
  profileImage: '',
  language: 'de',
};

export default function ContactFormWrapper({
  onSubmit,
  button,
  loading,
  subjects,
}: ContactFormWrapperProps) {
  const { texts } = useI18n();
  const { profile } = useProfile();
  const { auth } = useAuth();
  const { client } = useClient();

  const [formData, setFormData] = useState<ContactMessageFormData>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: profile?.name ?? prev.name ?? '',
      email: auth?.email ?? prev.email ?? '',
      clientId: client?._id ?? prev.clientId ?? '',
      userId: auth?.userId ?? prev.userId ?? '',
      profileImage: profile?.profileImage ?? prev.profileImage ?? '',
      language: profile?.language ?? prev.language ?? 'de',
    }));
  }, [
    auth?.email,
    auth?.userId,
    client?._id,
    profile?.language,
    profile?.name,
    profile?.profileImage,
  ]);

  useEffect(() => {
    if (!subjects.length) return;
    if (formData.subject && subjects.includes(formData.subject)) return;
    setFormData((prev) => ({ ...prev, subject: '' }));
  }, [subjects, formData.subject]);

  const formError = texts.components.form.error as Partial<
    Record<ContactField, Record<string, string>>
  >;

  const validators: Record<ContactField, (value: string) => string[]> = {
    name: validateName,
    email: validateEmail,
    subject: (value: string) => (value ? [] : ['required']),
    message: validateMessage,
  };

  const getValidationError = (name: ContactField, value: string) => {
    const errs = validators[name](value);
    if (errs.length > 0) {
      return formError?.[name]?.[errs[0]] || 'Invalid data';
    }
    return '';
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as ContactField;

    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    setErrors((prev) => ({ ...prev, [fieldName]: getValidationError(fieldName, value) }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as ContactField;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nextErrors: Partial<Record<ContactField, string>> = {};

    (['name', 'email', 'subject', 'message'] as ContactField[]).forEach((field) => {
      const err = getValidationError(field, formData[field] || '');
      if (err) nextErrors[field] = err;
    });

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    await onSubmit(formData);

    setFormData((prev) => ({
      ...initialValues,
      name: profile?.name ?? '',
      email: auth?.email ?? '',
      clientId: client?._id ?? '',
      userId: auth?.userId ?? '',
      profileImage: profile?.profileImage ?? '',
      language: profile?.language ?? 'de',
      message: '',
    }));
    setErrors({});
    setTouched({});
  };

  return (
    <ContactForm
      formData={formData}
      errors={errors}
      touched={touched}
      onChange={handleChange}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
      button={button}
      loading={loading}
      texts={{
        labels: {
          name: texts.components.form.labels.name,
          email: texts.components.form.labels.email,
          subject: texts.components.form.labels.subject,
          message: texts.components.form.labels.message,
        },
        placeholders: {
          name: texts.components.form.placeholders.name,
          email: texts.components.form.placeholders.email,
          subject: texts.components.form.placeholders.subject,
          message: texts.components.form.placeholders.message,
        },
      }}
      subjects={subjects}
    />
  );
}
