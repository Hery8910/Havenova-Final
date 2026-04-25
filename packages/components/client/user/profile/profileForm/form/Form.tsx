import styles from './Form.module.css';
import {
  ProfileFormField,
  ProfileFormLabels,
  ProfileFormPlaceholders,
  ProfileErrorSummaryItem,
} from '../formWrapper/FormWrapper';

interface ProfileFormProps<T extends Record<string, any>> {
  fields: ProfileFormField[];
  formData: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  errorSummary: ProfileErrorSummaryItem[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  button: string;
  placeholder: ProfileFormPlaceholders;
  labels: ProfileFormLabels;
  loading: boolean;
}

const renderFieldError = (fieldTouched?: boolean, fieldError?: string) =>
  fieldTouched && fieldError ? fieldError : '\u00A0';

export default function Form<T extends Record<string, any>>({
  fields,
  formData,
  errors,
  touched,
  errorSummary,
  onChange,
  onBlur,
  onSubmit,
  button,
  placeholder,
  labels,
  loading,
}: ProfileFormProps<T>) {
  const hasErrors = errorSummary.length > 0;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {hasErrors && (
        <div
          className={styles.errorSummary}
          role="alert"
          aria-live="assertive"
          aria-labelledby="profile-form-error-summary-title"
        >
          <p id="profile-form-error-summary-title" className={styles.errorSummaryTitle}>
            {labels.errorSummary}
          </p>
          <ul className={styles.errorSummaryList}>
            {errorSummary.map((entry) => (
              <li key={`${entry.field}-${entry.message}`}>{entry.message}</li>
            ))}
          </ul>
        </div>
      )}

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
            value={formData.name ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="name"
            required
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
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
            {renderFieldError(touched.name, errors.name)}
          </p>
        </div>
      )}

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
            value={formData.phone ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="tel"
            aria-invalid={Boolean(touched.phone && errors.phone)}
            aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
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
            {renderFieldError(touched.phone, errors.phone)}
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
