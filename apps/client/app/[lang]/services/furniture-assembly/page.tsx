'use client';
import { useI18n } from '@/packages/contexts';
import styles from './page.module.css';
import { HowItWorks } from '@/packages/components/services/howItWorks';
import { ServiceHeader } from '@/packages/components/services/serviceHeader';
import FurnitureAssemblyForm from '@/packages/components/services/furnitureAssembly/furnitureAssemblyForm/FurnitureAssemblyForm';

const FurnitureAssemblyPage = () => {
  const { texts } = useI18n();
  const header = texts?.components?.services?.furnitureAssembly.header;
  const howItWorks = texts?.components?.services?.howItWorks;

  return (
    <main className={styles.main}>
      <ServiceHeader
        title={header.title}
        subtitle={header.subtitle}
        description={header.description}
      />
      <HowItWorks title={howItWorks.title} steps={howItWorks.steps} />

      <section className={styles.section}>
        <FurnitureAssemblyForm />
      </section>
      {/* <ServiceCart /> */}
      {/* <Reviews /> */}
    </main>
  );
};

export default FurnitureAssemblyPage;
