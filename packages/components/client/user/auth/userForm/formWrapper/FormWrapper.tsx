'use client';

import React, { useEffect, useState } from 'react';
import { Form } from '../form';
import {
  validateEmail,
  validatePassword,
  validateTosAccepted,
} from '../../../../../../utils/validators/authFormValidator';
import { useI18n } from '../../../../../../contexts/i18n';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../../../../hooks/useLang';
import { href } from '../../../../../../utils/navigation';
import { useClient } from '../../../../../../contexts/client/ClientContext';
import { useAuth } from '../../../../../../contexts/auth/authContext';

interface WrapperProps<T extends Record<string, any>> {
  fields: (FormField & keyof T)[];
  onSubmit: (data: T) => void | boolean | Promise<void | boolean>;
  button: string;
  showForgotPassword?: boolean;
  showHintPassword?: boolean;
  initialValues: T;
  loading: boolean;
}
type ValidateField = 'email' | 'password' | 'tosAccepted';

export type FormField =
  | 'email'
  | 'password'
  | 'language'
  | 'clientId'
  | 'tosAccepted';

export interface PlaceholdersTextProps {
  email: string;
  password: string;
}

export interface LabelsTextProps {
  email: string;
  password: string;
  forgotPassword: string;
  passwordHint: string;
  tosPrefix: string;
  tosTerms: string;
  tosConnector: string;
  tosPrivacy: string;
  tosSuffix: string;
  showPassword: string;
  hidePassword: string;
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
      language: initialValues.language || 'de',
      email: auth?.email || initialValues.email || prev.email,
    }));
  }, [
    auth?.email,
    client?._id,
    initialValues.clientId,
    initialValues.email,
    initialValues.language,
  ]);

  const passwordValidator = (value: string): string[] => {
    if (showHintPassword) {
      return validatePassword(value);
    }
    return value?.trim() ? [] : ['required'];
  };

  const validators: Record<ValidateField, (value: any) => string[]> = {
    email: validateEmail,
    password: passwordValidator,
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
    const formElement = e.currentTarget;

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

      const firstInvalidField = fields.find((field) => Boolean(newErrors[field]));
      if (firstInvalidField) {
        const input = formElement.elements.namedItem(firstInvalidField);
        if (input instanceof HTMLElement) {
          input.focus();
        }
      }
      return;
    }

    const submitResult = await onSubmit(formData); // ✅ aquí ya es de tipo T

    if (submitResult === false) return;

    setFormData({
      ...initialValues,
      email: auth?.email || initialValues.email || '',
      clientId: client?._id || '',
      language: initialValues.language || 'de',
    } as T);
    setErrors({});
    setTouched({});
  };

  return (
    <Form
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
