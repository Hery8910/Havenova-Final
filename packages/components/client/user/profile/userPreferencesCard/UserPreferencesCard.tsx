'use client';

import { useState } from 'react';

import styles from './UserPreferencesCard.module.css';
import { useI18n, useProfile } from '../../../../../contexts';
import LanguageSwitcher from '../../../../languageSwitcher/LanguageSwitcher';
import ThemeToggler from '../../../../themeToggler/ThemeToggler';

interface PreferencesTexts {
  eyebrow?: string;
  sections?: {
    language?: {
      title?: string;
      subtitle?: string;
      lang?: string;
      buttonLabel?: string;
      switchToEnglish?: string;
      switchToGerman?: string;
      englishVisible?: string;
      germanVisible?: string;
    };
    theme?: {
      title?: string;
      buttonLabel?: string;
      lightMode?: string;
      darkMode?: string;
      light?: string;
      dark?: string;
    };
    notifications?: {
      title?: string;
      inApp?: {
        title?: string;
        description?: string;
        ariaLabel?: string;
      };
      important?: {
        title?: string;
        description?: string;
        ariaLabel?: string;
      };
      reminders?: {
        title?: string;
        description?: string;
        ariaLabel?: string;
        error?: string;
      };
    };
  };
}

export function UserPreferencesCard() {
  const { texts } = useI18n();
  const { profile, updateProfile } = useProfile();
  const preferenceTexts: PreferencesTexts = texts?.pages?.client?.user?.profile?.preferences;
  const [remindersSaving, setRemindersSaving] = useState(false);
  const [remindersError, setRemindersError] = useState('');

  const remindersEnabled = profile.notificationPreferences.email.reminders.enabled;

  const handleRemindersToggle = async () => {
    const nextEnabled = !remindersEnabled;

    try {
      setRemindersSaving(true);
      setRemindersError('');

      await updateProfile({
        notificationPreferences: {
          email: {
            reminders: {
              enabled: nextEnabled,
            },
          },
        },
      });
    } catch {
      setRemindersError(
        preferenceTexts?.sections?.notifications?.reminders?.error ??
          'We could not update your reminder notifications.'
      );
    } finally {
      setRemindersSaving(false);
    }
  };

  const notificationTexts = preferenceTexts?.sections?.notifications;

  return (
    <section className={styles.card} aria-labelledby="user-preferences-title">
      <h3 id="user-preferences-title" className={styles.title}>
        {preferenceTexts?.eyebrow ?? 'Preferences'}
      </h3>
      <section className={styles.wrapper}>
        <aside className={styles.aside} aria-labelledby="user-preferences-language-title">
          <div className={styles.labelWrapper}>
            <h3 id="user-preferences-language-title" className={styles.srOnly}>
              {preferenceTexts?.sections?.language?.title ?? 'Language'}
            </h3>
            <p className={`${styles.langLabel} type-title-sm`}>
              {preferenceTexts?.sections?.language?.title ?? 'Language'}
            </p>
            <p className={`${styles.langLabel} type-title-sm`}>
              {preferenceTexts?.sections?.language?.lang ?? 'Language'}
            </p>
          </div>
          <div className={styles.switchWrapper}>
            <p className={styles.switchLabel}>
              {preferenceTexts?.sections?.language?.subtitle ?? 'Switch language'}
            </p>
            <LanguageSwitcher />
          </div>
        </aside>

        <aside className={styles.aside} aria-labelledby="user-preferences-theme-title">
          <div className={styles.labelWrapper}>
            <h3 id="user-preferences-theme-title" className={styles.srOnly}>
              {preferenceTexts?.sections?.theme?.title ?? 'Theme'}
            </h3>
            <p className={`${styles.langLabel} type-title-sm`}>
              {preferenceTexts?.sections?.theme?.title ?? 'Theme'}
            </p>
            <p className={`${styles.langLabel} type-title-sm`}>
              {preferenceTexts?.sections?.theme?.[profile.theme] ?? 'Theme'}
            </p>
          </div>
          <div className={styles.switchWrapper}>
            <p className={styles.switchLabel}>
              {preferenceTexts?.sections?.theme?.buttonLabel ?? 'Switch mode'}
            </p>
            <ThemeToggler
              ariaLabel={preferenceTexts?.sections?.theme?.buttonLabel}
              darkLabel={preferenceTexts?.sections?.theme?.darkMode}
              lightLabel={preferenceTexts?.sections?.theme?.lightMode}
            />
          </div>
        </aside>
      </section>
      <section
        className={styles.notificationsSection}
        aria-labelledby="user-preferences-notifications-title"
      >
        <h3 id="user-preferences-notifications-title" className={styles.srOnly}>
          {notificationTexts?.title ?? 'Notifications'}
        </h3>

        <article className={styles.notificationRow}>
          <div className={styles.notificationCopy}>
            <div className={styles.notificationTitleRow}>
              <p
                className={styles.notificationTitle}
                id="user-preferences-notification-in-app-label"
              >
                {notificationTexts?.inApp?.title ?? 'In-app notifications'}
              </p>
            </div>
            <p className={styles.notificationDescription}>
              {notificationTexts?.inApp?.description ??
                'These notifications are always enabled inside the app.'}
            </p>
          </div>
          <label className={`${styles.checkboxLabel} ${styles.checkboxLabelDisabled}`}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked
              readOnly
              disabled
              aria-label={
                notificationTexts?.inApp?.ariaLabel ?? 'In-app notifications enabled and required'
              }
              aria-describedby="user-preferences-notification-in-app-label"
            />
            <span
              className={`${styles.customCheckbox} ${styles.customCheckboxMuted}`}
              aria-hidden="true"
            />
          </label>
        </article>

        <article className={styles.notificationRow}>
          <div className={styles.notificationCopy}>
            <div className={styles.notificationTitleRow}>
              <p
                className={styles.notificationTitle}
                id="user-preferences-notification-important-label"
              >
                {notificationTexts?.important?.title ?? 'Important email notifications'}
              </p>
            </div>
            <p className={styles.notificationDescription}>
              {notificationTexts?.important?.description ??
                'Important account emails stay enabled for security and service updates.'}
            </p>
          </div>
          <label className={`${styles.checkboxLabel} ${styles.checkboxLabelDisabled}`}>
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked
              readOnly
              disabled
              aria-label={
                notificationTexts?.important?.ariaLabel ??
                'Important email notifications enabled and required'
              }
              aria-describedby="user-preferences-notification-important-label"
            />
            <span
              className={`${styles.customCheckbox} ${styles.customCheckboxMuted}`}
              aria-hidden="true"
            />
          </label>
        </article>

        <article className={styles.notificationRow}>
          <div className={styles.notificationCopy}>
            <div className={styles.notificationTitleRow}>
              <p
                className={styles.notificationTitle}
                id="user-preferences-notification-reminders-label"
              >
                {notificationTexts?.reminders?.title ?? 'Reminder emails'}
              </p>
            </div>
            <p className={styles.notificationDescription}>
              {notificationTexts?.reminders?.description ??
                'Turn reminder emails on if you want to receive reminders for your bookings.'}
            </p>
          </div>
          <label className={styles.checkboxLabel} htmlFor="user-preferences-reminders">
            <input
              type="checkbox"
              id="user-preferences-reminders"
              className={styles.checkboxInput}
              checked={remindersEnabled}
              onChange={handleRemindersToggle}
              aria-label={
                notificationTexts?.reminders?.ariaLabel ?? 'Toggle reminder email notifications'
              }
              aria-describedby="user-preferences-notification-reminders-label user-preferences-reminders-status"
              aria-busy={remindersSaving}
              disabled={remindersSaving}
            />
            <span className={styles.customCheckbox} aria-hidden="true" />
          </label>
        </article>

        <p
          id="user-preferences-reminders-status"
          className={`${styles.status} ${remindersError ? styles.error : ''}`}
          role={remindersError ? 'alert' : 'status'}
          aria-live="polite"
        >
          {remindersError || '\u00A0'}
        </p>
      </section>
    </section>
  );
}
