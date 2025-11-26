'use client';
import styles from './CheckoutCart.module.css';
import { useServiceCart } from '../../../contexts/serviceCart/ServiceCartContext';
import { ServicesRequestList } from '../servicesRequestList';
import { useI18n } from '../../../contexts/i18n/I18nContext';

const CheckoutCart = () => {
  const { items } = useServiceCart();
  const { texts } = useI18n();
  const cart = texts.components.services.cart;

  return (
    <section className={styles.section}>
      <div className={`${styles.modal} card`}>
        <header className={styles.header}>
          <h4 className={styles.h4}>{cart.title}</h4>
        </header>

        <ServicesRequestList />

        <footer className={styles.footer}></footer>
      </div>
    </section>
  );
};

export default CheckoutCart;
