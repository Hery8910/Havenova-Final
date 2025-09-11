'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import styles from './UserContactForm.module.css';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { useI18n } from '../../contexts/I18nContext';

import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateAddress,
} from '../../utils/validators/userFormValidator';
import MessageBox from '../messageBox/MessageBox';
import { useClient } from '../../contexts/ClientContext';
import { registerUser } from '../../services/userService';
import { AlertPopup } from '../alertPopup/AlertPopup';
import AvatarSelector from '../user/avatarSelector/AvatarSelector';
// import { RegisterData } from '../../../apps/public/user/register/page';
import {
  formErrorProps,
  RegisterFormData,
  UserContactFormProps,
  UserFormMode,
} from '../../types/userForm';

const UserContactForm: React.FC<UserContactFormProps> = ({ fields, onSubmit, mode }) => {
  const { user } = useUser();
  const { client } = useClient();
  const clientId = client?._id;
  const { texts } = useI18n();
  const buttonLabels: Record<UserFormMode, string> = {
    register: texts.components.user.register.button,
    login: texts.components.user.login.button,
    edit: texts.components.user.edit.button,
    forgotPassword: texts.components.user.forgotPassword.button,
    resetPassword: texts.components.user.resetPassword.button,
  };

  // Por si mode es desconocido, fallback:
  const submitLabel = buttonLabels[mode as UserFormMode] || texts.components.user.register.button;

  const [formData, setFormData] = useState<RegisterFormData>({
    name: user?.name || '',
    email: user?.email || '',
    password: user?.password || '',
    address: user?.address || '',
    profileImage: user?.profileImage || '',
    phone: user?.phone || '',
    language: user?.language || 'de',
    theme: user?.theme || 'light',
    clientId: clientId || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const formError: formErrorProps = texts.error.userForm;
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (clientId && formData.clientId !== clientId) {
      setFormData((prev) => ({
        ...prev,
        clientId,
      }));
    }
  }, [clientId, formData.clientId]);

  const getValidationErrors = (fieldName: string, fieldValue: string): string => {
    let errorKeys: string[] = [];

    switch (fieldName) {
      case 'name':
        errorKeys = validateName(fieldValue);
        break;
      case 'email':
        errorKeys = validateEmail(fieldValue);
        break;
      case 'phone':
        errorKeys = validatePhone(fieldValue);
        break;
      case 'password':
        errorKeys = validatePassword(fieldValue);
        break;
      case 'address':
        errorKeys = validateAddress(fieldValue);
        break;
      default:
        errorKeys = [];
    }

    if (errorKeys.length === 0) return '';

    const errorKey = errorKeys[0];
    const fieldErrors = formError[fieldName as keyof formErrorProps];

    // @ts-ignore: indexación dinámica
    return fieldErrors?.[errorKey] || 'Ungültige Daten';
  };

  const firstFieldWithError = Object.keys(errors).find((key) => errors[key]);

  const isFieldDisabled = (field: string) => !!firstFieldWithError && field !== firstFieldWithError;

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = getValidationErrors(name, inputValue);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: prevErrors[name] ? '' : prevErrors[name],
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      const value = formData[field] as string;
      const error = getValidationErrors(field, value);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }
    onSubmit(
      fields.reduce((obj, key) => ({ ...obj, [key]: formData[key] }), {} as RegisterFormData)
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {fields.includes('name') && (
        <div className={styles.wrapper}>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="name"
            required
            disabled={isFieldDisabled('name')}
          />
          {touched.name && errors.name && <MessageBox message={errors.name} className="error" />}
        </div>
      )}
      {fields.includes('email') && mode !== 'resetPassword' && (
        <div className={styles.wrapper}>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="email"
            required
            disabled={isFieldDisabled('email')}
          />
          {touched.email && errors.email && <MessageBox message={errors.email} className="error" />}
        </div>
      )}
      {fields.includes('password') && (
        <div className={styles.wrapper}>
          <div className={styles.div}>
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              autoComplete="new-password"
              disabled={isFieldDisabled('password')}
            />
            <button
              className={styles.show}
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <ImEye /> : <ImEyeBlocked />}
            </button>
          </div>
          {touched.password && errors.password && (
            <MessageBox message={errors.password} className="error" />
          )}
        </div>
      )}
      {fields.includes('address') && (
        <div className={styles.wrapper}>
          <input
            className={styles.input}
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="address"
            required
            disabled={isFieldDisabled('address')}
          />
          {touched.address && errors.address && (
            <MessageBox message={errors.address} className="error" />
          )}
        </div>
      )}
      {fields.includes('phone') && (
        <div className={styles.wrapper}>
          <input
            className={styles.input}
            type="tel"
            name="phone"
            placeholder="Phone +49 123456789"
            value={formData.phone || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="phone"
            required
            disabled={isFieldDisabled('phone')}
          />
          {touched.phone && errors.phone && <MessageBox message={errors.phone} className="error" />}
        </div>
      )}
      <button type="submit" className="button">
        {submitLabel}
      </button>
    </form>
  );
};

export default UserContactForm;
