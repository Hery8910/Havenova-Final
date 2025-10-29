'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ServicesRequestList.module.css';
import {
  getRequestItemsFromStorage,
  getRequestsByType,
  removeRequestItemFromStorage,
} from '../../../utils/serviceRequest';
import ServiceRenderer from '../serviceRenderer/ServiceRenderer';
import { useUser } from '../../../contexts/user';
import { ServiceRequestItem } from '../../../types';

const ServicesRequestList = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState<ServiceRequestItem[]>([]);

  // 🔹 Cargar solicitudes desde localStorage
  const loadRequests = useCallback(() => {
    const items = getRequestItemsFromStorage();
    setRequests(items);
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // 🔹 Eliminar solicitud y refrescar el estado
  const handleRemove = useCallback(
    (id: string) => {
      removeRequestItemFromStorage(id);
      loadRequests();
    },
    [loadRequests]
  );

  // 🔹 Agrupar por tipo de servicio
  const types = Array.from(new Set(requests.map((r) => r.serviceType)));

  return (
    <ul className={styles.ul}>
      {types.map((type) => {
        const filtered = getRequestsByType(requests, type);
        return (
          <li className={styles.li} key={type}>
            <ServiceRenderer
              key={type}
              type={type}
              requests={filtered}
              onRemove={handleRemove}
              reloadRequests={loadRequests}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default ServicesRequestList;
