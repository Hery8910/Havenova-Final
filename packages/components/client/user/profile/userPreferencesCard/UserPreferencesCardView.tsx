'use client';

import { useId } from 'react';
import styles from './UserPreferencesCard.module.css';
import type { UserPreferencesCardViewProps } from './userPreferencesCard.types';

export function UserPreferencesCardView({
  title,
  languageTitle,
  themeTitle,
  cookiesTitle,
  cookiesButtonLabel,
  notificationsTitle,
  notificationsDescription,
  inAppTitle,
  inAppDescription,
  inAppAriaLabel,
  inAppStatus,
  importantTitle,
  importantDescription,
  importantAriaLabel,
  importantStatus,
  remindersTitle,
  remindersDescription,
  remindersAriaLabel,
  remindersEnabled,
  remindersSaving,
  remindersStatusText,
  remindersError,
  languageControl,
  themeControl,
  onOpenCookies,
  onRemindersToggle,
}: UserPreferencesCardViewProps) {
  const notificationsTitleId = useId();
  const notificationsDescriptionId = useId();
  const inAppTitleId = useId();
  const inAppDescriptionId = useId();
  const importantTitleId = useId();
  const importantDescriptionId = useId();
  const remindersTitleId = useId();
  const remindersDescriptionId = useId();
  const remindersStatusId = useId();

  return (
    <section className={styles.card} aria-labelledby="user-preferences-title">
      <h3 id="user-preferences-title" className={styles.title}>
        {title}
      </h3>
      <section className={styles.wrapper}>
        <aside className={styles.aside} aria-labelledby="user-preferences-language-title">
          <div className={styles.labelWrapper}>
            <h3 id="user-preferences-language-title" className={styles.srOnly}>
              {languageTitle}
            </h3>
            <p className={`${styles.langLabel} type-title-sm`}>{languageTitle}</p>
          </div>
          <div className={styles.switchWrapper}>{languageControl}</div>
        </aside>

        <aside className={styles.aside} aria-labelledby="user-preferences-theme-title">
          <div className={styles.labelWrapper}>
            <h3 id="user-preferences-theme-title" className={styles.srOnly}>
              {themeTitle}
            </h3>
            <p className={`${styles.langLabel} type-title-sm`}>{themeTitle}</p>
          </div>
          <div className={styles.switchWrapper}>{themeControl}</div>
        </aside>

        <aside className={styles.aside} aria-labelledby="user-preferences-cookies-title">
          <div className={styles.labelWrapper}>
            <h3 id="user-preferences-cookies-title" className={styles.srOnly}>
              {cookiesTitle}
            </h3>
            <p className={`${styles.langLabel} type-title-sm`}>{cookiesTitle}</p>
          </div>
          <div className={styles.switchWrapper}>
            <button type="button" className="button button--outline" onClick={onOpenCookies}>
              {cookiesButtonLabel}
            </button>
          </div>
        </aside>
      </section>
      <section
        className={styles.notificationsSection}
        aria-labelledby={notificationsTitleId}
        aria-describedby={notificationsDescriptionId}
      >
        <fieldset className={styles.notificationsFieldset}>
          <legend id={notificationsTitleId} className={styles.notificationsLegend}>
            {notificationsTitle}
          </legend>
          <p id={notificationsDescriptionId} className={styles.notificationsDescription}>
            {notificationsDescription}
          </p>

          <article className={styles.notificationRow}>
            <div className={styles.notificationCopy}>
              <p className={styles.notificationTitle} id={inAppTitleId}>
                {inAppTitle}
              </p>
              <p className={styles.notificationDescription} id={inAppDescriptionId}>
                {inAppDescription}
              </p>
            </div>
            <label className={`${styles.checkboxLabel} ${styles.checkboxLabelDisabled}`}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked
                readOnly
                disabled
                aria-label={inAppAriaLabel}
                aria-describedby={`${inAppTitleId} ${inAppDescriptionId}`}
              />
              <span
                className={`${styles.customCheckbox} ${styles.customCheckboxMuted}`}
                aria-hidden="true"
              />
              <span className={styles.srOnly}>{inAppStatus}</span>
            </label>
          </article>

          <article className={styles.notificationRow}>
            <div className={styles.notificationCopy}>
              <p className={styles.notificationTitle} id={importantTitleId}>
                {importantTitle}
              </p>
              <p className={styles.notificationDescription} id={importantDescriptionId}>
                {importantDescription}
              </p>
            </div>
            <label className={`${styles.checkboxLabel} ${styles.checkboxLabelDisabled}`}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked
                readOnly
                disabled
                aria-label={importantAriaLabel}
                aria-describedby={`${importantTitleId} ${importantDescriptionId}`}
              />
              <span
                className={`${styles.customCheckbox} ${styles.customCheckboxMuted}`}
                aria-hidden="true"
              />
              <span className={styles.srOnly}>{importantStatus}</span>
            </label>
          </article>

          <article className={styles.notificationRow}>
            <div className={styles.notificationCopy}>
              <label
                className={styles.notificationTitle}
                htmlFor="user-preferences-reminders"
                id={remindersTitleId}
              >
                {remindersTitle}
              </label>
              <p className={styles.notificationDescription} id={remindersDescriptionId}>
                {remindersDescription}
              </p>
            </div>
            <label className={styles.checkboxLabel} htmlFor="user-preferences-reminders">
              <input
                type="checkbox"
                id="user-preferences-reminders"
                className={styles.checkboxInput}
                checked={remindersEnabled}
                onChange={onRemindersToggle}
                aria-label={remindersAriaLabel}
                aria-describedby={`${remindersTitleId} ${remindersDescriptionId} ${remindersStatusId}`}
                aria-busy={remindersSaving}
                disabled={remindersSaving}
              />
              <span className={styles.customCheckbox} aria-hidden="true" />
            </label>
          </article>

          <p
            id={remindersStatusId}
            className={`${styles.srOnly} ${remindersError ? styles.error : ''}`}
            role={remindersError ? 'alert' : 'status'}
            aria-live="polite"
          >
            {remindersStatusText}
          </p>
        </fieldset>
      </section>
    </section>
  );
}
