'use client';

import React, { useState } from 'react';
import { Form } from '../form';
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateAddress,
  validateMessage,
  validateTosAccepted,
} from '../../../../utils/validators/userFormValidator';
import { useI18n } from '../../../../contexts/i18n';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../../hooks/useLang';
import { href } from '../../../../utils/navigation';
import { useProfile, useWorker } from '../../../../contexts';
import { useClient } from '../../../../contexts/client/ClientContext';
import { useEffect } from 'react';
import { useAuth } from '../../../../contexts/auth/authContext';

interface WrapperProps<T extends Record<string, any>> {
  fields: (FormField & keyof T)[];
  onSubmit: (data: T) => void | boolean | Promise<void | boolean>;
  button: string;
  showForgotPassword?: boolean;
  showHintPassword?: boolean;
  initialValues: T;
  loading: boolean;
}
type ValidateField =
  | 'name'
  | 'email'
  | 'phone'
  | 'password'
  | 'address'
  | 'serviceAddress'
  | 'message'
  | 'tosAccepted';

export type FormField =
  | 'name'
  | 'email'
  | 'phone'
  | 'password'
  | 'address'
  | 'serviceAddress'
  | 'message'
  | 'language'
  | 'clientId'
  | 'tosAccepted';

export interface PlaceholdersTextProps {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  message: string;
}

export interface LabelsTextProps {
  name: string;
  email: string;
  password: string;
  forgotPassword: string;
  passwordHint: string;
  tosPrefix: string;
  tosTerms: string;
  tosConnector: string;
  tosPrivacy: string;
  tosSuffix: string;
  address: string;
  phone: string;
  message: string;
}

export default function FormWrapper<T extends Record<string, any>>({
  fields,
  onSubmit,
  button,
  showForgotPassword,
  showHintPassword,
  initialValues,
  loading,
}: WrapperProps<T>) {
  const { texts } = useI18n();
  let profileContext: ReturnType<typeof useProfile> | null = null;
  let workerContext: ReturnType<typeof useWorker> | null = null;

  try {
    profileContext = useProfile();
  } catch {
    // ProfileContext not available, fall back to worker.
  }

  if (!profileContext) {
    try {
      workerContext = useWorker();
    } catch {
      // WorkerContext not available.
    }
  }

  const profile = profileContext?.profile ?? workerContext?.worker;
  const { auth } = useAuth();
  const { client } = useClient();
  const router = useRouter();
  const lang = useLang();

  const formError = texts.components.client.form.error as Partial<
    Record<FormField, Record<string, string>>
  >;

  const placeholderText = texts.components.client.form.placeholders;
  const labelText = texts.components.client.form.labels;

  const [formData, setFormData] = useState<T>(initialValues);

  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...initialValues,
      clientId: client?._id || initialValues.clientId || '',
      language: profile?.language || initialValues.language || 'de',
      name: profile?.name ?? initialValues.name ?? prev.name,
      email: auth?.email || initialValues.email || prev.email,
      phone: profile?.phone ?? initialValues.phone ?? prev.phone,
      address: profile?.address ?? initialValues.address ?? prev.address,
    }));
    // Sync whenever profile/auth/initialValues change to keep form updated
  }, [
    auth?.email,
    client?._id,
    initialValues.address,
    initialValues.clientId,
    initialValues.email,
    initialValues.language,
    initialValues.name,
    initialValues.phone,
    profile?.address,
    profile?.language,
    profile?.name,
    profile?.phone,
  ]);

  const passwordValidator = (value: string): string[] => {
    if (showHintPassword) {
      return validatePassword(value);
    }
    return value?.trim() ? [] : ['required'];
  };

  const validators: Record<ValidateField, (value: any) => string[]> = {
    name: validateName,
    email: validateEmail,
    phone: validatePhone,
    password: passwordValidator,
    address: validateAddress,
    serviceAddress: validateAddress, // o tu validador
    message: validateMessage,
    tosAccepted: validateTosAccepted,
  };

  const getValidationError = (name: FormField, value: any) => {
    if (!(name in validators)) return ''; // no validación requerida

    const validator = validators[name as ValidateField];
    const errs = validator(value);

    if (errs.length > 0) {
      return formError?.[name]?.[errs[0]] || 'Invalid data';
    }

    return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const fieldName = name as ValidateField;

    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    const err = getValidationError(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: err }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;

    const { name, type } = target;

    const value =
      type === 'checkbox' && target instanceof HTMLInputElement ? target.checked : target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const fieldName = name as FormField;

    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleForgotPassword = () => {
    router.push(href(lang, '/user/forgot-password'));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Partial<Record<FormField, string>> = {};

    fields.forEach((field) => {
      if (!(field in validators)) return;

      const value = formData[field];
      const err = getValidationError(field, value);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      setTouched((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(newErrors)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => [key, true])
        ),
      }));
      return;
    }

    const submitResult = await onSubmit(formData); // ✅ aquí ya es de tipo T

    if (submitResult === false) return;

    setFormData({
      ...initialValues,
      name: profile?.name || '',
      email: auth?.email || initialValues.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      clientId: client?._id || '',
      language: profile?.language || 'de',
    } as T);
    setErrors({});
    setTouched({});
  };

  return (
    <Form
      auth={auth}
      profile={profile ?? null}
      fields={fields}
      formData={formData}
      errors={errors}
      touched={touched}
      showPassword={showPassword}
      onChange={handleChange}
      onBlur={handleBlur}
      onTogglePassword={() => setShowPassword((prev) => !prev)}
      forgotPassword={handleForgotPassword}
      onSubmit={handleSubmit}
      button={button}
      showForgotPassword={showForgotPassword}
      showHintPassword={showHintPassword}
      placeholder={placeholderText}
      labels={labelText}
      loading={loading}
    />
  );
}
