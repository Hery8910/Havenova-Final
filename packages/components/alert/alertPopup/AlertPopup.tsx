import Image from 'next/image';
import { IoIosClose } from 'react-icons/io';
import styles from './AlertPopup.module.css';
import { AlertType } from '../../../utils/alertType';

interface AlertPopupProps {
  type: AlertType;
  title: string;
  description: string;
  onClose?: () => void;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ type, title, description, onClose }) => {
  const imageMap = {
    success: '/svg/alert/success.svg',
    error: '/svg/alert/error.svg',
    warning: '/svg/alert/warning.svg',
    info: '/svg/alert/info.svg',
  };

  const colorMap = {
    success: 'var(--color-success)',
    error: 'var(--color-alert)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
  };

  const bgColorMap = {
    success: 'var(--bg-success)',
    error: 'var(--bg-alert)',
    warning: 'var(--bg-warning)',
    info: 'var(--bg-info)',
  };

  return (
    <section
      role="alert"
      aria-live="assertive"
      aria-labelledby="alert-title"
      aria-describedby="alert-description"
      tabIndex={-1}
      className={styles.section}
    >
      <div className={styles.wraper}>
        <Image
          src={imageMap[type]}
          priority
          alt={`${type} image`}
          width={100}
          height={100}
          className={styles.image}
          style={{ background: colorMap[type] }}
        />
        <aside
          style={{
            background: bgColorMap[type],
            border: `1px solid ${colorMap[type]}`,
          }}
          className={styles.main}
        >
          {onClose && (
            <button className={styles.button} onClick={onClose} aria-label="Close alert">
              <IoIosClose />
            </button>
          )}
          <article className={styles.article}>
            <h4 style={{ color: colorMap[type] }} id="alert-title">
              <strong>{title}</strong>
            </h4>
            <p id="alert-description">{description}</p>
          </article>
        </aside>
      </div>
    </section>
  );
};

export default AlertPopup;
