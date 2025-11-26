'use client';

import React, { useState } from 'react';
import styles from './ServiceCart.module.css';
import { useServiceCart } from '../../../contexts/serviceCart/ServiceCartContext';
import { ServicesRequestList } from '../servicesRequestList';
import { useI18n } from '../../../contexts/i18n/I18nContext';
import { RiShoppingCartLine } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';
import { useRouter, usePathname } from 'next/navigation';
import { useLang } from '../../../hooks/useLang';
import { href } from '../../../utils/navigation';

const ServiceCart = () => {
  const { items, totalCount } = useServiceCart();
  const { texts } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const lang = useLang();
  const cart = texts.components.services.cart;
  const [open, setOpen] = useState(false);

  // 🔹 Detectar idioma (primer segmento de la ruta)
  // ej: "/de/checkout" → "checkout"
  const pathWithoutLang = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');

  // 🔹 Rutas que deben ocultar el carrito
  const EXCLUDED_PATTERNS = ['/checkout', '/user', '/legal'];
  const shouldHide = EXCLUDED_PATTERNS.some((pattern) => pathWithoutLang.startsWith(pattern));

  if (shouldHide) return null;

  // 🔹 Si no hay servicios
  if (!items.length) {
    return (
      <button className={styles.cartButton} onClick={() => setOpen(true)} aria-label={cart.empty}>
        <RiShoppingCartLine />
        <span className={styles.badge}>{totalCount}</span>
      </button>
    );
  }

  // 🔹 Estado cerrado → solo el botón flotante
  if (!open) {
    return (
      <button className={styles.cartButton} onClick={() => setOpen(true)} aria-label={cart.open}>
        <RiShoppingCartLine />
        <span className={styles.badge}>{totalCount}</span>
      </button>
    );
  }

  // 🔹 Estado abierto → modal fullscreen
  return (
    <section className={`${styles.overlay} card`}>
      <div className={`${styles.modal} card`}>
        <header className={styles.header}>
          <button className={styles.close} onClick={() => setOpen(false)} aria-label={cart.close}>
            <IoClose />
          </button>
          <h4 className={styles.h4}>{cart.title}</h4>
        </header>

        <ServicesRequestList />

        <footer className={styles.footer}>
          <button
            onClick={() => {
              router.push(href(lang, '/checkout'));
              setOpen(false);
            }}
            className={styles.checkoutBtn}
          >
            {cart.checkout}
          </button>
        </footer>
      </div>
    </section>
  );
};

export default ServiceCart;
