'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './page.module.css';
import { getContactMessages } from '@/packages/services/contact';
import { ContactMessage } from '@/packages/types';
import { useClient } from '@/packages/contexts/client/ClientContext';
import {
  fallbackGlobalError,
  fallbackGlobalLoading,
  useGlobalAlert,
  useI18n,
} from '@/packages/contexts';
import { getPopup } from '@/packages/utils/alertType';

const PAGE_SIZE = 10;

const ContactMessagesPage = () => {
  const { client } = useClient();
  const { texts } = useI18n();
  const popups = texts.popups;
  const { showLoading, showError, closeAlert } = useGlobalAlert();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!client?._id) return;

    setLoading(true);
    const loadingPopup = getPopup(popups, 'GLOBAL_LOADING', 'GLOBAL_LOADING', fallbackGlobalLoading);
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
      const errorKey = error?.response?.data?.errorCode;
      const popupData = getPopup(popups, errorKey, 'GLOBAL_INTERNAL_ERROR', fallbackGlobalError);
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
      setLoading(false);
      closeAlert();
    }
  }, [client?._id, closeAlert, popups, showError, showLoading]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Contact</p>
          <h1>Mensajes recientes</h1>
          <p className={styles.sub}>
            Mostrando las últimas {PAGE_SIZE} consultas recibidas desde el formulario de contacto.
          </p>
        </div>
      </header>

      <section className={`${styles.list} card`}>
        {loading ? (
          <p className={styles.loading}>Cargando mensajes…</p>
        ) : messages.length === 0 ? (
          <p className={styles.empty}>Aún no hay mensajes para este cliente.</p>
        ) : (
          <ul className={styles.items}>
            {messages.map((msg) => (
              <li key={msg._id} className={styles.item}>
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
                    {msg.status === 'answered' ? 'Respondido' : 'Pendiente'}
                  </span>
                </div>
                <p className={styles.message}>{msg.message}</p>
                <div className={styles.meta}>
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  {msg.response?.text && (
                    <span className={styles.response}>Respuesta: {msg.response.text}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default ContactMessagesPage;
