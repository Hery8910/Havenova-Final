import type { JSX } from 'react';

export interface PreferencesTexts {
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
      description?: string;
      inApp?: {
        title?: string;
        description?: string;
        ariaLabel?: string;
        status?: string;
      };
      important?: {
        title?: string;
        description?: string;
        ariaLabel?: string;
        status?: string;
      };
      reminders?: {
        title?: string;
        description?: string;
        ariaLabel?: string;
        error?: string;
        enabled?: string;
        disabled?: string;
        saving?: string;
      };
    };
    cookies?: {
      title?: string;
      buttonLabel?: string;
    };
  };
}

export interface UserPreferencesCardViewProps {
  title: string;
  languageTitle: string;
  themeTitle: string;
  cookiesTitle: string;
  cookiesButtonLabel: string;
  notificationsTitle: string;
  notificationsDescription: string;
  inAppTitle: string;
  inAppDescription: string;
  inAppAriaLabel: string;
  inAppStatus: string;
  importantTitle: string;
  importantDescription: string;
  importantAriaLabel: string;
  importantStatus: string;
  remindersTitle: string;
  remindersDescription: string;
  remindersAriaLabel: string;
  remindersEnabled: boolean;
  remindersSaving: boolean;
  remindersStatusText: string;
  remindersError: string;
  languageControl: JSX.Element;
  themeControl: JSX.Element;
  onOpenCookies: () => void;
  onRemindersToggle: () => void;
}
