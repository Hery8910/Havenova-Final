'use client';

import { CatalogBundleDetail, GlobalTaskCatalogSummary } from '../../../../../types';
import { getCatalogStatusLabel } from '../../../../../utils';
import styles from './GlobalTaskCatalogDetails.module.css';
import { StatusBadge } from '../../../statusBadge';
import { RecurrenceBadge } from '../../../recurrenceBadge';
import { AreaBadge } from '../../../areaBadge';

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
  recurrenceKeys: Record<string, string>;
  areaKeys: Record<string, string>;
}

interface GlobalTaskCatalogDetailsProps {
  catalog: GlobalTaskCatalogSummary;
  selectedBundle?: CatalogBundleDetail | null;
  texts: GlobalTaskCatalogDetailsTexts;
}

const GlobalTaskCatalogDetails = ({
  catalog,
  selectedBundle,
  texts,
}: GlobalTaskCatalogDetailsProps) => {
  const recurrenceLabel = selectedBundle
    ? texts.recurrenceKeys?.[selectedBundle.recurrenceKey] ?? selectedBundle.recurrenceKey
    : '';
  const areaLabel = selectedBundle
    ? texts.areaKeys?.[selectedBundle.areaKey] ?? selectedBundle.areaKey
    : '';
  const expectedProfit = selectedBundle
    ? selectedBundle.bundlePricing.clientGross - selectedBundle.bundlePricing.partnerGross
    : 0;

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h4>{texts.bundleTitle}</h4>
      </header>
      {!selectedBundle ? (
        <p className={styles.empty}>{texts.bundleEmpty}</p>
      ) : (
        <section className={styles.details}>
          <article className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              {selectedBundle ? (
                <div className={styles.badgeGroup}>
                  <StatusBadge
                    label={getCatalogStatusLabel(selectedBundle.isActive, {
                      active: texts.activeLabel,
                      inactive: texts.inactiveLabel,
                    })}
                    isActive={selectedBundle.isActive}
                  />
                  <RecurrenceBadge value={selectedBundle.recurrenceKey} label={recurrenceLabel} />
                  <AreaBadge value={selectedBundle.areaKey} label={areaLabel} />
                </div>
              ) : null}
              <h5>{selectedBundle.title}</h5>
            </div>
            {selectedBundle.description && (
              <div>
                <span className={styles.value}>{selectedBundle.description}</span>
              </div>
            )}
          </article>
          <article className={styles.sectionBlock}>
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
              <span className={styles.value}>{expectedProfit}</span>
            </div>
          </article>
          <article className={styles.stepsSection}>
            {selectedBundle.steps.length === 0 ? (
              <p className={styles.empty}>{texts.stepsEmpty}</p>
            ) : (
              <ul className={styles.stepsList}>
                {selectedBundle.steps.map((step) => (
                  <li key={step._id} className={`${styles.stepCard} card`}>
                    <header className={styles.stepHeader}>
                      <h6>{step.title}</h6>
                      <StatusBadge
                        label={getCatalogStatusLabel(step.isActive, {
                          active: texts.activeLabel,
                          inactive: texts.inactiveLabel,
                        })}
                        isActive={step.isActive}
                      />
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
          </article>
        </section>
      )}
    </section>
  );
};

export default GlobalTaskCatalogDetails;
