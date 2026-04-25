'use client';

import React, { useEffect, useState } from 'react';
import { Form } from '../form';
import {
  validateName,
  validatePhone,
} from '../../../../../../utils/validators/profileFormValidator';
import { useI18n } from '../../../../../../contexts/i18n';

interface WrapperProps<T extends Record<string, any>> {
  fields: (ProfileFormField & keyof T)[];
  onSubmit: (data: T) => void | boolean | Promise<void | boolean>;
  button: string;
  initialValues: T;
  loading: boolean;
}

type ValidateField = 'name' | 'phone';

export type ProfileFormField = 'name' | 'phone';

export interface ProfileFormPlaceholders {
  name: string;
  phone: string;
}

export interface ProfileFormLabels {
  errorSummary: string;
  name: string;
  phone: string;
}

export interface ProfileErrorSummaryItem {
  field: ProfileFormField;
  message: string;
}

export default function FormWrapper<T extends Record<string, any>>({
  fields,
  onSubmit,
  button,
  initialValues,
  loading,
}: WrapperProps<T>) {
  const { texts } = useI18n();

  const formError = texts.components.client.form.error as Partial<
    Record<ProfileFormField, Record<string, string>>
  >;

  const placeholderText = texts.components.client.form.placeholders;
  const labelText = texts.components.client.form.labels;

  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<ProfileFormField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<ProfileFormField, boolean>>>({});

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const validators: Record<ValidateField, (value: any) => string[]> = {
    name: validateName,
    phone: validatePhone,
  };

  const getValidationError = (name: ProfileFormField, value: any) => {
    const validator = validators[name as ValidateField];
    const validationErrors = validator(value);

    if (validationErrors.length > 0) {
      return formError?.[name]?.[validationErrors[0]] || 'Invalid data';
    }

    return '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as ProfileFormField;

    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    setErrors((prev) => ({ ...prev, [fieldName]: getValidationError(fieldName, value) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as ProfileFormField;

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
    const formElement = e.currentTarget;

    const newErrors: Partial<Record<ProfileFormField, string>> = {};

    fields.forEach((field) => {
      const value = formData[field];
      const error = getValidationError(field, value);
      if (error) newErrors[field] = error;
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

    const submitResult = await onSubmit(formData);
    if (submitResult === false) return;

    setFormData(initialValues);
    setErrors({});
    setTouched({});
  };

  return (
    <Form
      fields={fields}
      formData={formData}
      errors={errors as Record<string, string>}
      touched={touched as Record<string, boolean>}
      errorSummary={fields
        .map((field) => ({
          field,
          message: errors[field] || '',
        }))
        .filter((entry): entry is ProfileErrorSummaryItem => Boolean(entry.message))}
      onChange={handleChange}
      onBlur={handleBlur}
      onSubmit={handleSubmit}
      button={button}
      placeholder={{
        name: placeholderText.name,
        phone: placeholderText.phone,
      }}
      labels={{
        errorSummary: labelText.errorSummary,
        name: labelText.name,
        phone: labelText.phone,
      }}
      loading={loading}
    />
  );
}
