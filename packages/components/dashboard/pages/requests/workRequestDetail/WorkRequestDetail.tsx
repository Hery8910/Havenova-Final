'use client';

import { useState, useMemo } from 'react';
import styles from './WorkRequestDetail.module.css';
import { ServiceList } from '../serviceList';
import { useI18n } from '../../../../../contexts/i18n';

export interface RequestDetailsTexts {
  button: {
    cta: string;
  };
}

interface ServiceItem {
  _id: string;
  status: string;
  serviceType: string;
  price: number;
  estimatedDuration: number;
}

interface WorkRequestDetailData {
  _id: string;
  status: string;
  serviceAddress: string;
  notes?: string;
  user?: {
    name?: string;
  };
  services: ServiceItem[];
}

interface WorkRequestDetailProps {
  request: WorkRequestDetailData;
  onClose: () => void;
  onUpdated: () => void;
}

export default function WorkRequestDetail({ request, onClose, onUpdated }: WorkRequestDetailProps) {
  const [notes, setNotes] = useState(request.notes || '');
  const [saving, setSaving] = useState(false);

  const { texts } = useI18n();
  const requestDetails: RequestDetailsTexts =
    texts?.components?.dashboard?.pages?.requests.requestDetails;

  // 🧮 Calcular totales
  const totalPrice = useMemo(
    () => request.services.reduce((sum, s) => sum + (s.price || 0), 0),
    [request.services]
  );
  const totalDuration = useMemo(
    () => request.services.reduce((sum, s) => sum + (s.estimatedDuration || 0), 0),
    [request.services]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Error saving work request:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={`${styles.section} card`}>
      <header className={styles.header}>
        <h3>Work Request Details</h3>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </header>

      <article className={styles.info}>
        <p>
          <strong>Client:</strong> {request.user?.name || '—'}
        </p>
        <p>
          <strong>Status:</strong> {request.status}
        </p>
        <p>
          <strong>Address:</strong> {request.serviceAddress}
        </p>
        <p>
          <strong>Total Price:</strong> €{totalPrice}
        </p>
        <p>
          <strong>Estimated Hours:</strong> {Math.round(totalDuration / 60)}h
        </p>
      </article>

      <div>
        <label className={styles.notesLabel}>Notes:</label>
        <textarea
          className={styles.textarea}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this request..."
        />
      </div>

      <ServiceList services={request.services} />
      <button type="button" onClick={handleSave} disabled={saving}>
        {requestDetails?.button?.cta ?? 'Save'}
      </button>
    </section>
  );
}
