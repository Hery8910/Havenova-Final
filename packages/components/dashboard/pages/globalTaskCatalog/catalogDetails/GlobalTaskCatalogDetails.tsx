'use client';

import { CatalogBundleDetail, GlobalTaskCatalogSummary } from '../../../../../types';
import { formatCatalogDate, getCatalogStatusLabel } from '../../../../../utils';
import styles from './GlobalTaskCatalogDetails.module.css';

interface GlobalTaskCatalogDetailsTexts {
  title: string;
  nameLabel: string;
  versionLabel: string;
  activeLabel: string;
  inactiveLabel: string;
  createdLabel: string;
  updatedLabel: string;
  bundleTitle: string;
  bundleEmpty: string;
  bundleDescriptionLabel: string;
  recurrenceKeyLabel: string;
  areaKeyLabel: string;
  scheduleTitle: string;
  scheduleFrequencyLabel: string;
  scheduleIntervalLabel: string;
  scheduleAnchorLabel: string;
  scheduleNoteLabel: string;
  pricingTitle: string;
  pricingCurrencyLabel: string;
  pricingClientLabel: string;
  pricingPartnerLabel: string;
  pricingTaxLabel: string;
  stepsTitle: string;
  stepsEmpty: string;
  stepsRequirementLabel: string;
  stepsBillableLabel: string;
  stepsOrderLabel: string;
  stepsBillableYes: string;
  stepsBillableNo: string;
  stepsLabel: string;
  billablesLabel: string;
  bundleStatusLabel: string;
  bundleLoading: string;
}

interface GlobalTaskCatalogDetailsProps {
  catalog: GlobalTaskCatalogSummary;
  selectedBundle?: CatalogBundleDetail | null;
  bundleLoading?: boolean;
  texts: GlobalTaskCatalogDetailsTexts;
  locale: string;
}

const GlobalTaskCatalogDetails = ({
  catalog,
  selectedBundle,
  bundleLoading = false,
  texts,
  locale,
}: GlobalTaskCatalogDetailsProps) => {
  const catalogStatus = getCatalogStatusLabel(catalog.isActive, {
    active: texts.activeLabel,
    inactive: texts.inactiveLabel,
  });

  return (
    <section className={styles.section}>
      <article className={`${styles.card} card`}>
        <header className={styles.header}>
          <h4>{texts.title}</h4>
          <span
            className={`${styles.badge} ${
              catalog.isActive ? styles.badgeActive : styles.badgeInactive
            }`}
          >
            {catalogStatus}
          </span>
        </header>
        <div className={styles.grid}>
          <div>
            <span className={styles.label}>{texts.nameLabel}</span>
            <span className={styles.value}>{catalog.name}</span>
          </div>
          <div>
            <span className={styles.label}>{texts.versionLabel}</span>
            <span className={styles.value}>v{catalog.version}</span>
          </div>
          <div>
            <span className={styles.label}>{texts.createdLabel}</span>
            <span className={styles.value}>{formatCatalogDate(catalog.createdAt, locale)}</span>
          </div>
          <div>
            <span className={styles.label}>{texts.updatedLabel}</span>
            <span className={styles.value}>{formatCatalogDate(catalog.updatedAt, locale)}</span>
          </div>
        </div>
      </article>

      <article className={`${styles.card} card`}>
        <header className={styles.header}>
          <h4>{texts.bundleTitle}</h4>
          {selectedBundle ? (
            <span
              className={`${styles.badge} ${
                selectedBundle.isActive ? styles.badgeActive : styles.badgeInactive
              }`}
            >
              {getCatalogStatusLabel(selectedBundle.isActive, {
                active: texts.activeLabel,
                inactive: texts.inactiveLabel,
              })}
            </span>
          ) : null}
        </header>
        {bundleLoading ? (
          <p className={styles.empty}>{texts.bundleLoading}</p>
        ) : !selectedBundle ? (
          <p className={styles.empty}>{texts.bundleEmpty}</p>
        ) : (
          <>
            <div className={styles.grid}>
              <div>
                <span className={styles.label}>{texts.nameLabel}</span>
                <span className={styles.value}>{selectedBundle.title}</span>
              </div>
              <div>
                <span className={styles.label}>{texts.bundleStatusLabel}</span>
                <span className={styles.value}>
                  {getCatalogStatusLabel(selectedBundle.isActive, {
                    active: texts.activeLabel,
                    inactive: texts.inactiveLabel,
                  })}
                </span>
              </div>
              <div>
                <span className={styles.label}>{texts.bundleDescriptionLabel}</span>
                <span className={styles.value}>{selectedBundle.description || '-'}</span>
              </div>
              <div>
                <span className={styles.label}>{texts.recurrenceKeyLabel}</span>
                <span className={styles.value}>{selectedBundle.recurrenceKey}</span>
              </div>
              <div>
                <span className={styles.label}>{texts.areaKeyLabel}</span>
                <span className={styles.value}>{selectedBundle.areaKey}</span>
              </div>
              <div>
                <span className={styles.label}>{texts.stepsLabel}</span>
                <span className={styles.value}>{selectedBundle.stepsCount}</span>
              </div>
              <div>
                <span className={styles.label}>{texts.billablesLabel}</span>
                <span className={styles.value}>{selectedBundle.billablesCount}</span>
              </div>
            </div>
            <div className={styles.sectionDivider} />
            <div className={styles.sectionBlock}>
              <h5>{texts.scheduleTitle}</h5>
              <div className={styles.grid}>
                <div>
                  <span className={styles.label}>{texts.scheduleFrequencyLabel}</span>
                  <span className={styles.value}>{selectedBundle.schedule.frequency}</span>
                </div>
                <div>
                  <span className={styles.label}>{texts.scheduleIntervalLabel}</span>
                  <span className={styles.value}>{selectedBundle.schedule.intervalWeeks}</span>
                </div>
                <div>
                  <span className={styles.label}>{texts.scheduleAnchorLabel}</span>
                  <span className={styles.value}>{selectedBundle.schedule.anchorIsoWeek}</span>
                </div>
                <div>
                  <span className={styles.label}>{texts.scheduleNoteLabel}</span>
                  <span className={styles.value}>{selectedBundle.schedule.note || '-'}</span>
                </div>
              </div>
            </div>
            <div className={styles.sectionDivider} />
            <div className={styles.sectionBlock}>
              <h5>{texts.pricingTitle}</h5>
              <div className={styles.grid}>
                <div>
                  <span className={styles.label}>{texts.pricingCurrencyLabel}</span>
                  <span className={styles.value}>{selectedBundle.bundlePricing.currency}</span>
                </div>
                <div>
                  <span className={styles.label}>{texts.pricingClientLabel}</span>
                  <span className={styles.value}>{selectedBundle.bundlePricing.clientGross}</span>
                </div>
                <div>
                  <span className={styles.label}>{texts.pricingPartnerLabel}</span>
                  <span className={styles.value}>{selectedBundle.bundlePricing.partnerGross}</span>
                </div>
                <div>
                  <span className={styles.label}>{texts.pricingTaxLabel}</span>
                  <span className={styles.value}>
                    {selectedBundle.bundlePricing.taxRatePct}%
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.sectionDivider} />
            <div className={styles.sectionBlock}>
              <h5>{texts.stepsTitle}</h5>
              {selectedBundle.steps.length === 0 ? (
                <p className={styles.empty}>{texts.stepsEmpty}</p>
              ) : (
                <ul className={styles.stepsList}>
                  {selectedBundle.steps.map((step) => (
                    <li key={step._id} className={`${styles.stepCard} card`}>
                      <header className={styles.stepHeader}>
                        <h6>{step.title}</h6>
                        <span
                          className={`${styles.stepBadge} ${
                            step.isActive ? styles.stepBadgeActive : styles.stepBadgeInactive
                          }`}
                        >
                          {getCatalogStatusLabel(step.isActive, {
                            active: texts.activeLabel,
                            inactive: texts.inactiveLabel,
                          })}
                        </span>
                      </header>
                      {step.description ? (
                        <p className={styles.stepDescription}>{step.description}</p>
                      ) : null}
                      <div className={styles.stepMeta}>
                        <span>
                          <strong>{texts.stepsRequirementLabel}:</strong> {step.requirement}
                        </span>
                        <span>
                          <strong>{texts.stepsBillableLabel}:</strong>{' '}
                          {step.billable ? texts.stepsBillableYes : texts.stepsBillableNo}
                        </span>
                        <span>
                          <strong>{texts.stepsOrderLabel}:</strong> {step.sortOrder + 1}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </article>
    </section>
  );
};

export default GlobalTaskCatalogDetails;
