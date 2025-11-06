'use client';

import { useEffect, useState, useCallback } from 'react';
import { useClient } from '@/packages/contexts/client/ClientContext';
import { useUser } from '@/packages/contexts/user/UserContext';
import {
  getWorkRequestById,
  getWorkRequests,
  RequestFilters,
  WorkRequestSummary,
} from '@/packages/services/workRequest';
import { RequestsToolbar } from '@/packages/components/dashboard/pages/requests/requestsToolbar';
import { WorkRequestDetail } from '@/packages/components/dashboard/pages/requests/workRequestDetail';
import { RequestList } from '@/packages/components/dashboard/pages/requests/requestsList';
import styles from './page.module.css';
import { FaFolder } from 'react-icons/fa';

export default function Requests() {
  const { client } = useClient();
  const { user } = useUser();

  const [requests, setRequests] = useState<WorkRequestSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    status: number;
    title: string;
    description: string;
  } | null>(null);

  const [filters, setFilters] = useState<RequestFilters>({
    status: '',
    date: '',
    search: '',
  });
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const handleSelectRequest = async (id: string) => {
    try {
      const data = await getWorkRequestById(id);
      setSelectedRequest(data);
      console.log('🟢 Selected request:', data);
      // Aquí luego puedes abrir un modal o panel lateral con esos detalles
    } catch (error) {
      console.error('Error fetching work request details:', error);
    }
  };

  const fetchWorkRequests = useCallback(async () => {
    if (!client?._id) return;

    setLoading(true);
    try {
      const response = await getWorkRequests(client._id, filters);

      if (response.success) {
        setRequests(response.workRequests);
      } else {
        setAlert({
          status: 400,
          title: 'Error loading requests',
          description: 'Could not retrieve work requests.',
        });
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setAlert({
          status: error.response.status,
          title: 'Error loading data',
          description: error.response.data.message || 'Unexpected error.',
        });
      } else {
        setAlert({
          status: 500,
          title: 'Server error',
          description: 'Could not load work requests.',
        });
      }
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 4000);
    }
  }, [client?._id, filters]);

  useEffect(() => {
    fetchWorkRequests();
  }, [fetchWorkRequests]);

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

          <RequestsToolbar filters={filters} onChange={handleFilterChange} />
          <RequestList data={requests} loading={loading} onSelect={handleSelectRequest} />
        </div>
      ) : (
        <WorkRequestDetail
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdated={fetchWorkRequests} // refresca la tabla
        />
      )}
    </section>
  );
}
