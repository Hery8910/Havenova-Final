'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ServiceCart.module.css';
import {
  getRequestItemsFromStorage,
  getRequestsByType,
  removeRequestItemFromStorage,
} from '../../../utils/serviceRequest';
import ServiceRenderer from '../serviceRenderer/ServiceRenderer';
import { useUser } from '../../../contexts/user';
import { ServiceRequestItem } from '../../../types';
import { ServicesRequestList } from '../servicesRequestList';

const ServiceCart = () => {
  const { user } = useUser();
  // const [requests, setRequests] = useState<ServiceRequestItem[]>([]);

  // // 🔹 Cargar solicitudes desde localStorage
  // const loadRequests = useCallback(() => {
  //   const items = getRequestItemsFromStorage();
  //   setRequests(items);
  // }, []);

  // useEffect(() => {
  //   loadRequests();
  // }, [loadRequests]);

  // // 🔹 Eliminar solicitud y refrescar el estado
  // const handleRemove = useCallback(
  //   (id: string) => {
  //     removeRequestItemFromStorage(id);
  //     loadRequests();
  //   },
  //   [loadRequests]
  // );

  // // 🔹 Agrupar por tipo de servicio
  // const types = Array.from(new Set(requests.map((r) => r.serviceType)));

  if (!user) return null;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h3>Your Service Cart</h3>
        <Image
          className={styles.image}
          src="/svg/shoppingCart.svg"
          alt="Shopping Cart icon"
          width={30}
          height={30}
        />
      </header>
      <ServicesRequestList />
      <section className={styles.checkout}>
        <Link href="/checkout">
          <button className={styles.submit}>Checkout</button>
        </Link>
      </section>
    </main>
  );
};

export default ServiceCart;
