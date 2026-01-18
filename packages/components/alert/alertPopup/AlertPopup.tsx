'use client';
import Image from 'next/image';
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
  loading?: boolean;
}

export default function AlertPopup({
  type,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
}: AlertPopupProps) {
  // Mapeo simple solo para las rutas de imagen
  const imageMap: Record<string, string> = {
    success: '/alert/success.svg',
    error: '/alert/error.svg',
    warning: '/alert/warning.svg',
    info: '/alert/info.svg',
  };

  // Determinamos el estado visual real. Si carga, forzamos el estilo 'loading'
  const currentType = loading ? 'loading' : type;
  const hasConfirm = !loading && !!onConfirm && !!confirmLabel;
  const hasCancel = !loading && !!onCancel && !!cancelLabel; // Opcional: ocultar cancelar si no hay label

  return (
    <div className={`${styles.overlay} card--glass`}>
      <section
        role={hasConfirm ? 'dialog' : 'alertdialog'}
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-description"
        className={styles.card}
        // 👇 Aquí ocurre la magia: pasamos el tipo al CSS
        data-type={currentType}
      >
        {/* Contenedor del Icono (Squircle flotante) */}
        <div className={loading ? styles.loadingWrapper : styles.iconWrapper}>
          {loading ? (
            <svg className={styles.spinner} viewBox="0 0 50 50">
              <circle
                className={styles.spinnerPath}
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="8"
              ></circle>
            </svg>
          ) : (
            <Image
              src={imageMap[type]}
              alt={`${type} icon`}
              width={40}
              height={40}
              className={styles.iconImage}
            />
          )}
        </div>

        {/* Contenido de Texto */}
        <article className={styles.content}>
          <h4 id="alert-title" className={styles.title}>
            {title}
          </h4>
          <p id="alert-description" className={styles.description}>
            {description}
          </p>

          {/* Botones (solo si no está cargando) */}
          {!loading && (
            <div className={styles.actions}>
              {hasCancel && (
                <button onClick={onCancel} className={styles.btnCancel}>
                  {cancelLabel || 'Cancel'}
                </button>
              )}

              {hasConfirm && (
                <button onClick={onConfirm} className={styles.btnConfirm}>
                  {confirmLabel || 'Confirm'}
                </button>
              )}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
