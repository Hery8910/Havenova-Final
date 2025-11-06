'use client';

import styles from './ServiceList.module.css';
import { WorkRequestDetailData } from '@/packages/services/workRequest';
import { useState } from 'react';
import { ServiceDetail } from '../serviceDetail';

interface ServiceListProps {
  services: WorkRequestDetailData['services'];
}

export default function ServiceList({ services }: ServiceListProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <section className={styles.section}>
      <h4>Services Included</h4>
      <ul className={styles.list}>
        {services.map((s) => (
          <li
            key={s._id}
            className={`${styles.item} ${styles[s.status.replace(' ', '-') || 'default']}`}
            onClick={() => setSelectedService(s._id)}
          >
            <div className={styles.info}>
              <strong>{s.serviceType}</strong>
              <span>{s.status}</span>
            </div>
            <p>
              €{s.price} — {Math.round(s.estimatedDuration / 60)}h
            </p>
          </li>
        ))}
      </ul>

      {selectedService && (
        <ServiceDetail id={selectedService} onClose={() => setSelectedService(null)} />
      )}
    </section>
  );
}
