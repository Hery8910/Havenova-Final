import styles from './Form.module.css';
import MessageBox from '../../messageBox/MessageBox';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import { FormData } from '../../../types/userForm';

interface UserContactFormProps {
  fields: (keyof FormData | 'message')[];
  formData: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
}

const Form: React.FC<UserContactFormProps> = ({
  fields,
  formData,
  errors,
  touched,
  showPassword,
  onChange,
  onBlur,
  onTogglePassword,
  onSubmit,
  submitLabel,
}) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {fields.includes('name') && (
        <div className={styles.wrapper}>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name || ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="name"
            required
          />
          {touched.name && errors.name && <MessageBox message={errors.name} className="error" />}
        </div>
      )}
      {fields.includes('email') && (
        <div className={styles.wrapper}>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email || ''}
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="email"
            required
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
              onChange={onChange}
              onBlur={onBlur}
              required
            />
            <button className={styles.show} type="button" onClick={onTogglePassword}>
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
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="address"
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
            onChange={onChange}
            onBlur={onBlur}
            autoComplete="tel"
          />
          {touched.phone && errors.phone && <MessageBox message={errors.phone} className="error" />}
        </div>
      )}
      {fields.includes('message') && (
        <div className={styles.wrapper}>
          <textarea
            className={styles.input}
            name="message"
            placeholder="Your question or message"
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
      <button type="submit" className="button">
        {submitLabel}
      </button>
    </form>
  );
};

export default Form;
