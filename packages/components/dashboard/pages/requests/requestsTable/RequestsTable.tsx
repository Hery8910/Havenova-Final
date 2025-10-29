// components/RequestsTable.tsx
import styles from './RequestsTable.module.css';

interface RequestsTableProps {
  data: any[];
  loading: boolean;
}

export default function RequestsTable({ data, loading }: RequestsTableProps) {
  if (loading) return <p>Loading requests...</p>;
  if (!data.length) return <p>No requests found</p>;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Client</th>
          <th>Service</th>
          <th>Date</th>
          <th>Status</th>
          <th>Worker</th>
        </tr>
      </thead>
      <tbody>
        {data.map((req) => (
          <tr key={req._id}>
            <td>{req.user?.name || '—'}</td>
            <td>{req.services?.map((s: any) => s.type).join(', ')}</td>
            <td>{new Date(req.preferredDate).toLocaleDateString()}</td>
            <td>{req.status}</td>
            <td>{req.assignedWorker?.name || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
