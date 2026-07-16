import type { ClientCalendarSettings, SelectedCalendarSlot } from '../../../../../../types/calendar';
import { AvailabilityCalendar } from '../AvailabilityCalendar';
import { serviceRequestShellStyles as shellStyles } from '../ServiceRequestShell';
import type { ServiceRequestSchedulingTexts } from '../serviceRequestUi.types';

interface ServiceRequestSchedulingStepProps {
  clientCalendarSettings: ClientCalendarSettings | null;
  value: SelectedCalendarSlot | null;
  onChange: (value: SelectedCalendarSlot | null) => void;
  texts?: ServiceRequestSchedulingTexts;
  fallbackHeading: string;
}

export function ServiceRequestSchedulingStep({
  clientCalendarSettings,
  value,
  onChange,
  texts,
  fallbackHeading,
}: ServiceRequestSchedulingStepProps) {
  const heading = texts?.title ?? fallbackHeading;
  const ariaLabel = texts?.title ?? fallbackHeading;

  if (!clientCalendarSettings) {
    return (
      <section className={shellStyles.missingConfig} aria-live="polite">
        <p className={shellStyles.errorText}>
          {texts?.missingClientConfig ?? 'Client calendar configuration is unavailable right now.'}
        </p>
      </section>
    );
  }

  return (
    <section className={shellStyles.stepPane} aria-label={ariaLabel}>
      <AvailabilityCalendar
        showHeader={false}
        clientId={clientCalendarSettings.clientId}
        schedule={clientCalendarSettings.schedule}
        slotDurationMinutes={clientCalendarSettings.slotDurationMinutes}
        value={value}
        onChange={onChange}
        texts={{
          title: texts?.title,
          description: texts?.description,
          slotsTitle: texts?.slotsTitle,
          noDateSelected: texts?.noDateSelected,
          noAvailability: texts?.noAvailability,
          blockedBadge: texts?.blockedBadge,
          selectedBadge: texts?.selectedBadge,
          availableBadge: texts?.availableBadge,
          closeSlotsLabel: texts?.closeSlotsLabel,
          loading: texts?.loading,
          errorPrefix: texts?.errorPrefix,
          previousMonth: texts?.previousMonth,
          nextMonth: texts?.nextMonth,
          monthNavigationAriaLabel: texts?.monthNavigationAriaLabel,
          weekdayLabels: texts?.weekdayLabels,
          nonWorkday: texts?.nonWorkday,
          blockedDay: texts?.blockedDay,
          availableDay: texts?.availableDay,
        }}
      />
    </section>
  );
}
