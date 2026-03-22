import styles from './ServiceDetailsStep.module.css';
import type { HomeServiceKind } from '../homeServiceTypes';

type Props = {
  texts: {
    title: string;
    description: string;
    selectedServiceLabel: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    helper: string;
    services: Record<HomeServiceKind, { title: string; description: string; detailsHint: string }>;
  };
  selectedServiceType: HomeServiceKind;
  details: string;
  error?: string;
  onDetailsChange: (value: string) => void;
  onDetailsBlur: () => void;
};

export default function ServiceDetailsStep({
  texts,
  selectedServiceType,
  details,
  error,
  onDetailsChange,
  onDetailsBlur,
}: Props) {
  const selectedService = texts.services[selectedServiceType];

  return (
    <section className={styles.container} aria-labelledby="home-service-details-title">
      <header className={styles.header}>
        <h3 id="home-service-details-title" className={styles.title}>
          {texts.title}
        </h3>
        <p className={styles.description}>{texts.description}</p>
      </header>

      <article className={styles.serviceCard}>
        <span className={styles.hint}>{texts.selectedServiceLabel}</span>
        <h4 className={styles.serviceTitle}>{selectedService.title}</h4>
        <p className={styles.serviceDescription}>{selectedService.description}</p>
        <p className={styles.hint}>{selectedService.detailsHint}</p>
      </article>

      <label className={styles.field} htmlFor="home-service-details">
        <span className={styles.label}>{texts.detailsLabel}</span>
        <textarea
          id="home-service-details"
          className={styles.textarea}
          value={details}
          placeholder={texts.detailsPlaceholder}
          onChange={(event) => onDetailsChange(event.target.value)}
          onBlur={onDetailsBlur}
          maxLength={1500}
          rows={6}
        />
        <span className={styles.hint}>{texts.helper}</span>
        <span className={styles.error} aria-live="polite">
          {error || ''}
        </span>
      </label>
    </section>
  );
}
