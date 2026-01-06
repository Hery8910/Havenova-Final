import { useState } from 'react';
import styles from './ContactMessageResponder.module.css';
import { ContactMessage } from '@/packages/types';
import { respondContactMessage } from '../../../../packages/services/contact';
import { useGlobalAlert, useI18n } from '../../../../packages/contexts';
import {
  fallbackGlobalError,
  fallbackGlobalLoading,
} from '../../../../packages/contexts/i18n/fallbackText.de';
import { getPopup } from '../../../utils';

interface ContactMessageResponderProps {
  message: ContactMessage;
  onClose: () => void;
  onSubmitted: (payload: {
    text: string;
    respondedAt?: string;
    respondedBy?: string;
    respondedByName?: string;
    respondedByProfileImage?: string;
  }) => void;
}

export function ContactMessageResponder({
  message,
  onClose,
  onSubmitted,
}: ContactMessageResponderProps) {
  const { texts } = useI18n();
  const responderTexts = texts.components?.dashboard?.pages?.contactMessages?.responder;

  const { showError, showSuccess, showLoading, closeAlert } = useGlobalAlert();
  const [text, setText] = useState(message.response?.text || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);

    const loadingPopup = getPopup(
      texts.popups,
      'GLOBAL_LOADING',
      'GLOBAL_LOADING',
      fallbackGlobalLoading
    );
    showLoading({
      response: {
        status: 102,
        title: loadingPopup.title,
        description: loadingPopup.description,
      },
    });

    try {
      const res = await respondContactMessage(message._id, { text: text.trim() });
      closeAlert();

      const successPopup = {
        status: 200,
        title: responderTexts?.successTitle || 'Respuesta enviada',
        description:
          responderTexts?.successDescription ||
          res.message ||
          'El mensaje fue marcado como respondido.',
        cancelLabel: texts.popups.button?.close,
      };

      showSuccess({ response: successPopup, onCancel: closeAlert });
      onSubmitted({ text: text.trim(), respondedAt: new Date().toISOString() });
      onClose();
    } catch (error: any) {
      closeAlert();
      const errorKey = error?.response?.data?.errorCode;
      const popupData = getPopup(
        texts.popups,
        errorKey,
        'GLOBAL_INTERNAL_ERROR',
        fallbackGlobalError
      );
      showError({
        response: {
          status: error?.response?.status || 500,
          title: popupData.title,
          description: popupData.description || error?.response?.data?.message,
          cancelLabel: popupData.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <p className={styles.title}>{responderTexts?.title}</p>
        </div>
      </div>

      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={responderTexts?.textareaPlaceholder || 'Escribe tu respuesta...'}
      />

      <div className={styles.actions}>
        <button className={styles.button} onClick={onClose} disabled={submitting}>
          {responderTexts?.cancel || 'Cancelar'}
        </button>
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={handleSubmit}
          disabled={submitting || !text.trim()}
        >
          {responderTexts?.submit || 'Enviar respuesta'}
        </button>
      </div>
    </div>
  );
}
