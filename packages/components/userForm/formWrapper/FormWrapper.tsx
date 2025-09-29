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

interface WrapperProps {
  fields: FormField[];
  onSubmit: (data: Partial<FormData>) => void;
  button: ButtonProps;
}
export interface PlaceholdersProps {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  message: string;
}
export default function FormWrapper({ fields, onSubmit, button }: WrapperProps) {
  const { texts } = useI18n();
  const formError = texts.components.form.error;
  const placeholderText: PlaceholdersProps = texts.components.form.placeholders;

  const initialFormData: FormData = {
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    profileImage: '',
    language: 'de',
    theme: 'light',
    clientId: '',
    message: '',
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = getValidationError(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const value = formData[field] as string;
      const err = getValidationError(field, value);
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;
    onSubmit(fields.reduce((acc, f) => ({ ...acc, [f]: formData[f] }), {}));

    setFormData(initialFormData);
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
