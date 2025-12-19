'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './page.module.css';
import { getContactMessages } from '@/packages/services/contact';
import { ContactMessage } from '@/packages/types';
import { useClient } from '@/packages/contexts/client/ClientContext';
import {
  fallbackGlobalError,
  fallbackGlobalLoading,
  useAuth,
  useGlobalAlert,
  useI18n,
} from '@/packages/contexts';
import { getPopup } from '@/packages/utils/alertType';
import { ContactMessageResponder } from '@/packages/components/dashboard/contactMessages/ContactMessageResponder';

const PAGE_SIZE = 10;

const ContactMessagesPage = () => {
  const { client } = useClient();
  const { refreshAuth } = useAuth();
  const { texts } = useI18n();
  const contactTexts = texts.components?.dashboard?.pages?.contactMessages;
  const listTexts = contactTexts?.list;
  const popups = texts.popups;
  const { showLoading, showError, closeAlert } = useGlobalAlert();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!client?._id) return;

    setLoading(true);
    const loadingPopup = getPopup(
      popups,
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
      const data = await getContactMessages({ clientId: client._id, page: 1, limit: PAGE_SIZE });
      setMessages(data.messages || []);
    } catch (error: any) {
      let errorToHandle = error;
      const status = error?.response?.status;

      if (status === 401) {
        try {
          await refreshAuth();
          const retryData = await getContactMessages({
            clientId: client._id,
            page: 1,
            limit: PAGE_SIZE,
          });
          setMessages(retryData.messages || []);
          return;
        } catch (retryError: any) {
          errorToHandle = retryError;
        }
      }

      const errorKey = errorToHandle?.response?.data?.errorCode;
      const popupData = getPopup(popups, errorKey, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
      showError({
        response: {
          status: errorToHandle?.response?.status || 500,
          title: popupData.title,
          description: popupData.description || errorToHandle?.response?.data?.message,
          cancelLabel: popupData.close,
        },
        onCancel: closeAlert,
      });
    } finally {
      setLoading(false);
      closeAlert();
    }
  }, [client?._id, closeAlert, popups, refreshAuth, showError, showLoading]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleResponseSubmitted = (
    messageId: string,
    payload: { text: string; respondedAt?: string }
  ) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              status: 'answered',
              response: {
                ...msg.response,
                text: payload.text,
                respondedAt: payload.respondedAt || msg.response?.respondedAt,
              },
            }
          : msg
      )
    );
  };

  return (
    <main className={styles.main}>
      <section className={styles.list}>
        {loading ? (
          <p className={styles.loading}>{listTexts?.loading || 'Cargando mensajes…'}</p>
        ) : messages.length === 0 ? (
          <p className={styles.empty}>
            {listTexts?.empty || 'Aún no hay mensajes para este cliente.'}
          </p>
        ) : (
          <ul className={styles.items}>
            {messages.map((msg) => (
              <li key={msg._id} className={`${styles.item} card`}>
                <div className={styles.itemHeader}>
                  <div>
                    <p className={styles.name}>{msg.name}</p>
                    <p className={styles.email}>{msg.email}</p>
                  </div>
                  <span
                    className={`${styles.badge} ${
                      msg.status === 'answered' ? styles.answered : styles.pending
                    }`}
                  >
                    {msg.status === 'answered'
                      ? listTexts?.badge?.answered || 'Respondido'
                      : listTexts?.badge?.pending || 'Pendiente'}
                  </span>
                </div>
                <p className={styles.message}>{msg.message}</p>
                <div className={styles.meta}>
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  {msg.response?.text && (
                    <span className={styles.response}>
                      {(listTexts?.viewResponse || 'Respuesta') + ': '} {msg.response.text}
                    </span>
                  )}
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.replyButton}
                    onClick={() =>
                      setActiveMessageId((prev) => (prev === msg._id ? null : msg._id))
                    }
                  >
                    {msg.status === 'answered'
                      ? texts.components?.dashboard?.pages?.contactMessages?.list?.viewResponse ||
                        'Ver respuesta'
                      : texts.components?.dashboard?.pages?.contactMessages?.list?.respondCta ||
                        'Responder'}
                  </button>
                </div>

                {activeMessageId === msg._id && (
                  <ContactMessageResponder
                    message={msg}
                    onClose={() => setActiveMessageId(null)}
                    onSubmitted={(payload) => handleResponseSubmitted(msg._id, payload)}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default ContactMessagesPage;
