import React, { useState } from 'react';
import styles from './ChangePassword.module.css';
import { useClient } from '../../../contexts/ClientContext';
import { useUser } from '../../../contexts/UserContext';
import MessageBox from '../../messageBox/MessageBox';
import { validatePassword } from '../../../utils/validators/userFormValidator';
import { formErrorProps, RegisterFormData } from '../../../types/userForm';
import { useI18n } from '../../../contexts/I18nContext';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { chagePassword } from '../../../services/userService';
import { AlertPopup } from '../../alertPopup/AlertPopup';
import { IoClose } from 'react-icons/io5';

interface ChangePasswordFormData {
  email: string;
  password: string;
  newPassword: string;
  clientId: string;
}

export default function ChangePassword() {
  const { user } = useUser();
  const { client } = useClient();
  const { texts } = useI18n();
  const changePasswordButton = texts.components.user.changePassword.button;
  const popups = texts.popups;
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    email: user?.email || '',
    password: '',
    newPassword: '',
    clientId: client?._id || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formError: formErrorProps = texts.error.userForm;

  const getValidationErrors = (fieldName: string, fieldValue: string): string => {
    let errorKeys: string[] = [];

    switch (fieldName) {
      case 'password':
        errorKeys = validatePassword(fieldValue);
        break;
      case 'newPassword':
        errorKeys = validatePassword(fieldValue);
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!client?._id) {
        const popupData = popups?.GLOBAL_INTERNAL_ERROR || {};
        setAlert({
          type: 'error',
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          description: popupData.description || popups.GLOBAL_INTERNAL_ERROR.description,
        });
        return;
      }
      if (!formData.email || !formData.password || !formData.newPassword) return;

      const response = await chagePassword(formData);
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setAlert({
          type: 'success',
          title: popupData.title || popups.USER_EDIT_USER_UPDATE_SUCCESS.title,
          description: popupData.description || popups.USER_EDIT_USER_UPDATE_SUCCESS.description,
        });
        setOpen(false);
        setFormData({
          email: user?.email || '',
          password: '',
          newPassword: '',
          clientId: client?._id || '',
        });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode;
        const popupData = popups?.[errorKey] || {};
        setAlert({
          type: 'error',
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          description:
            popupData.description ||
            error.response.data.message ||
            popups.GLOBAL_INTERNAL_ERROR.description,
        });
      } else {
        setAlert({
          type: 'error',
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
      }
    }
  };

  return (
    <main className={styles.main}>
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="button_invert">
          Change Password
        </button>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <button type="button" onClick={() => setOpen(false)} className="button_close">
            <IoClose />
          </button>
          <article className={styles.article}>
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
                />
                <button
                  className={styles.show}
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <ImEye /> : <ImEyeBlocked />}
                </button>
              </div>
              {errors.password && <MessageBox message={errors.password} className="error" />}
            </div>
            <div className={styles.wrapper}>
              <div className={styles.div}>
                <input
                  className={styles.input}
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="New Password"
                  value={formData.newPassword || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <button
                  className={styles.show}
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <ImEye /> : <ImEyeBlocked />}
                </button>
              </div>
              {errors.password && <MessageBox message={errors.password} className="error" />}
            </div>
            <button type="submit" className="button">
              {changePasswordButton}
            </button>
          </article>
        </form>
      )}
      {alert && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onClose={() => setAlert(null)}
        />
      )}
    </main>
  );
}
