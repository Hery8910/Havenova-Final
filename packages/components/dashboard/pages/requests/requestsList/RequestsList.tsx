'use client';

import styles from './RequestsList.module.css';
import { useI18n } from '../../../../../contexts/i18n';
import type { ServiceRequestStatus } from '../../../../../types';
import { RequestStatus } from '../requestStatus';

export interface RequestsListTexts {
  title: string;
  empty: string;
  button: string;
}

export interface RequestStatusTexts {
  submitted: string;
  accepted?: string;
  inProgress?: string;
  completed?: string;
  underReview?: string;
  visitScheduled?: string;
  visitCompleted?: string;
  cancelled: string;
}

export interface ServiceTexts {
  painting: string;
  repairsInstallations: string;
  kitchenCleaning: string;
  kitchenAssembly: string;
  houseCleaning: string;
  furnitureAssembly: string;
  windowCleaning: string;
  movingHelp: string;
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
  const getStatusLabel = (status: ServiceRequestStatus) => {
    switch (status) {
      case 'submitted':
        return requestStatus.submitted;
      case 'under_review':
        return requestStatus.underReview ?? requestStatus.accepted ?? status;
      case 'visit_scheduled':
        return requestStatus.visitScheduled ?? requestStatus.inProgress ?? status;
      case 'visit_completed':
        return requestStatus.visitCompleted ?? requestStatus.completed ?? status;
      case 'converted_to_work_order':
        return requestStatus.visitCompleted ?? requestStatus.completed ?? status;
      case 'cancelled':
        return requestStatus.cancelled;
      default:
        return status;
    }
  };

  const getServiceLabel = (serviceType: string) => {
    const normalizedKey = serviceType.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    return serviceTexts[normalizedKey as keyof ServiceTexts] || serviceTexts[serviceType as keyof ServiceTexts] || serviceType;
  };

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
          <div className={`${styles.wrapper} glass-panel--base`}>
            <header className={styles.left}>
              <p>
                <strong>Id. {req._id || '—'}</strong>
              </p>
              <h4>{req.user?.name || '—'}</h4>
              <ul className={styles.list}>
                {req.services?.map((s: string, i: number) => (
                  <li key={i}>
                    <p>{getServiceLabel(s)}</p>
                  </li>
                ))}
              </ul>
            </header>

            <article className={styles.article}>
              <p className={styles.date}>
                <strong>{new Date(req.createdAt).toLocaleDateString()}</strong>
              </p>

              <RequestStatus
                status={req.status as ServiceRequestStatus}
                label={getStatusLabel(req.status as ServiceRequestStatus)}
              />

              <p className={styles.button}>{requestsList.button}</p>
            </article>
          </div>
        </li>
      ))}
    </ul>
  );
}
