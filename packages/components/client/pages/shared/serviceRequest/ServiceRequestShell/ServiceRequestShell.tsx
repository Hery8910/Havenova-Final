import type { FormEventHandler, ReactNode } from 'react';
import styles from './ServiceRequestShell.module.css';

interface ServiceRequestShellProps {
  sectionTitleId: string;
  stepTitleId: string;
  validationMessageId: string;
  processHeader: ReactNode;
  currentStepHeading: string;
  currentStepValue: number;
  totalSteps: number;
  validationMessage?: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  backAction?: {
    label: string;
    onClick: () => void;
  };
  primaryAction: {
    label: string;
    type: 'button' | 'submit';
    onClick?: () => void;
    disabled?: boolean;
    ariaDisabled?: boolean;
    className?: string;
  };
}

export default function ServiceRequestShell({
  sectionTitleId,
  stepTitleId,
  validationMessageId,
  processHeader,
  currentStepHeading,
  currentStepValue,
  totalSteps,
  validationMessage,
  onSubmit,
  children,
  backAction,
  primaryAction,
}: ServiceRequestShellProps) {
  return (
    <section className={styles.section} aria-labelledby={sectionTitleId}>
      {processHeader}

      <form
        className={`${styles.form} card card--primary`}
        onSubmit={onSubmit}
        noValidate
        aria-labelledby={stepTitleId}
        aria-describedby={validationMessage ? validationMessageId : undefined}
      >
        <header className={styles.stepHeader}>
          <h3 className={`${styles.stepTitle} type-title-sm`} id={stepTitleId}>
            {currentStepHeading}
          </h3>
          <span className={`${styles.stepNumber} card card--neutral type-body-sm`}>
            {`${currentStepValue}/${totalSteps}`}
          </span>
        </header>

        <div className={styles.wrapper}>
          <article className={styles.stepContent}>{children}</article>

          <aside
            className={styles.stepValidationSlot}
            aria-live="polite"
            role={validationMessage ? 'alert' : undefined}
          >
            {validationMessage ? (
              <p className={styles.stepValidationMessage} id={validationMessageId}>
                {validationMessage}
              </p>
            ) : null}
          </aside>
        </div>

        <footer className={styles.actions}>
          {backAction ? (
            <button
              type="button"
              className="button button--outline"
              onClick={backAction.onClick}
            >
              {backAction.label}
            </button>
          ) : (
            <span className={styles.actionsSpacer} aria-hidden="true" />
          )}

          <button
            className={`button button--primary ${primaryAction.className ?? ''}`.trim()}
            type={primaryAction.type}
            aria-disabled={primaryAction.ariaDisabled}
            disabled={primaryAction.disabled}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </button>
        </footer>
      </form>
    </section>
  );
}
