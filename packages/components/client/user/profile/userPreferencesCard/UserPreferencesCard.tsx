'use client';

import { useState } from 'react';

import { useCookies } from '../../../../../contexts/cookies/CookiesContext';
import { useI18n, useProfile } from '../../../../../contexts';
import { SettingsLanguageControl } from './SettingsLanguageControl';
import { SettingsThemeControl } from './SettingsThemeControl';
import { UserPreferencesCardView } from './UserPreferencesCardView';
import type { PreferencesTexts } from './userPreferencesCard.types';

export function UserPreferencesCard() {
  const { texts } = useI18n();
  const { profile, updateProfile } = useProfile();
  const { openManager } = useCookies();
  const preferenceTexts: PreferencesTexts = texts?.pages?.client?.user?.profile?.preferences;
  const [remindersSaving, setRemindersSaving] = useState(false);
  const [remindersError, setRemindersError] = useState('');

  const remindersEnabled = profile.notificationPreferences.email.reminders.enabled;
  const notificationTexts = preferenceTexts?.sections?.notifications;
  const cookiesTexts = preferenceTexts?.sections?.cookies;
  const remindersStateText = remindersSaving
    ? (notificationTexts?.reminders?.saving ?? 'Saving changes...')
    : remindersEnabled
      ? (notificationTexts?.reminders?.enabled ?? 'Reminder emails enabled.')
      : (notificationTexts?.reminders?.disabled ?? 'Reminder emails disabled.');

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

  return (
    <UserPreferencesCardView
      title={preferenceTexts?.eyebrow ?? 'Preferences'}
      languageTitle={preferenceTexts?.sections?.language?.title ?? 'Language'}
      themeTitle={preferenceTexts?.sections?.theme?.title ?? 'Theme'}
      cookiesTitle={cookiesTexts?.title ?? 'Cookies'}
      cookiesButtonLabel={cookiesTexts?.buttonLabel ?? 'Open cookie notice'}
      notificationsTitle={notificationTexts?.title ?? 'Notifications'}
      notificationsDescription={
        notificationTexts?.description ??
        'Review which notifications are required and choose whether you want reminder emails.'
      }
      inAppTitle={notificationTexts?.inApp?.title ?? 'In-app notifications'}
      inAppDescription={
        notificationTexts?.inApp?.description ??
        'These notifications are always enabled inside the app.'
      }
      inAppAriaLabel={
        notificationTexts?.inApp?.ariaLabel ?? 'In-app notifications enabled and required'
      }
      inAppStatus={notificationTexts?.inApp?.status ?? 'Required'}
      importantTitle={notificationTexts?.important?.title ?? 'Important email notifications'}
      importantDescription={
        notificationTexts?.important?.description ??
        'Important account emails stay enabled for security and service updates.'
      }
      importantAriaLabel={
        notificationTexts?.important?.ariaLabel ??
        'Important email notifications enabled and required'
      }
      importantStatus={notificationTexts?.important?.status ?? 'Required'}
      remindersTitle={notificationTexts?.reminders?.title ?? 'Reminder emails'}
      remindersDescription={
        notificationTexts?.reminders?.description ??
        'Turn reminder emails on if you want to receive reminders for your bookings.'
      }
      remindersAriaLabel={
        notificationTexts?.reminders?.ariaLabel ?? 'Toggle reminder email notifications'
      }
      remindersEnabled={remindersEnabled}
      remindersSaving={remindersSaving}
      remindersStatusText={remindersError || remindersStateText}
      remindersError={remindersError}
      languageControl={<SettingsLanguageControl />}
      themeControl={<SettingsThemeControl />}
      onOpenCookies={openManager}
      onRemindersToggle={handleRemindersToggle}
    />
  );
}
