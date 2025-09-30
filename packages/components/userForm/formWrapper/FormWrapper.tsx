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

interface WrapperProps<T extends Record<string, any>> {
  fields: (keyof T)[];
  onSubmit: (data: T) => void | Promise<void>;
  button: ButtonProps;
  initialValues: T;
}

export interface PlaceholdersProps {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  message: string;
}
export default function FormWrapper<T extends Record<string, any>>({
  fields,
  onSubmit,
  button,
  initialValues,
}: WrapperProps<T>) {
  const { texts } = useI18n();
  const formError = texts.components.form.error;
  const placeholderText: PlaceholdersProps = texts.components.form.placeholders;

  const [formData, setFormData] = useState<T>(initialValues);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

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

    setFormData(initialValues);
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
      onSubmit={handleSubmit}
      button={button}
      placeholder={placeholderText}
    />
  );
}
