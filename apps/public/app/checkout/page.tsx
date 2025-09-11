import styles from './page.module.css';
import ServiceCart from '../../../../packages/components/services/serviceCart/ServiceCart';

export default function CheckOut() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        {/* <Calendar /> */}
        <ServiceCart />
      </section>
      {/* <Reviews /> */}
      {/* <BlogList blogs={blogs} /> */}
    </main>
  );
}
