'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './page.module.css';

import Image from 'next/image';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { href } from '../../../../../../packages/utils/navigation';
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import { MdDeleteForever } from 'react-icons/md';
import {
  fallbackGlobalError,
  fallbackGlobalLoading,
  useAuth,
  useClient,
  useGlobalAlert,
  useI18n,
  useRequireRole,
} from '../../../../../../packages/contexts';
import { ContactMessage, ContactMessageStatus } from '../../../../../../packages/types';
import { formatMessageAge, getPopup } from '../../../../../../packages/utils';
import { deleteContactMessage, getContactMessages } from '../../../../../../packages/services';
import { ContactMessageResponder } from '../../../../../../packages/components/dashboard/contactMessages/ContactMessageResponder';
import {
  DashboardSearchInput,
  DashboardStatusFilters,
  DashboardLoadMore,
  type DashboardStatusFilterItem,
} from '../../../../../../packages/components/dashboard';

const PAGE_SIZE = 10;

const ContactMessagesPage = () => {
  const isAllowed = useRequireRole('admin');
  const { client } = useClient();
  const { auth, refreshAuth } = useAuth();
  const router = useRouter();
  const { texts, language } = useI18n();
  const contactTexts = texts.components?.dashboard?.pages?.contactMessages;
  const listTexts = contactTexts?.list;
  const filterTexts = contactTexts?.filters;
  const deleteTexts = contactTexts?.delete;
  const popups = texts.popups;
  const { showLoading, showError, showConfirm, showSuccess, closeAlert } = useGlobalAlert();

  if (!isAllowed) return null;

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [activeResponseId, setActiveResponseId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totals, setTotals] = useState<{ total: number; pending: number; answered: number }>({
    total: 0,
    pending: 0,
    answered: 0,
  });
  const [filters, setFilters] = useState<{
    status?: ContactMessageStatus | '';
    query?: string;
  }>({});
  const [queryInput, setQueryInput] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const hasNextPage = useMemo(() => {
    if (totals.total) return page * PAGE_SIZE < totals.total;
    return messages.length === PAGE_SIZE;
  }, [messages.length, page, totals.total]);

  const statusFilters: DashboardStatusFilterItem<ContactMessageStatus | ''>[] = [
    {
      label: filterTexts?.statusAll || 'All',
      value: '',
      total: totals.total,
    },
    {
      label: filterTexts?.statusPending || 'Pending',
      value: 'pending',
      total: totals.pending,
    },
    {
      label: filterTexts?.statusAnswered || 'Answered',
      value: 'answered',
      total: totals.answered,
    },
  ];

  const handleStatusChange = (status: ContactMessageStatus | '') => {
    setFilters((prev) => ({
      ...prev,
      status,
    }));
    setPage(1);
  };

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
      const params = {
        clientId: client._id,
        page,
        limit: PAGE_SIZE,
        status: filters.status || undefined,
        search: filters.query?.trim() || undefined,
      };

      const data = await getContactMessages(params);
      const nextMessages = data.messages || [];
      setMessages((prev) => (page === 1 ? nextMessages : [...prev, ...nextMessages]));
      setTotals({
        total: data.totals?.total ?? data.count ?? 0,
        pending: data.totals?.pending ?? 0,
        answered: data.totals?.answered ?? 0,
      });
    } catch (error: any) {
      let errorToHandle = error;
      const status = error?.response?.status;

      if (status === 401) {
        try {
          await refreshAuth();
          const retryData = await getContactMessages({
            clientId: client._id,
            page,
            limit: PAGE_SIZE,
            status: filters.status || undefined,
            search: filters.query?.trim() || undefined,
          });
          const retryMessages = retryData.messages || [];
          setMessages((prev) => (page === 1 ? retryMessages : [...prev, ...retryMessages]));
          setTotals({
            total: retryData.totals?.total ?? retryData.count ?? 0,
            pending: retryData.totals?.pending ?? 0,
            answered: retryData.totals?.answered ?? 0,
          });
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
  }, [
    client?._id,
    closeAlert,
    filters.query,
    filters.status,
    page,
    popups,
    refreshAuth,
    showError,
    showLoading,
  ]);

  const handleDeleteMessage = useCallback(
    async (message: ContactMessage) => {
      if (!client?._id) return;
      setDeletingId(message._id);
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
        let response = await deleteContactMessage(message._id);
        closeAlert();

        if (!response?.success) {
          const popupData = getPopup(
            popups,
            response?.code,
            'GLOBAL_INTERNAL_ERROR',
            fallbackGlobalError
          );
          showError({
            response: {
              status: 500,
              title: popupData.title,
              description: popupData.description,
              cancelLabel: popupData.close,
            },
            onCancel: closeAlert,
          });
          return;
        }

        setMessages((prev) => prev.filter((item) => item._id !== message._id));
        setTotals((prev) => ({
          total: Math.max(0, prev.total - 1),
          pending: Math.max(0, prev.pending - (message.status === 'pending' ? 1 : 0)),
          answered: Math.max(0, prev.answered - (message.status === 'answered' ? 1 : 0)),
        }));

        showSuccess({
          response: {
            status: 200,
            title: deleteTexts?.successTitle || 'Message deleted',
            description: deleteTexts?.successDescription || '',
            cancelLabel: deleteTexts?.cancelLabel || popups.button?.close || 'Close',
          },
          onCancel: closeAlert,
        });
      } catch (error: any) {
        closeAlert();
        const status = error?.response?.status;
        if (status === 401) {
          try {
            await refreshAuth();
            const retry = await deleteContactMessage(message._id);
            closeAlert();
            if (retry?.success) {
              setMessages((prev) => prev.filter((item) => item._id !== message._id));
              setTotals((prev) => ({
                total: Math.max(0, prev.total - 1),
                pending: Math.max(0, prev.pending - (message.status === 'pending' ? 1 : 0)),
                answered: Math.max(0, prev.answered - (message.status === 'answered' ? 1 : 0)),
              }));
              showSuccess({
                response: {
                  status: 200,
                  title: deleteTexts?.successTitle || 'Message deleted',
                  description: deleteTexts?.successDescription || '',
                  cancelLabel: deleteTexts?.cancelLabel || popups.button?.close || 'Close',
                },
                onCancel: closeAlert,
              });
              return;
            }
          } catch {
            // fallthrough
          }
        }

        const popupData = getPopup(
          popups,
          'GLOBAL_INTERNAL_ERROR',
          'GLOBAL_INTERNAL_ERROR',
          fallbackGlobalError
        );
        showError({
          response: {
            status: 500,
            title: popupData.title,
            description: popupData.description,
            cancelLabel: popupData.close,
          },
          onCancel: closeAlert,
        });
      } finally {
        setDeletingId(null);
      }
    },
    [
      client?._id,
      closeAlert,
      deleteTexts?.cancelLabel,
      deleteTexts?.successDescription,
      deleteTexts?.successTitle,
      popups,
      refreshAuth,
      showError,
      showLoading,
      showSuccess,
    ]
  );

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleResponseSubmitted = (
    messageId: string,
    payload: {
      text: string;
      respondedAt?: string;
      respondedBy?: string;
      respondedByName?: string;
      respondedByProfileImage?: string;
    }
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
                respondedBy: payload.respondedBy ?? msg.response?.respondedBy,
                respondedByName: payload.respondedByName ?? msg.response?.respondedByName,
                respondedByProfileImage:
                  payload.respondedByProfileImage ?? msg.response?.respondedByProfileImage,
              },
            }
          : msg
      )
    );
  };

  if (!auth.isLogged) router.push(href(language, '/login'));

  const handleDeleteClick = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    showConfirm({
      response: {
        status: 400,
        title: deleteTexts?.confirmTitle || deleteTexts?.modalTitle || 'Delete message',
        description: deleteTexts?.confirmDescription || '',
        confirmLabel: deleteTexts?.confirmLabel || listTexts?.deleteCta || 'Delete',
        cancelLabel: deleteTexts?.cancelLabel || popups.button?.close || 'Cancel',
      },
      onConfirm: () => {
        closeAlert();
        handleDeleteMessage(target);
      },
      onCancel: () => {
        closeAlert();
        setDeletingId(null);
        return;
      },
    });
  };

  return (
    <main className={styles.main}>
      <DashboardSearchInput
        query={queryInput}
        placeholder={filterTexts?.searchPlaceholder}
        onQueryChange={setQueryInput}
        onApply={() => {
          setFilters((prev) => ({ ...prev, query: queryInput.trim() }));
          setPage(1);
        }}
      />
      <DashboardStatusFilters
        items={statusFilters}
        activeValue={filters.status ?? ''}
        onChange={handleStatusChange}
      />
      <section className={styles.list}>
        {messages.length === 0 ? (
          <div className={styles.listEmpty}>
            <p className={styles.empty}>{listTexts?.empty}</p>
            <button className={styles.responseBtn} onClick={fetchMessages}>
              Reload
            </button>
          </div>
        ) : (
          <ul className={styles.items}>
            {messages.map((msg) => (
              <li key={msg._id} className={styles.item}>
                <div className={styles.wrapper}>
                  <header className={styles.itemsHeader}>
                    <Image
                      className={styles.image}
                      src={msg.profileImage || '/avatars/avatar-1.svg'}
                      alt=""
                      width={40}
                      height={40}
                      aria-hidden="true"
                    />
                    <article className={styles.article}>
                      <p className={styles.name}>{msg.name}</p>
                      <p className={styles.email}>{msg.email}</p>
                    </article>
                    <aside className={styles.aside}>
                      <div className={styles.asideDiv}>
                        <span
                          className={`${styles.statusBadge} ${
                            msg.status === 'answered' ? styles.answered : styles.pending
                          }`}
                        >
                          {msg.status === 'answered'
                            ? listTexts?.badge?.answered || 'Respondido'
                            : listTexts?.badge?.pending || 'Pendiente'}
                        </span>
                        <span className={styles.date}>{formatMessageAge(msg.createdAt)}</span>
                      </div>
                      <button
                        className={styles.menuIcon}
                        onClick={() => {
                          if (deletingId === msg._id) {
                            setDeletingId(null);
                            return;
                          }
                          setDeleteTarget(msg);
                          setDeletingId(msg._id);
                        }}
                        aria-label={listTexts?.deleteCta || 'Delete'}
                      >
                        <BsThreeDotsVertical />
                      </button>
                      {deletingId === msg._id && (
                        <button
                          className={styles.deleteButton}
                          onClick={handleDeleteClick}
                          aria-label={listTexts?.deleteCta || 'Delete'}
                        >
                          <MdDeleteForever /> Delete
                        </button>
                      )}
                    </aside>
                  </header>
                  <section className={styles.msgSection}>
                    <article className={styles.msgArticle}>
                      <p className={styles.subject}>{msg.subject}</p>
                      <p className={styles.message}>{msg.message}</p>
                    </article>
                    <button
                      className={`${
                        msg.status === 'answered' ? styles.showBtn : styles.responseBtn
                      }`}
                      onClick={() => {
                        if (msg.status === 'answered') {
                          setActiveResponseId((prev) => (prev === msg._id ? null : msg._id));
                        } else {
                          setActiveMessageId((prev) => (prev === msg._id ? null : msg._id));
                        }
                      }}
                    >
                      {msg.status === 'answered'
                        ? activeResponseId === msg._id
                          ? texts.components?.dashboard?.pages?.contactMessages?.list?.hideResponse
                          : texts.components?.dashboard?.pages?.contactMessages?.list?.viewResponse
                        : activeMessageId === msg._id
                        ? texts.components?.dashboard?.pages?.contactMessages?.list?.cancelCta
                        : texts.components?.dashboard?.pages?.contactMessages?.list?.respondCta}
                      {msg.status === 'answered' ? (
                        activeResponseId === msg._id ? (
                          <IoIosArrowUp />
                        ) : (
                          <IoIosArrowDown />
                        )
                      ) : activeMessageId === msg._id ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </button>
                  </section>
                  {activeResponseId === msg._id && (
                    <aside className={styles.responseAside}>
                      <Image
                        className={styles.image}
                        src={msg.response?.respondedByProfileImage || '/avatars/avatar-1.svg'}
                        alt=""
                        width={40}
                        height={40}
                        aria-hidden="true"
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
                  {activeMessageId === msg._id && (
                    <ContactMessageResponder
                      message={msg}
                      onClose={() => setActiveMessageId(null)}
                      onSubmitted={(payload) => handleResponseSubmitted(msg._id, payload)}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <DashboardLoadMore
          hasMore={hasNextPage}
          loading={loading}
          label={filterTexts?.loadMoreLabel || 'Cargar mas resultados'}
          onLoadMore={() => setPage((current) => current + 1)}
        />
      </section>
    </main>
  );
};

export default ContactMessagesPage;
