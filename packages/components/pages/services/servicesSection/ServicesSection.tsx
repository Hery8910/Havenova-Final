import styles from './ServicesSection.module.css';
import Image from 'next/image';
import ServiceList, { ServiceListItem } from '../../../services/servicesList/ServicesList';
import Button, { ButtonProps } from '@/packages/components/common/button/Button';

export interface ServicesSectionProps {
  services: boolean;
  heading: string;
  description: string;
  button: ButtonProps;
  items: ServiceListItem[];
  exclude?: string; // servicio actual a excluir
  theme: string; // dark o light
  handleItemClick: (service: string) => void; // click en card
  handleCTAClick: () => void; // click en CTA final
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  services = false,
  heading,
  description,
  button,
  items,
  exclude = '',
  theme,
  handleItemClick,
  handleCTAClick,
}) => {
  const bgSrc =
    theme === 'dark'
      ? '/svg/background/service-background-light.svg'
      : '/svg/background/service-background-dark.svg';

  return (
    <section className={styles.section}>
      <Image
        src={bgSrc}
        alt=""
        fill
        sizes="100vw"
        loading="lazy"
        fetchPriority="auto"
        className={styles.backgroundImage}
      />

      <header className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.description}>{description}</p>
      </header>

      <ServiceList items={items} onClick={handleItemClick} exclude={exclude} />

      {!services && (
        <div className={styles.ctaWrapper}>
          <Button
            cta={button.cta}
            variant={button.variant}
            icon={button.icon}
            onClick={handleCTAClick}
          />
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
