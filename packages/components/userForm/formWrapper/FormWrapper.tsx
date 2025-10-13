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
} from '../../../utils/validators/userFormValidator';
import { FormData, FormField } from '../../../types/userForm';
import { useI18n } from '../../../contexts/i18n';
import { ButtonProps } from '../../common/button/Button';
import { useRouter } from 'next/navigation';
import { useLang } from '../../../hooks/useLang';
import { href } from '../../../utils/navigation';
import { useUser } from '../../../contexts/user';
import { User } from '../../../types';
import { useClient } from '../../../contexts/client/ClientContext';
import { useEffect } from 'react';

interface WrapperProps<T extends Record<string, any>> {
  fields: (keyof T)[];
  onSubmit: (data: T) => void | Promise<void>;
  button: ButtonProps;
  showForgotPassword?: boolean;
  initialValues: T;
}

export interface PlaceholdersProps {
  name: string;
  email: string;
  password: string;
  forgotPassword: string;
  address: string;
  phone: string;
  message: string;
}
export default function FormWrapper<T extends Record<string, any>>({
  fields,
  onSubmit,
  button,
  showForgotPassword,
  initialValues,
}: WrapperProps<T>) {
  const { texts } = useI18n();
  const { user } = useUser();
  const { client } = useClient();
  const router = useRouter();
  const lang = useLang();

  const formError = texts.components.form.error;
  const forgotPassword = texts.components.form.forgotPassword;
  const placeholderText: PlaceholdersProps = texts.components.form.placeholders;

  const [formData, setFormData] = useState<T>(initialValues);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      clientId: client?._id || '',
      language: user?.language || 'de',
    }));
  }, [user?.email, user?.language, client?._id]);

  const validators: Record<string, (value: string) => string[]> = {
    name: validateName,
    email: validateEmail,
    phone: validatePhone,
    password: validatePassword,
    address: validateAddress,
    message: validateMessage,
  };

  const getValidationError = (name: string, value: string) => {
    const validator = validators[name];
    if (!validator) return '';
    const errs = validator(value);
    if (errs.length > 0) {
      // Aquí usas los textos de error traducibles desde tu objeto formError
      return formError?.[name]?.[errs[0]] || 'Invalid data';
    }
    return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = getValidationError(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleForgotPassword = () => {
    router.push(href(lang, '/user/forgot-password'));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = String(formData[field] ?? '');
      const err = getValidationError(field as string, value);
      if (err) newErrors[field as string] = err;
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;
    onSubmit(formData); // ✅ aquí ya es de tipo T

    setFormData({
      ...initialValues,
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      clientId: client?._id || '',
      language: user?.language || 'de',
    } as T);
    setErrors({});
    setTouched({});
  };

  return (
    <Form
      user={user}
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
      placeholder={placeholderText}
    />
  );
}
