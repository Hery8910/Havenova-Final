//form.tsx

import Link from 'next/link';
import { useMemo } from 'react';
import styles from './Form.module.css';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import {
  LabelsTextProps,
  PlaceholdersTextProps,
  FormField,
} from '../formWrapper/FormWrapper';
import { useLang } from '../../../../../../hooks/useLang';
import { href } from '../../../../../../utils/navigation';

interface GenericFormProps<T extends Record<string, any>> {
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
  const lang = useLang();

  const passwordDescriptionId = useMemo(() => {
    if (touched.password && errors.password) return 'password-error';
    if (showHintPassword) return 'password-hint';
    return undefined;
  }, [errors.password, showHintPassword, touched.password]);

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
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
            aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
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
              autoComplete={showHintPassword ? 'new-password' : 'current-password'}
              required
              aria-invalid={Boolean(touched.password && errors.password)}
              aria-describedby={passwordDescriptionId}
            />
            <button
              className={styles.show}
              type="button"
              onClick={onTogglePassword}
              aria-pressed={showPassword}
              aria-label={showPassword ? labels.hidePassword : labels.showPassword}
            >
              {showPassword ? <ImEye /> : <ImEyeBlocked />}
            </button>
          </div>

          {touched.password && errors.password ? (
            <p
              className={`${styles.feedback} ${styles.error}`}
              id="password-error"
              role="status"
              aria-live="polite"
            >
              {errors.password}
            </p>
          ) : showHintPassword ? (
            <p
              className={`${styles.feedback} ${styles.hint}`}
              id="password-hint"
              role="status"
              aria-live="polite"
            >
              {labels.passwordHint}
            </p>
          ) : (
            <p className={`${styles.feedback} ${styles.hidden}`} aria-hidden="true">
              {'\u00A0'}
            </p>
          )}
        </div>
      )}
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
              aria-describedby={errors.tosAccepted ? 'tos-error' : undefined}
            />
            <span className={styles.customCheckbox}></span>
            <span className={styles.checkboxText}>
              {labels.tosPrefix}
              <Link className={styles.policyLink} href={href(lang, '/legal/terms-of-service')}>
                {labels.tosTerms}
              </Link>
              {labels.tosConnector}
              <Link className={styles.policyLink} href={href(lang, '/legal/privacy-policy')}>
                {labels.tosPrivacy}
              </Link>
              {labels.tosSuffix}
            </span>
          </label>

          <p
            className={
              errors.tosAccepted
                ? `${styles.feedback} ${styles.error}`
                : `${styles.feedback} ${styles.hidden}`
            }
            id="tos-error"
            role="status"
            aria-live="polite"
          >
            {errors.tosAccepted ? errors.tosAccepted : '\u00A0'}
          </p>
        </div>
      )}

      <button
        className={`${styles.button} button`}
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
