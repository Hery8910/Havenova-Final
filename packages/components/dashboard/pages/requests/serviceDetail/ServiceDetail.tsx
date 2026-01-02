'use client';

import { useEffect, useState } from 'react';
import styles from './ServiceDetail.module.css';
import { IoClose } from 'react-icons/io5';
import { getServiceById, updateService } from '../../../../../services';

interface ServiceDetailProps {
  id: string;
  onClose: () => void;
}

export default function ServiceDetail({ id, onClose }: ServiceDetailProps) {
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getServiceById(id);
        setService(data);
      } catch (err) {
        console.error('Error loading service:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!service) return;
    setSaving(true);
    try {
      await updateService(id, {
        price: service.price,
        estimatedDuration: service.estimatedDuration,
        status: service.status,
      });
      onClose();
    } catch (err) {
      console.error('Error saving service:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading service...</p>;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h3>Edit Service</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <IoClose />
          </button>
        </header>

        <div className={styles.body}>
          <p>
            <strong>Type:</strong> {service.serviceType}
          </p>
          <label>Price (€):</label>
          <input
            type="number"
            value={service.price}
            onChange={(e) => setService({ ...service, price: Number(e.target.value) })}
          />

          <label>Estimated Duration (minutes):</label>
          <input
            type="number"
            value={service.estimatedDuration}
            onChange={(e) => setService({ ...service, estimatedDuration: Number(e.target.value) })}
          />

          <label>Status:</label>
          <select
            value={service.status}
            onChange={(e) => setService({ ...service, status: e.target.value })}
          >
            <option value="submitted">Submitted</option>
            <option value="accepted">Accepted</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
