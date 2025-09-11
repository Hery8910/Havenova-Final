'use client';
import styles from './page.module.css';
import ServiceCart from '../../../../../packages/components/services/serviceCart/ServiceCart';
import FurnitureAssemblyForm from '../../../../../packages/components/services/furnitureAssembly/furnitureAssemblyForm/FurnitureAssemblyForm';
import Reviews from '../../../../../packages/components/common/testimonials/testimonialsPreview/Testimonials';

const FurnitureAssemblyPage = () => {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <FurnitureAssemblyForm />
      </section>
      {/* <ServiceCart /> */}
      <Reviews />
    </main>
  );
};

export default FurnitureAssemblyPage;
