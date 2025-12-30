//form.tsx

import styles from './Form.module.css';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { LabelsTextProps, PlaceholdersTextProps, FormField } from '../formWrapper/FormWrapper';
import { AuthUser, UserClientProfile } from '../../../../types';

interface GenericFormProps<T extends Record<string, any>> {
  auth: AuthUser | null;
  profile: UserClientProfile | null;
  fields: FormField[];
  formData: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTogglePassword: () => void;
  forgotPassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  button: string;
  showForgotPassword?: boolean;
  showHintPassword?: boolean;
  placeholder: PlaceholdersTextProps;
  labels: LabelsTextProps;
  loading: boolean;
}

export default function Form<T extends Record<string, any>>({
  auth,
  profile,
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
  loading,
}: GenericFormProps<T>) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {/* NAME */}
      {fields.includes('name') && (
        <div className={styles.wrapper}>
          <label className={styles.label} htmlFor="name">
            {labels.name}
          </label>
          <input
            className={styles.input}
            type="text"
            name="name"
            id="name"
            placeholder={placeholder.name}
            value={formData.name ?? profile?.name ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="name"
            required
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby="name-error"
          />
          <p
            className={
              touched.name && errors.name
                ? `${styles.feedback} ${styles.error}`
                : `${styles.feedback} ${styles.hidden}`
            }
            id="name-error"
            role="status"
            aria-live="polite"
          >
            {touched.name && errors.name ? errors.name : '\u00A0'}
          </p>
        </div>
      )}

      {/* EMAIL */}
      {fields.includes('email') && (
        <div className={styles.wrapper}>
          <label className={styles.label} htmlFor="email">
            {labels.email}
          </label>
          <input
            className={styles.input}
            type="email"
            name="email"
            id="email"
            placeholder={placeholder.email}
            value={formData.email || ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="email"
            required
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby="email-error"
          />
          <p
            className={
              touched.email && errors.email
                ? `${styles.feedback} ${styles.error}`
                : `${styles.feedback} ${styles.hidden}`
            }
            id="email-error"
            role="status"
            aria-live="polite"
          >
            {touched.email && errors.email ? errors.email : '\u00A0'}
          </p>
        </div>
      )}

      {/* PASSWORD */}
      {fields.includes('password') && (
        <div className={styles.wrapper}>
          <article className={styles.article}>
            <label className={styles.label} htmlFor="password">
              {labels.password}
            </label>
            {showForgotPassword && (
              <button
                className={styles.forgotPassword}
                type="button"
                onClick={forgotPassword}
                aria-label={labels.forgotPassword}
              >
                {labels.forgotPassword}
              </button>
            )}
          </article>

          <div className={styles.div}>
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder={placeholder.password}
              value={formData.password || ''}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="off"
              required
              aria-invalid={Boolean(touched.password && errors.password)}
              aria-describedby="password-hint"
            />
            <button
              className={styles.show}
              type="button"
              onClick={onTogglePassword}
              aria-pressed={showPassword}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <ImEye /> : <ImEyeBlocked />}
            </button>
          </div>

          <p
            className={
              touched.password && errors.password
                ? `${styles.feedback} ${styles.error}`
                : showHintPassword
                ? `${styles.feedback} ${styles.hint}`
                : `${styles.feedback} ${styles.hidden}`
            }
            id="password-hint"
            role="status"
            aria-live="polite"
          >
            {
              touched.password && errors.password
                ? errors.password
                : showHintPassword
                ? labels.passwordHint
                : '\u00A0' /* espacio duro para mantener altura */
            }
          </p>
        </div>
      )}

      {/* ADDRESS */}
      {fields.includes('address') && (
        <div className={styles.wrapper}>
          <label className={styles.label} htmlFor="address">
            {labels.address}
          </label>
          <input
            className={styles.input}
            type="text"
            name="address"
            id="address"
            placeholder={placeholder.address}
            value={formData.address ?? profile?.address ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="address"
            aria-invalid={Boolean(touched.address && errors.address)}
            aria-describedby="address-error"
          />
          <p
            className={
              touched.address && errors.address
                ? `${styles.feedback} ${styles.error}`
                : `${styles.feedback} ${styles.hidden}`
            }
            id="address-error"
            role="status"
            aria-live="polite"
          >
            {touched.address && errors.address ? errors.address : '\u00A0'}
          </p>
        </div>
      )}

      {/* PHONE */}
      {fields.includes('phone') && (
        <div className={styles.wrapper}>
          <label className={styles.label} htmlFor="phone">
            {labels.phone}
          </label>
          <input
            className={styles.input}
            type="tel"
            name="phone"
            id="phone"
            placeholder={placeholder.phone}
            value={formData.phone ?? profile?.phone ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="tel"
            aria-invalid={Boolean(touched.phone && errors.phone)}
            aria-describedby="phone-error"
          />
          <p
            className={
              touched.phone && errors.phone
                ? `${styles.feedback} ${styles.error}`
                : `${styles.feedback} ${styles.hidden}`
            }
            id="phone-error"
            role="status"
            aria-live="polite"
          >
            {touched.phone && errors.phone ? errors.phone : '\u00A0'}
          </p>
        </div>
      )}

      {/* MESSAGE */}
      {fields.includes('message') && (
        <div className={styles.wrapper}>
          <label className={styles.label} htmlFor="message">
            {labels.message}
          </label>
          <textarea
            className={styles.input}
            name="message"
            id="message"
            placeholder={placeholder.message}
            value={formData.message || ''}
            onChange={onChange}
            onBlur={onBlur}
            rows={4}
            aria-invalid={Boolean(touched.message && errors.message)}
            aria-describedby="message-error"
          />
          <p
            className={
              touched.message && errors.message
                ? `${styles.feedback} ${styles.error}`
                : `${styles.feedback} ${styles.hidden}`
            }
            id="message-error"
            role="status"
            aria-live="polite"
          >
            {touched.message && errors.message ? errors.message : '\u00A0'}
          </p>
        </div>
      )}

      {/* ✅ CHECKBOX TOS (solo en register → showHintPassword) */}
      {fields.includes('tosAccepted') && (
        <div className={styles.checkboxWrapper}>
          <label className={styles.checkboxLabel} htmlFor="tosAccepted">
            <input
              type="checkbox"
              name="tosAccepted"
              id="tosAccepted"
              checked={Boolean((formData as any).tosAccepted)}
              onChange={onChange}
              className={styles.checkboxInput}
              aria-invalid={Boolean(touched.tosAccepted && errors.tosAccepted)}
              aria-describedby="tos-error"
            />
            <span className={styles.customCheckbox}></span>
            <span className={styles.checkboxText}>{labels.tos}</span>
          </label>

          <p
            className={
              touched.tosAccepted && errors.tosAccepted
                ? `${styles.feedback} ${styles.error}`
                : `${styles.feedback} ${styles.hidden}`
            }
            id="tos-error"
            role="status"
            aria-live="polite"
          >
            {touched.tosAccepted && errors.tosAccepted ? errors.tosAccepted : '\u00A0'}
          </p>
        </div>
      )}

      <button
        className={styles.button}
        type="submit"
        disabled={loading}
        aria-disabled={loading}
        aria-busy={loading}
      >
        {button}
      </button>
    </form>
  );
}
