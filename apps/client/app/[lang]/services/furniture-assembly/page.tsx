'use client';
import { useI18n } from '@/packages/contexts';
import styles from './page.module.css';
import { HowItWorks } from '@/packages/components/services/howItWorks';
import { ServiceHeader } from '@/packages/components/services/serviceHeader';
import FurnitureAssemblyForm from '@/packages/components/services/furnitureAssembly/furnitureAssemblyForm/FurnitureAssemblyForm';

const FurnitureAssemblyPage = () => {
  const { texts } = useI18n();
  const header = texts?.components?.services?.furnitureAssembly.header;
  const howItWorks = texts?.pages?.services?.howItWorks;

  return (
    <main className={styles.main}>
      <ServiceHeader
        title={header.title}
        subtitle={header.subtitle}
        description={header.description}
      />
      <section className={styles.section}>
        <HowItWorks title={howItWorks.title} steps={howItWorks.steps} />
        <div className={`${styles.wrapper} card`}>
          <FurnitureAssemblyForm />
        </div>
      </section>
      {/* <ServiceCart /> */}
      {/* <Reviews /> */}
    </main>
  );
};

export default FurnitureAssemblyPage;
