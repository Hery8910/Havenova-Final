import { ButtonProps } from '../button/Button';
import { ContactMessageFormData } from '../../../types';
import styles from './ContactForm.module.css';

type ContactField = 'name' | 'email' | 'subject' | 'message';

interface ContactFormTexts {
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
}

interface ContactFormProps {
  formData: ContactMessageFormData;
  errors: Partial<Record<ContactField, string>>;
  touched: Partial<Record<ContactField, boolean>>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  button: ButtonProps;
  loading: boolean;
  texts: ContactFormTexts;
  subjects: string[];
}

export default function ContactForm({
  formData,
  errors,
  touched,
  onChange,
  onBlur,
  onSubmit,
  button,
  loading,
  texts,
  subjects,
}: ContactFormProps) {
  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.wrapper}>
        <label className={styles.label} htmlFor="contact-name">
          {texts.labels.name}
        </label>
        <input
          className={styles.input}
          type="text"
          name="name"
          id="contact-name"
          placeholder={texts.placeholders.name}
          value={formData.name || ''}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="name"
          required
          aria-invalid={Boolean(touched.name && errors.name)}
          aria-describedby="contact-name-error"
        />
        <p
          className={
            touched.name && errors.name
              ? `${styles.feedback} ${styles.error}`
              : `${styles.feedback} ${styles.hidden}`
          }
          id="contact-name-error"
          role="status"
          aria-live="polite"
        >
          {touched.name && errors.name ? errors.name : '\u00A0'}
        </p>
      </div>

      <div className={styles.wrapper}>
        <label className={styles.label} htmlFor="contact-email">
          {texts.labels.email}
        </label>
        <input
          className={styles.input}
          type="email"
          name="email"
          id="contact-email"
          placeholder={texts.placeholders.email}
          value={formData.email || ''}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="email"
          required
          aria-invalid={Boolean(touched.email && errors.email)}
          aria-describedby="contact-email-error"
        />
        <p
          className={
            touched.email && errors.email
              ? `${styles.feedback} ${styles.error}`
              : `${styles.feedback} ${styles.hidden}`
          }
          id="contact-email-error"
          role="status"
          aria-live="polite"
        >
          {touched.email && errors.email ? errors.email : '\u00A0'}
        </p>
      </div>

      <div className={styles.wrapper}>
        <label className={styles.label} htmlFor="contact-subject">
          {texts.labels.subject}
        </label>
        <select
          className={styles.input}
          name="subject"
          id="contact-subject"
          value={formData.subject || ''}
          onChange={onChange}
          onBlur={onBlur}
          required
          aria-invalid={Boolean(touched.subject && errors.subject)}
          aria-describedby="contact-subject-error"
        >
          <option value="" disabled>
            {texts.placeholders.subject}
          </option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        <p
          className={
            touched.subject && errors.subject
              ? `${styles.feedback} ${styles.error}`
              : `${styles.feedback} ${styles.hidden}`
          }
          id="contact-subject-error"
          role="status"
          aria-live="polite"
        >
          {touched.subject && errors.subject ? errors.subject : '\u00A0'}
        </p>
      </div>

      <div className={styles.wrapper}>
        <label className={styles.label} htmlFor="contact-message">
          {texts.labels.message}
        </label>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          name="message"
          id="contact-message"
          placeholder={texts.placeholders.message}
          value={formData.message || ''}
          onChange={onChange}
          onBlur={onBlur}
          rows={6}
          required
          aria-invalid={Boolean(touched.message && errors.message)}
          aria-describedby="contact-message-error"
        />
        <p
          className={
            touched.message && errors.message
              ? `${styles.feedback} ${styles.error}`
              : `${styles.feedback} ${styles.hidden}`
          }
          id="contact-message-error"
          role="status"
          aria-live="polite"
        >
          {touched.message && errors.message ? errors.message : '\u00A0'}
        </p>
      </div>

      <button
        className={styles.button}
        type="submit"
        disabled={loading}
        aria-disabled={loading}
        aria-busy={loading}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {button.cta}
      </button>
    </form>
  );
}
