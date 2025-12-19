'use client';

import Image from 'next/image';
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';
import styles from './page.module.css';
import { ContactMessage } from '@/packages/types';
import { ContactMessageResponder } from '@/packages/components/dashboard/contactMessages/ContactMessageResponder';
import { formatMessageAge } from '@/packages/utils/date';

interface ContactMessagesListTexts {
  empty?: string;
  reloadCta?: string;
  respondCta?: string;
  cancelCta?: string;
  viewResponse?: string;
  hideResponse?: string;
  deleteCta?: string;
  message?: string;
  answer?: string;
  badge?: { pending?: string; answered?: string };
}

interface ContactMessagesListProps {
  messages: ContactMessage[];
  listTexts?: ContactMessagesListTexts;
  page: number;
  loading: boolean;
  hasNextPage: boolean;
  pageLabel?: string;
  prevPageLabel?: string;
  nextPageLabel?: string;
  activeMessageId: string | null;
  activeResponseId: string | null;
  onReload: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onToggleResponse: (id: string) => void;
  onToggleResponder: (id: string) => void;
  onDelete: (message: ContactMessage) => void;
  onResponded: (
    messageId: string,
    payload: {
      text: string;
      respondedAt?: string;
      respondedBy?: string;
      respondedByName?: string;
      respondedByProfileImage?: string;
    }
  ) => void;
  onCloseResponder: () => void;
}

export default function ContactMessagesList({
  messages,
  listTexts,
  page,
  loading,
  hasNextPage,
  pageLabel,
  prevPageLabel,
  nextPageLabel,
  activeMessageId,
  activeResponseId,
  onReload,
  onPrevPage,
  onNextPage,
  onToggleResponse,
  onToggleResponder,
  onDelete,
  onResponded,
  onCloseResponder,
}: ContactMessagesListProps) {
  return (
    <section className={styles.list}>
      {messages.length === 0 ? (
        <div className={styles.listEmpty}>
          <p className={styles.empty}>{listTexts?.empty || 'No messages'}</p>
          <button className={styles.responseBtn} type="button" onClick={onReload}>
            {listTexts?.reloadCta || 'Reload'}
          </button>
        </div>
      ) : (
        <ul className={styles.items}>
          {messages.map((msg) => {
            const responseId = `message-response-${msg._id}`;
            const responderId = `message-responder-${msg._id}`;
            const isAnswered = msg.status === 'answered';
            const isResponseOpen = activeResponseId === msg._id;
            const isResponderOpen = activeMessageId === msg._id;

            return (
              <li key={msg._id} className={styles.item}>
                <Image
                  className={styles.image}
                  src={msg.profileImage || '/avatars/avatar-1.svg'}
                  alt={`${msg.name} avatar`}
                  width={40}
                  height={40}
                />
                <div className={styles.wrapper}>
                  <header className={styles.itemsHeader}>
                    <article className={styles.article}>
                      <p className={styles.name}>{msg.name}</p>
                      <p className={styles.email}>{msg.email}</p>
                    </article>
                    <aside className={styles.aside}>
                      <button
                        className={styles.deleteAction}
                        type="button"
                        onClick={() => onDelete(msg)}
                        aria-label={listTexts?.deleteCta || 'Delete'}
                      >
                        <MdDeleteForever aria-hidden="true" />
                        {listTexts?.deleteCta || 'Delete'}
                      </button>
                      <span
                        className={`${styles.statusBadge} ${
                          isAnswered ? styles.answered : styles.pending
                        }`}
                      >
                        {isAnswered
                          ? listTexts?.badge?.answered || 'Answered'
                          : listTexts?.badge?.pending || 'Pending'}
                      </span>
                      <span className={styles.date}>{formatMessageAge(msg.createdAt)}</span>
                    </aside>
                  </header>
                  <section className={styles.msgSection}>
                    <article className={styles.msgArticle}>
                      {msg.subject && <p className={styles.subject}>{msg.subject}</p>}
                      <p className={styles.message}>{msg.message}</p>
                    </article>
                    <button
                      className={isAnswered ? styles.showBtn : styles.responseBtn}
                      type="button"
                      aria-expanded={isAnswered ? isResponseOpen : isResponderOpen}
                      aria-controls={isAnswered ? responseId : responderId}
                      onClick={() => {
                        if (isAnswered) {
                          onToggleResponse(msg._id);
                        } else {
                          onToggleResponder(msg._id);
                        }
                      }}
                    >
                      {isAnswered
                        ? isResponseOpen
                          ? listTexts?.hideResponse || 'Hide response'
                          : listTexts?.viewResponse || 'View response'
                        : isResponderOpen
                        ? listTexts?.cancelCta || 'Cancel'
                        : listTexts?.respondCta || 'Respond'}
                      {isAnswered ? (
                        isResponseOpen ? (
                          <IoIosArrowUp aria-hidden="true" />
                        ) : (
                          <IoIosArrowDown aria-hidden="true" />
                        )
                      ) : isResponderOpen ? (
                        <IoIosArrowUp aria-hidden="true" />
                      ) : (
                        <IoIosArrowDown aria-hidden="true" />
                      )}
                    </button>
                  </section>
                  {isAnswered && isResponseOpen && (
                    <aside className={styles.responseAside} id={responseId}>
                      <Image
                        className={styles.image}
                        src={msg.response?.respondedByProfileImage || '/avatars/avatar-1.svg'}
                        alt={msg.response?.respondedByName || 'System'}
                        width={40}
                        height={40}
                      />
                      <article className={styles.responseArticle}>
                        <div className={styles.responseDiv}>
                          <p className={styles.name}>{msg.response?.respondedByName || 'System'}</p>
                          {msg.response?.respondedAt && (
                            <span className={styles.date}>
                              {formatMessageAge(msg.response?.respondedAt)}
                            </span>
                          )}
                        </div>
                        <p className={styles.response}>{msg.response?.text}</p>
                      </article>
                    </aside>
                  )}
                  {!isAnswered && isResponderOpen && (
                    <div id={responderId}>
                      <ContactMessageResponder
                        message={msg}
                        onClose={onCloseResponder}
                        onSubmitted={(payload) => onResponded(msg._id, payload)}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          type="button"
          disabled={page <= 1 || loading}
          onClick={onPrevPage}
          aria-label={prevPageLabel || 'Previous page'}
        >
          <IoIosArrowBack aria-hidden="true" />
        </button>
        <span className={styles.pageLabel}>
          {(pageLabel || 'Page').trim()} {page}
        </span>
        <button
          className={styles.paginationButton}
          type="button"
          disabled={!hasNextPage || loading}
          onClick={onNextPage}
          aria-label={nextPageLabel || 'Next page'}
        >
          <IoIosArrowForward aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
