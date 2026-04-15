'use client';

import { useState } from 'react';

import styles from './UserPreferencesCard.module.css';
import { useI18n, useProfile } from '../../../contexts';
import LanguageSwitcher from '../../languageSwitcher/LanguageSwitcher';
import ThemeToggler from '../../themeToggler/ThemeToggler';

interface PreferencesTexts {
  eyebrow?: string;
  title?: string;
  description?: string;
  sections?: {
    language?: {
      title?: string;
      description?: string;
      buttonLabel?: string;
      switchToEnglish?: string;
      switchToGerman?: string;
      englishVisible?: string;
      germanVisible?: string;
    };
    theme?: {
      title?: string;
      description?: string;
      buttonLabel?: string;
      lightMode?: string;
      darkMode?: string;
    };
    notifications?: {
      title?: string;
      description?: string;
      requiredBadge?: string;
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
        enabled?: string;
        disabled?: string;
        saving?: string;
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
    <section className={`${styles.card} card--glass`} aria-labelledby="user-preferences-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>{preferenceTexts?.eyebrow ?? 'Preferences'}</p>
        <h2 id="user-preferences-title" className={styles.title}>
          {preferenceTexts?.title ?? 'Your preferences'}
        </h2>
        <p className={styles.description}>
          {preferenceTexts?.description ??
            'Adjust the language, theme and notification preferences for your account.'}
        </p>
      </header>

      <section className={styles.section} aria-labelledby="user-preferences-language-title">
        <div className={styles.sectionHeader}>
          <h3 id="user-preferences-language-title" className={styles.sectionTitle}>
            {preferenceTexts?.sections?.language?.title ?? 'Language'}
          </h3>
          <p className={styles.sectionDescription}>
            {preferenceTexts?.sections?.language?.description ??
              'Choose the language used across your account.'}
          </p>
        </div>

        <div className={styles.controlRow}>
          <div className={styles.controlCopy}>
            <p className={styles.controlLabel}>
              {preferenceTexts?.sections?.language?.title ?? 'Language'}
            </p>
          </div>
          <LanguageSwitcher
            ariaLabel={preferenceTexts?.sections?.language?.buttonLabel}
            switchToEnglishLabel={preferenceTexts?.sections?.language?.switchToEnglish}
            switchToGermanLabel={preferenceTexts?.sections?.language?.switchToGerman}
            englishVisibleLabel={preferenceTexts?.sections?.language?.englishVisible}
            germanVisibleLabel={preferenceTexts?.sections?.language?.germanVisible}
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="user-preferences-theme-title">
        <div className={styles.sectionHeader}>
          <h3 id="user-preferences-theme-title" className={styles.sectionTitle}>
            {preferenceTexts?.sections?.theme?.title ?? 'Theme'}
          </h3>
          <p className={styles.sectionDescription}>
            {preferenceTexts?.sections?.theme?.description ??
              'Switch between light and dark appearance.'}
          </p>
        </div>

        <div className={styles.controlRow}>
          <div className={styles.controlCopy}>
            <p className={styles.controlLabel}>
              {preferenceTexts?.sections?.theme?.title ?? 'Theme'}
            </p>
            <p className={styles.controlHint}>
              {profile.theme === 'dark'
                ? (preferenceTexts?.sections?.theme?.darkMode ?? 'Dark mode')
                : (preferenceTexts?.sections?.theme?.lightMode ?? 'Light mode')}
            </p>
          </div>
          <ThemeToggler
            ariaLabel={preferenceTexts?.sections?.theme?.buttonLabel}
            darkLabel={preferenceTexts?.sections?.theme?.darkMode}
            lightLabel={preferenceTexts?.sections?.theme?.lightMode}
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="user-preferences-notifications-title">
        <div className={styles.sectionHeader}>
          <h3 id="user-preferences-notifications-title" className={styles.sectionTitle}>
            {notificationTexts?.title ?? 'Notifications'}
          </h3>
          <p className={styles.sectionDescription}>
            {notificationTexts?.description ??
              'Review which notifications are required and which ones you can manage.'}
          </p>
        </div>

        <div className={styles.notificationList}>
          <article className={styles.notificationRow}>
            <div className={styles.notificationCopy}>
              <div className={styles.notificationTitleRow}>
                <p className={styles.notificationTitle}>
                  {notificationTexts?.inApp?.title ?? 'In-app notifications'}
                </p>
                <span className={styles.badge}>
                  {notificationTexts?.requiredBadge ?? 'Required'}
                </span>
              </div>
              <p className={styles.notificationDescription}>
                {notificationTexts?.inApp?.description ??
                  'These notifications are always enabled inside the app.'}
              </p>
            </div>
            <button
              type="button"
              className={`${styles.switch} ${styles.switchOn} ${styles.switchDisabled}`}
              aria-label={
                notificationTexts?.inApp?.ariaLabel ??
                'In-app notifications enabled and required'
              }
              aria-checked="true"
              role="switch"
              disabled
            >
              <span className={styles.thumb} aria-hidden="true" />
            </button>
          </article>

          <article className={styles.notificationRow}>
            <div className={styles.notificationCopy}>
              <div className={styles.notificationTitleRow}>
                <p className={styles.notificationTitle}>
                  {notificationTexts?.important?.title ?? 'Important email notifications'}
                </p>
                <span className={styles.badge}>
                  {notificationTexts?.requiredBadge ?? 'Required'}
                </span>
              </div>
              <p className={styles.notificationDescription}>
                {notificationTexts?.important?.description ??
                  'Important account emails stay enabled for security and service updates.'}
              </p>
            </div>
            <button
              type="button"
              className={`${styles.switch} ${styles.switchOn} ${styles.switchDisabled}`}
              aria-label={
                notificationTexts?.important?.ariaLabel ??
                'Important email notifications enabled and required'
              }
              aria-checked="true"
              role="switch"
              disabled
            >
              <span className={styles.thumb} aria-hidden="true" />
            </button>
          </article>

          <article className={styles.notificationRow}>
            <div className={styles.notificationCopy}>
              <div className={styles.notificationTitleRow}>
                <p className={styles.notificationTitle}>
                  {notificationTexts?.reminders?.title ?? 'Reminder emails'}
                </p>
              </div>
              <p className={styles.notificationDescription}>
                {notificationTexts?.reminders?.description ??
                  'Turn reminder emails on if you want to receive reminders for your bookings.'}
              </p>
            </div>
            <button
              type="button"
              className={`${styles.switch} ${remindersEnabled ? styles.switchOn : ''} ${
                remindersSaving ? styles.switchDisabled : ''
              }`}
              onClick={handleRemindersToggle}
              aria-label={
                notificationTexts?.reminders?.ariaLabel ??
                'Toggle reminder email notifications'
              }
              aria-checked={remindersEnabled}
              aria-busy={remindersSaving}
              role="switch"
              disabled={remindersSaving}
            >
              <span className={styles.thumb} aria-hidden="true" />
            </button>
          </article>
        </div>

        <p
          className={`${styles.status} ${remindersError ? styles.error : ''}`}
          role="status"
          aria-live="polite"
        >
          {remindersError ||
            (remindersSaving
              ? (notificationTexts?.reminders?.saving ?? 'Saving reminder preference...')
              : remindersEnabled
                ? (notificationTexts?.reminders?.enabled ?? 'Reminder emails enabled.')
                : (notificationTexts?.reminders?.disabled ?? 'Reminder emails disabled.'))}
        </p>
      </section>
    </section>
  );
}
