import styles from './ServiceDetailsStep.module.css';
import type { HomeServiceKind } from '../homeServiceTypes';
import { useId } from 'react';
import { RequestField, RequestStepIntro } from '../../../shared';

type Props = {
  showHeader?: boolean;
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
  showHeader = true,
  texts,
  selectedServiceType,
  details,
  error,
  onDetailsChange,
  onDetailsBlur,
}: Props) {
  const selectedService = texts.services[selectedServiceType];
  const helperId = useId();
  const errorId = useId();

  return (
    <section className={styles.container} aria-labelledby="home-service-details-title">
      {showHeader ? (
        <RequestStepIntro
          title={texts.title}
          titleId="home-service-details-title"
          description={texts.description}
        />
      ) : null}

      <article className={styles.serviceCard}>
        <span className={styles.hint}>{texts.selectedServiceLabel}</span>
        <h4 className={styles.serviceTitle}>{selectedService.title}</h4>
        <p className={styles.serviceDescription}>{selectedService.description}</p>
        <p className={styles.hint}>{selectedService.detailsHint}</p>
      </article>

      <RequestField
        htmlFor="home-service-details"
        label={texts.detailsLabel}
        helperText={texts.helper}
        helperId={helperId}
        errorText={error}
        errorId={errorId}
        fieldClassName={styles.field}
        labelClassName={styles.label}
        helperClassName={styles.hint}
        errorClassName={styles.error}
      >
        <textarea
          id="home-service-details"
          className={styles.textarea}
          value={details}
          placeholder={texts.detailsPlaceholder}
          onChange={(event) => onDetailsChange(event.target.value)}
          onBlur={onDetailsBlur}
          maxLength={1500}
          rows={6}
          aria-invalid={Boolean(error)}
          aria-describedby={`${helperId} ${errorId}`}
        />
      </RequestField>
    </section>
  );
}
