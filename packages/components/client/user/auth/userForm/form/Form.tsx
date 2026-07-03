//form.tsx

import Link from 'next/link';
import { useMemo } from 'react';
import styles from './Form.module.css';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { LabelsTextProps, PlaceholdersTextProps, FormField } from '../formWrapper/FormWrapper';
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
  forgotPassword?: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  button: string;
  showForgotPassword?: boolean;
  showHintPassword?: boolean;
  placeholder: PlaceholdersTextProps;
  labels: LabelsTextProps;
  loading: boolean;
  idPrefix: string;
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
  idPrefix,
}: GenericFormProps<T>) {
  const lang = useLang();
  const hasErrorSummary = Object.values(errors).some(Boolean);
  const errorSummaryId = `${idPrefix}-error-summary`;
  const emailErrorId = `${idPrefix}-email-error`;
  const passwordErrorId = `${idPrefix}-password-error`;
  const confirmPasswordErrorId = `${idPrefix}-confirm-password-error`;
  const passwordHintId = `${idPrefix}-password-hint`;
  const confirmPasswordHintId = `${idPrefix}-confirm-password-hint`;
  const tosErrorId = `${idPrefix}-tos-error`;
  const tosHelpId = `${idPrefix}-tos-help`;
  const tosLegendId = `${idPrefix}-tos-legend`;

  const passwordDescriptionId = useMemo(() => {
    if (touched.password && errors.password) return passwordErrorId;
    if (showHintPassword) return passwordHintId;
    return undefined;
  }, [errors.password, passwordErrorId, passwordHintId, showHintPassword, touched.password]);

  const tosDescriptionId = useMemo(() => {
    return errors.tosAccepted ? `${tosErrorId} ${tosHelpId}` : tosHelpId;
  }, [errors.tosAccepted, tosErrorId, tosHelpId]);

  const confirmPasswordDescriptionId = useMemo(() => {
    if (touched.confirmPassword && errors.confirmPassword) return confirmPasswordErrorId;
    if (showHintPassword) return confirmPasswordHintId;
    return undefined;
  }, [
    confirmPasswordErrorId,
    confirmPasswordHintId,
    errors.confirmPassword,
    showHintPassword,
    touched.confirmPassword,
  ]);

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      noValidate
      aria-describedby={hasErrorSummary ? errorSummaryId : undefined}
    >
      {hasErrorSummary ? (
        <div
          className={styles.errorSummary}
          id={errorSummaryId}
          role="alert"
          aria-live="assertive"
        >
          {labels.errorSummary}
        </div>
      ) : null}

      {fields.includes('email') && (
        <div className={styles.wrapper}>
          <label className={styles.label} htmlFor={`${idPrefix}-email`}>
            {labels.email}
          </label>
          <input
            className={`${styles.input} input`}
            type="email"
            name="email"
            id={`${idPrefix}-email`}
            placeholder={placeholder.email}
            value={formData.email || ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="email"
            required
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={touched.email && errors.email ? emailErrorId : undefined}
            aria-errormessage={touched.email && errors.email ? emailErrorId : undefined}
          />
          <p
            className={
              touched.email && errors.email
                ? `${styles.feedback} ${styles.error}`
                : `${styles.feedback} ${styles.hidden}`
            }
            id={emailErrorId}
            role={touched.email && errors.email ? 'alert' : undefined}
            aria-live={touched.email && errors.email ? 'assertive' : undefined}
          >
            {touched.email && errors.email ? errors.email : '\u00A0'}
          </p>
        </div>
      )}

      {fields.includes('password') && (
        <div className={styles.wrapper}>
          <div className={styles.article}>
            <label className={styles.label} htmlFor={`${idPrefix}-password`}>
              {labels.password}
            </label>
            {showForgotPassword && (
              <button
                className={styles.forgotPassword}
                type="button"
                onClick={forgotPassword}
                aria-label={labels.forgotPassword}
                aria-disabled={!forgotPassword}
                disabled={!forgotPassword}
              >
                {labels.forgotPassword}
              </button>
            )}
          </div>

          <div className={styles.div}>
            <input
              className={`${styles.input} input`}
              type={showPassword ? 'text' : 'password'}
              name="password"
              id={`${idPrefix}-password`}
              placeholder={placeholder.password}
              value={formData.password || ''}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete={showHintPassword ? 'new-password' : 'current-password'}
              required
              aria-invalid={Boolean(touched.password && errors.password)}
              aria-describedby={passwordDescriptionId}
              aria-errormessage={touched.password && errors.password ? passwordErrorId : undefined}
            />
            <button
              className={styles.show}
              type="button"
              onClick={onTogglePassword}
              aria-pressed={showPassword}
              aria-label={showPassword ? labels.hidePassword : labels.showPassword}
              aria-controls={`${idPrefix}-password`}
              title={showPassword ? labels.hidePassword : labels.showPassword}
            >
              {showPassword ? <ImEye /> : <ImEyeBlocked />}
            </button>
          </div>

          {touched.password && errors.password ? (
            <p
              className={`${styles.feedback} ${styles.error}`}
              id={passwordErrorId}
              role="alert"
              aria-live="assertive"
            >
              {errors.password}
            </p>
          ) : showHintPassword ? (
            <p
              className={`${styles.feedback} ${styles.hint}`}
              id={passwordHintId}
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
      {fields.includes('confirmPassword') && (
        <div className={styles.wrapper}>
          <label className={styles.label} htmlFor={`${idPrefix}-confirmPassword`}>
            {labels.confirmPassword}
          </label>

          <div className={styles.div}>
            <input
              className={`${styles.input} input`}
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              id={`${idPrefix}-confirmPassword`}
              placeholder={placeholder.confirmPassword}
              value={formData.confirmPassword || ''}
              onChange={onChange}
              onBlur={onBlur}
              autoComplete="new-password"
              required
              aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
              aria-describedby={confirmPasswordDescriptionId}
              aria-errormessage={
                touched.confirmPassword && errors.confirmPassword
                  ? confirmPasswordErrorId
                  : undefined
              }
            />
            <button
              className={styles.show}
              type="button"
              onClick={onTogglePassword}
              aria-pressed={showPassword}
              aria-label={showPassword ? labels.hidePassword : labels.showPassword}
              aria-controls={`${idPrefix}-confirmPassword`}
              title={showPassword ? labels.hidePassword : labels.showPassword}
            >
              {showPassword ? <ImEye /> : <ImEyeBlocked />}
            </button>
          </div>

          {touched.confirmPassword && errors.confirmPassword ? (
            <p
              className={`${styles.feedback} ${styles.error}`}
              id={confirmPasswordErrorId}
              role="alert"
              aria-live="assertive"
            >
              {errors.confirmPassword}
            </p>
          ) : showHintPassword ? (
            <p
              className={`${styles.feedback} ${styles.hint}`}
              id={confirmPasswordHintId}
              aria-live="polite"
            >
              {labels.confirmPasswordHint}
            </p>
          ) : (
            <p className={`${styles.feedback} ${styles.hidden}`} aria-hidden="true">
              {'\u00A0'}
            </p>
          )}
        </div>
      )}
      {fields.includes('tosAccepted') && (
        <fieldset className={styles.checkboxWrapper} aria-describedby={tosDescriptionId}>
          <legend className={styles.assistiveText} id={tosLegendId}>
            {labels.tosPrefix} {labels.tosTerms} {labels.tosConnector} {labels.tosPrivacy}
          </legend>

          <label className={styles.checkboxLabel} htmlFor={`${idPrefix}-tosAccepted`}>
            <input
              type="checkbox"
              name="tosAccepted"
              id={`${idPrefix}-tosAccepted`}
              checked={Boolean((formData as any).tosAccepted)}
              onChange={onChange}
              onBlur={onBlur}
              className={styles.checkboxInput}
              aria-invalid={Boolean(touched.tosAccepted && errors.tosAccepted)}
              aria-describedby={tosDescriptionId}
              aria-errormessage={errors.tosAccepted ? tosErrorId : undefined}
              required
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
            </span>
          </label>

          <p id={tosHelpId} className={styles.assistiveText}>
            {labels.tosPrefix} {labels.tosTerms} {labels.tosConnector} {labels.tosPrivacy}
          </p>

          <p
            className={
              errors.tosAccepted
                ? `${styles.feedback} ${styles.error}`
                : `${styles.feedback} ${styles.hidden}`
            }
            id={tosErrorId}
            role={errors.tosAccepted ? 'alert' : undefined}
            aria-live={errors.tosAccepted ? 'assertive' : undefined}
          >
            {errors.tosAccepted ? errors.tosAccepted : '\u00A0'}
          </p>
        </fieldset>
      )}

      <button
        className={`${styles.button} button button--primary`}
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
