import styles from './Form.module.css';
import MessageBox from '../../messageBox/MessageBox';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import Button, { ButtonProps } from '../../common/button/Button';
import { PlaceholdersProps } from '../formWrapper/FormWrapper';

interface GenericFormProps<T extends Record<string, any>> {
  fields: (keyof T)[];
  formData: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  button: ButtonProps;
  placeholder: PlaceholdersProps;
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
  onSubmit,
  button,
  placeholder,
}: GenericFormProps<T>) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {fields.includes('name') && (
        <div className={styles.wrapper}>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder={placeholder.name}
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
      {fields.includes('password') && (
        <div className={styles.wrapper}>
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
            placeholder={placeholder.address}
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
            placeholder={placeholder.phone}
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

      <Button type="submit" cta={button.cta} icon={button.icon} />
    </form>
  );
}
