import styles from './ConfirmationAlert.module.css';

export interface ConfirmationAlertTexts {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
}
export interface ConfirmationAlertProps {
  response: ConfirmationAlertTexts | null;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ConfirmationAlert: React.FC<ConfirmationAlertProps> = ({ response, onConfirm, onCancel }) => {
  if (!response) return null;
  return (
    <main className={styles.section_main}>
      <article className={styles.section_article}>
        <h4 className={styles.title}>{response.title}</h4>
        <p className={styles.description}>{response.description}</p>
        <div className={styles.button_group}>
          <button className={styles.cancel_button} onClick={onCancel}>
            {response.cancelLabel}
          </button>
          <button className={styles.confirm_button} onClick={onConfirm}>
            {response.confirmLabel}
          </button>
        </div>
      </article>
    </main>
  );
};

export default ConfirmationAlert;
