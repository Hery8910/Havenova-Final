'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { FaFolder } from 'react-icons/fa';
import { useClient, useRequireRole } from '../../../../../../packages/contexts';
interface RequestFilters {
  status: string;
  date: string;
  search: string;
}

interface WorkRequestSummary {
  _id: string;
  status: string;
  createdAt: string;
  services?: string[];
  user?: {
    name?: string;
  };
}
import {
  RequestList,
  RequestsToolbar,
  WorkRequestDetail,
} from '../../../../../../packages/components/dashboard/pages';

export default function Requests() {
  const isAllowed = useRequireRole('admin');
  const { client } = useClient();

  if (!isAllowed) return null;

  const [requests, setRequests] = useState<WorkRequestSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<RequestFilters>({
    status: '',
    date: '',
    search: '',
  });
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const handleSelectRequest = (id: string) => {
    const selected = requests.find((request) => request._id === id);
    if (selected) {
      setSelectedRequest(selected);
    }
  };

  const handleFilterChange = (key: keyof RequestFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className={styles.section}>
      {!selectedRequest ? (
        <div className={styles.wrapper}>
          <header className={styles.header}>
            <FaFolder />
            <h3>Work Requests</h3>
          </header>

          <RequestList data={requests} loading={loading} onSelect={handleSelectRequest} />
        </div>
      ) : (
        <WorkRequestDetail
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdated={() => undefined}
        />
      )}
    </section>
  );
}
