import Image from 'next/image';
import { IoIosClose } from 'react-icons/io';
import styles from './AlertPopup.module.css';
import { AlertType } from '../../../utils/alertType';

export interface AlertPopupProps {
  type: AlertType;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const AlertPopup: React.FC<AlertPopupProps> = ({
  type,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) => {
  const imageMap = {
    success: '/svg/alert/success.svg',
    error: '/svg/alert/error.svg',
    warning: '/svg/alert/warning.svg',
    info: '/svg/alert/info.svg',
  };

  const colorMap = {
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
  };

  const bgColorMap = {
    success: 'var(--bg-success)',
    error: 'var(--bg-error)',
    warning: 'var(--bg-warning)',
    info: 'var(--bg-info)',
  };

  const hasConfirm = !!onConfirm && !!confirmLabel;

  return (
    <section
      role={hasConfirm ? 'dialog' : 'alertdialog'}
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby="alert-description"
      tabIndex={-1}
      className={`${styles.section} card`}
    >
      <div
        className={styles.wraper}
        style={{
          background: bgColorMap[type],
          border: `1px solid ${colorMap[type]}`,
        }}
      >
        <Image
          src={imageMap[type]}
          priority
          alt={`${type} icon`}
          width={100}
          height={100}
          className={styles.image}
          style={{ background: colorMap[type] }}
        />

        <h4 style={{ color: colorMap[type] }} id="alert-title">
          <strong>{title}</strong>
        </h4>

        <p id="alert-description">{description}</p>

        <div className={styles.button_group}>
          <button
            className={styles.cancel_button}
            onClick={onCancel}
            style={{
              borderColor: colorMap[type],
              color: colorMap[type],
              backgroundColor: 'transparent',
            }}
          >
            {cancelLabel || 'Cancel'}
          </button>
          {hasConfirm && (
            <button
              className={styles.confirm_button}
              onClick={onConfirm}
              style={{
                borderColor: colorMap[type],
                backgroundColor: colorMap[type],
              }}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default AlertPopup;
