'use client';

import { useState, useMemo } from 'react';
import styles from './WorkRequestDetail.module.css';
import { updateWorkRequest, WorkRequestDetailData } from '@/packages/services/workRequest';
import { ServiceList } from '../serviceList';
import { Button } from '../../../../client';
import { useI18n } from '../../../../../contexts/i18n';
import { ButtonProps } from '../../../../client/button/Button';

export interface RequestDetailsTexts {
  button: ButtonProps;
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
      await updateWorkRequest(request._id, {
        notes,
        totalPrice,
        totalEstimatedDuration: totalDuration,
      });
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
        <Button variant="outline" cta="" icon="close" onClick={onClose} />
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
      <Button
        cta={requestDetails.button.cta}
        variant={requestDetails.button.variant}
        icon={requestDetails.button.icon}
        onClick={handleSave}
      />
    </section>
  );
}
