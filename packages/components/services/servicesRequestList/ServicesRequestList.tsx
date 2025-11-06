'use client';

import React from 'react';
import styles from './ServicesRequestList.module.css';
import { useServiceCart } from '../../../contexts/serviceCart/ServiceCartContext';
import { getRequestsByType } from '../../../utils/serviceRequest';
import ServiceRenderer from '../serviceRenderer/ServiceRenderer';

const ServicesRequestList = () => {
  const { items, removeItem, reload } = useServiceCart();

  const types = Array.from(new Set(items.map((r) => r.serviceType)));

  return (
    <ul className={styles.ul}>
      {types.map((type) => {
        const filtered = getRequestsByType(items, type);
        return (
          <li className={styles.li} key={type}>
            <ServiceRenderer
              key={type}
              type={type}
              requests={filtered}
              onRemove={removeItem}
              reloadRequests={reload}
            />
          </li>
        );
      })}
    </ul>
  );
};
export default ServicesRequestList;
