import styles from './ContactForm.module.css';
import type { ContactFormField, ContactFormState } from './contactForm.types';

interface ContactFormViewProps {
  values: ContactFormState;
  submitting: boolean;
  submitLabel: string;
  sendingLabel: string;
  subjectOptions: string[];
  labels: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  placeholders: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  onChange: (field: ContactFormField, value: string) => void;
  onBlur: (field: ContactFormField) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  showFieldError: (field: ContactFormField) => string | false | undefined;
}

export function ContactFormView({
  values,
  submitting,
  submitLabel,
  sendingLabel,
  subjectOptions,
  labels,
  placeholders,
  onChange,
  onBlur,
  onSubmit,
  showFieldError,
}: ContactFormViewProps) {
  return (
    <section
      className={`${styles.section} card card--secondary`}
      aria-labelledby="contact-form-title"
    >
      <article className={styles.card}>
        <h3 id="contact-form-title" className="type-title-md">
          {submitLabel}
        </h3>

        <form className={styles.form} onSubmit={onSubmit} noValidate aria-busy={submitting}>
          <div className={styles.row}>
            <label className={styles.field} htmlFor="contact-name">
              <span className={`${styles.label} type-body-md`}>{labels.name}</span>
              <input
                id="contact-name"
                className="input"
                type="text"
                name="name"
                autoComplete="name"
                placeholder={placeholders.name}
                value={values.name}
                onChange={(e) => onChange('name', e.target.value)}
                onBlur={() => onBlur('name')}
                aria-invalid={!!showFieldError('name')}
                aria-describedby="contact-name-error"
                required
              />
              <span
                id="contact-name-error"
                className={`${styles.error} type-caption`}
                aria-live="polite"
              >
                {showFieldError('name') ?? ''}
              </span>
            </label>

            <label className={styles.field} htmlFor="contact-email">
              <span className={`${styles.label} type-body-md`}>{labels.email}</span>
              <input
                id="contact-email"
                className="input"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder={placeholders.email}
                value={values.email}
                onChange={(e) => onChange('email', e.target.value)}
                onBlur={() => onBlur('email')}
                aria-invalid={!!showFieldError('email')}
                aria-describedby="contact-email-error"
                required
              />
              <span
                id="contact-email-error"
                className={`${styles.error} type-caption`}
                aria-live="polite"
              >
                {showFieldError('email') ?? ''}
              </span>
            </label>
          </div>

          <label className={styles.field} htmlFor="contact-subject">
            <span className={`${styles.label} type-body-md`}>{labels.subject}</span>
            <select
              id="contact-subject"
              className="input"
              name="subject"
              value={values.subject}
              onChange={(e) => onChange('subject', e.target.value)}
              onBlur={() => onBlur('subject')}
              aria-invalid={!!showFieldError('subject')}
              aria-describedby="contact-subject-error"
              required
            >
              <option value="" disabled>
                {placeholders.subject}
              </option>
              {subjectOptions.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <span
              id="contact-subject-error"
              className={`${styles.error} type-caption`}
              aria-live="polite"
            >
              {showFieldError('subject') ?? ''}
            </span>
          </label>

          <label className={styles.field} htmlFor="contact-message">
            <span className={`${styles.label} type-body-md`}>{labels.message}</span>
            <textarea
              id="contact-message"
              className="input"
              name="message"
              rows={6}
              placeholder={placeholders.message}
              value={values.message}
              onChange={(e) => onChange('message', e.target.value)}
              onBlur={() => onBlur('message')}
              aria-invalid={!!showFieldError('message')}
              aria-describedby="contact-message-error"
              required
            />
            <span
              id="contact-message-error"
              className={`${styles.error} type-caption`}
              aria-live="polite"
            >
              {showFieldError('message') ?? ''}
            </span>
          </label>

          <div className={styles.actions}>
            <button
              className={` button button--primary ${styles.submit}`}
              type="submit"
              disabled={submitting}
            >
              {submitting ? sendingLabel : submitLabel}
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}
