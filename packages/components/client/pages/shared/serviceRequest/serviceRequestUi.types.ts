import type { WorkAddress } from '../../../../../types/services';

export interface ServiceRequestWorkAddressSelection extends WorkAddress {
  source: 'primary' | 'saved' | 'new';
  saveToProfile?: boolean;
  label?: string;
}

export interface ServiceRequestSchedulingTexts {
  title?: string;
  description?: string;
  slotsTitle?: string;
  noDateSelected?: string;
  noAvailability?: string;
  blockedBadge?: string;
  selectedBadge?: string;
  availableBadge?: string;
  closeSlotsLabel?: string;
  loading?: string;
  errorPrefix?: string;
  previousMonth?: string;
  nextMonth?: string;
  monthNavigationAriaLabel?: string;
  weekdayLabels?: string[];
  nonWorkday?: string;
  blockedDay?: string;
  availableDay?: string;
  required?: string;
  missingClientConfig?: string;
}

export interface ServiceRequestAddressTexts {
  title?: string;
  description?: string;
  loading?: string;
  optionsLegend?: string;
  useDifferentAddressLabel?: string;
  useDifferentAddressHint?: string;
  emptyState?: string;
  manualHint?: string;
  saveToProfileLabel?: string;
  savedAddressLabel?: string;
  savedAddressPlaceholder?: string;
  manualSectionTitle?: string;
  differentAddressPromptTitle?: string;
  differentAddressPromptDescription?: string;
  differentAddressPromptButton?: string;
  differentAddressPromptButtonAriaLabel?: string;
  addressDetailsAriaLabel?: string;
  sourceLabels?: {
    primary?: string;
    saved?: string;
  };
  fields?: {
    street?: string;
    streetNumber?: string;
    postalCode?: string;
    district?: string;
    floor?: string;
  };
  profileStep?: {
    title?: string;
    description?: string;
    missingFieldsLabel?: string;
    summaryTitle?: string;
    summaryDescription?: string;
    summaryAriaLabel?: string;
    saveButton?: string;
    saving?: string;
    labels?: {
      name?: string;
      email?: string;
      phone?: string;
      primaryAddress?: string;
    };
    errors?: {
      required?: string;
      invalidName?: string;
      invalidPhone?: string;
    };
  };
  stepAriaLabel?: string;
  required?: string;
}
