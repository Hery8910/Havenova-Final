'use client';

import styles from './RequestsList.module.css';
import { useI18n } from '../../../../../contexts/i18n';
import { ServiceStatus } from '../../../../../types';
import { RequestStatus } from '../requestStatus';

export interface RequestsListTexts {
  title: string;
  empty: string;
  button: string;
}

export interface RequestStatusTexts {
  submitted: string;
  accepted: string;
  inProgress: string;
  completed: string;
  cancelled: string;
}

export interface ServiceTexts {
  inspection: string;
  houseService: string;
  kitchenCleaning: string;
  kitchenAssembly: string;
  houseCleaning: string;
  furnitureAssembly: string;
  windowCleaning: string;
}

export interface DashboardRequestsTexts {
  requestsList: RequestsListTexts;
  requestStatus: RequestStatusTexts;
  service: ServiceTexts;
}

interface RequestsListProps {
  data: any[];
  loading: boolean;
  onSelect?: (id: string) => void;
}

export default function RequestsList({ data, loading, onSelect }: RequestsListProps) {
  const { texts } = useI18n();
  const dashboardTexts: DashboardRequestsTexts = texts?.components?.dashboard?.pages?.requests;

  const requestsList = dashboardTexts.requestsList;
  const requestStatus = dashboardTexts.requestStatus;
  const serviceTexts = dashboardTexts.service;

  if (loading) return <p>{requestsList.title}</p>;
  if (!data.length) return <p>{requestsList.empty}</p>;

  return (
    <ul className={styles.container}>
      {data.map((req) => (
        <li
          key={req._id}
          className={`${styles.card} ${styles[req.status.replace(' ', '-')]}`}
          onClick={() => onSelect && onSelect(req._id)}
        >
          <div className={`${styles.wrapper} card`}>
            <header className={styles.left}>
              <p>
                <strong>Id. {req._id || '—'}</strong>
              </p>
              <h4>{req.user?.name || '—'}</h4>
              <ul className={styles.list}>
                {req.services?.map((s: string, i: number) => (
                  <li key={i}>
                    <p>{serviceTexts[s as keyof ServiceTexts] || s}</p>
                  </li>
                ))}
              </ul>
            </header>

            <article className={styles.article}>
              <p className={styles.date}>
                <strong>{new Date(req.createdAt).toLocaleDateString()}</strong>
              </p>

              <RequestStatus
                status={req.status as ServiceStatus}
                label={requestStatus[req.status.replace(' ', '') as keyof typeof requestStatus]}
              />

              <p className={styles.button}>{requestsList.button}</p>
            </article>
          </div>
        </li>
      ))}
    </ul>
  );
}
