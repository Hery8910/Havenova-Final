//form.tsx

import styles from './Form.module.css';
import MessageBox from '../../messageBox/MessageBox';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { ButtonProps } from '../../common/button/Button';
import { LabelsTextProps, PlaceholdersTextProps } from '../formWrapper/FormWrapper';
import { FrontendUser } from '../../../types';

interface GenericFormProps<T extends Record<string, any>> {
  user: FrontendUser | null;
  fields: (keyof T)[];
  formData: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTogglePassword: () => void;
  forgotPassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  button: ButtonProps;
  showForgotPassword?: boolean;
  showHintPassword?: boolean;
  placeholder: PlaceholdersTextProps;
  labels: LabelsTextProps;
}

export default function Form<T extends Record<string, any>>({
  user,
  fields,
  formData,
  errors,
  touched,
  showPassword,
  onChange,
  onBlur,
  onTogglePassword,
  forgotPassword,
  onSubmit,
  button,
  showForgotPassword,
  showHintPassword,
  placeholder,
  labels,
}: GenericFormProps<T>) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {/* NAME */}
      {fields.includes('name') && (
        <div className={styles.wrapper}>
          <label className={styles.label}>{labels.name}</label>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder={placeholder.name}
            value={user?.userProfile?.name || formData.name}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="name"
            required
          />
          {touched.name && errors.name && <MessageBox message={errors.name} className="error" />}
        </div>
      )}

      {/* EMAIL */}
      {fields.includes('email') && (
        <div className={styles.wrapper}>
          <label className={styles.label}>{labels.email}</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder={placeholder.email}
            value={formData.email || ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="email"
            required
          />
          {touched.email && errors.email && <MessageBox message={errors.email} className="error" />}
        </div>
      )}

      {/* PASSWORD */}
      {fields.includes('password') && (
        <div className={styles.wrapper}>
          <article className={styles.article}>
            <label className={styles.label}>{labels.password}</label>
            {showForgotPassword && (
              <button className={styles.forgotPassword} type="button" onClick={forgotPassword}>
                {labels.forgotPassword}
              </button>
            )}
          </article>

          <div className={styles.div}>
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder={placeholder.password}
              value={formData.password || ''}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="off"
              required
            />
            <button className={styles.show} type="button" onClick={onTogglePassword}>
              {showPassword ? <ImEye /> : <ImEyeBlocked />}
            </button>
          </div>

          {touched.password && errors.password ? (
            <p className={styles.error}>{errors.password}</p>
          ) : showHintPassword ? (
            <p className={styles.hint}>{labels.passwordHint}</p>
          ) : null}
        </div>
      )}

      {/* ADDRESS */}
      {fields.includes('address') && (
        <div className={styles.wrapper}>
          <label className={styles.label}>{labels.address}</label>
          <input
            className={styles.input}
            type="text"
            name="address"
            placeholder={placeholder.address}
            value={user?.userProfile?.address || formData.address}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="address"
          />
          {touched.address && errors.address && (
            <MessageBox message={errors.address} className="error" />
          )}
        </div>
      )}

      {/* PHONE */}
      {fields.includes('phone') && (
        <div className={styles.wrapper}>
          <label className={styles.label}>{labels.phone}</label>
          <input
            className={styles.input}
            type="tel"
            name="phone"
            placeholder={placeholder.phone}
            value={user?.userProfile?.phone || formData.phone}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="tel"
          />
          {touched.phone && errors.phone && <MessageBox message={errors.phone} className="error" />}
        </div>
      )}

      {/* MESSAGE */}
      {fields.includes('message') && (
        <div className={styles.wrapper}>
          <label className={styles.label}>{labels.message}</label>
          <textarea
            className={styles.input}
            name="message"
            placeholder={placeholder.message}
            value={formData.message || ''}
            onChange={onChange}
            onBlur={onBlur}
            rows={4}
          />
          {touched.message && errors.message && (
            <MessageBox message={errors.message} className="error" />
          )}
        </div>
      )}

      {/* ✅ CHECKBOX TOS (solo en register → showHintPassword) */}
      {fields.includes('tosAccepted') && (
        <div className={styles.checkboxWrapper}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="tosAccepted"
              checked={Boolean((formData as any).tosAccepted)}
              onChange={onChange}
              className={styles.checkboxInput}
            />
            <span className={styles.customCheckbox}></span>
            <span className={styles.checkboxText}>{labels.tos}</span>
          </label>

          {touched.tosAccepted && errors.tosAccepted && (
            <MessageBox message={errors.tosAccepted} className="error" />
          )}
        </div>
      )}

      <button className={styles.button} type="submit">
        {button.cta}
      </button>
    </form>
  );
}
