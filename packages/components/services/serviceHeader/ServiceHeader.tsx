import styles from './ServiceHeader.module.css';

interface ServiceHeaderTextProps {
  title: string;
  subtitle: string;
  description: string;
}

const ServiceHeader: React.FC<ServiceHeaderTextProps> = ({ title, subtitle, description }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <h2 className={styles.subtitle}>{subtitle}</h2>
      <p className={styles.description}>{description}</p>
    </header>
  );
};

export default ServiceHeader;
