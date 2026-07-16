'use client';

import { useLang } from '../../../../../../hooks';
import { formatUserAddress } from '../../../../../../types';
import type {
  CleaningFrequency,
  PropertySizeRange,
} from '../../../../../../types/services';
import type { SelectedCalendarSlot } from '../../../../../../types/calendar';
import { ServiceRequestReviewStep } from '../../../shared';
import type {
  CleaningRequestCustomerType,
  CleaningWorkAddressSelection,
} from '../cleaningRequest.types';

type ReviewTexts = {
  title: string;
  description: string;
  sections: {
    customer: string;
    property: string;
    scheduling: string;
    address: string;
  };
  labels: {
    customerType: string;
    frequency: string;
    sizeRange: string;
    roomsCount: string;
    hasBalcony: string;
    hasIndoorStairs: string;
    hasPets: string;
    details: string;
    visitDate: string;
    visitTime: string;
    addressSource: string;
    addressLabel: string;
    address: string;
    saveToProfile: string;
  };
  sourceOptions: {
    primary: string;
    saved: string;
    new: string;
  };
  emptyDetails: string;
  finalNote: string;
};

export default function ReviewStep({
  showHeader = true,
  texts,
  customerType,
  frequency,
  property,
  scheduling,
  workAddress,
  common,
}: {
  showHeader?: boolean;
  texts: ReviewTexts;
  customerType: {
    selected: CleaningRequestCustomerType;
    options: Record<CleaningRequestCustomerType, string>;
  };
  frequency: {
    selected: CleaningFrequency;
    options: Record<CleaningFrequency, string>;
  };
  property: {
    sizeRange: PropertySizeRange;
    sizeRangeOptions: Record<PropertySizeRange, string>;
    roomsCount: number;
    hasBalcony: boolean;
    hasIndoorStairs: boolean;
    hasPets: boolean;
    details?: string;
  };
  scheduling: SelectedCalendarSlot;
  workAddress: CleaningWorkAddressSelection;
  common: {
    yes: string;
    no: string;
  };
}) {
  const lang = useLang();
  const dateFormatter = new Intl.DateTimeFormat(lang, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeFormatter = new Intl.DateTimeFormat(lang, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const customerRows = [
    {
      label: texts.labels.customerType,
      value: customerType.options[customerType.selected],
    },
    {
      label: texts.labels.frequency,
      value: frequency.options[frequency.selected],
    },
  ];
  const propertyRows = [
    {
      label: texts.labels.sizeRange,
      value: property.sizeRangeOptions[property.sizeRange],
    },
    {
      label: texts.labels.roomsCount,
      value: property.roomsCount,
    },
    {
      label: texts.labels.hasBalcony,
      value: property.hasBalcony ? common.yes : common.no,
    },
    {
      label: texts.labels.hasIndoorStairs,
      value: property.hasIndoorStairs ? common.yes : common.no,
    },
    {
      label: texts.labels.hasPets,
      value: property.hasPets ? common.yes : common.no,
    },
    {
      label: texts.labels.details,
      value: property.details || texts.emptyDetails,
      details: true,
    },
  ];
  const schedulingRows = [
    {
      label: texts.labels.visitDate,
      value: dateFormatter.format(scheduling.start),
    },
    {
      label: texts.labels.visitTime,
      value: `${timeFormatter.format(scheduling.start)} - ${timeFormatter.format(scheduling.end)}`,
    },
  ];
  const addressLabel =
    workAddress.source === 'primary'
      ? texts.sourceOptions.primary
      : workAddress.label || (workAddress.source === 'saved' ? texts.sourceOptions.saved : '');

  return (
    <ServiceRequestReviewStep
      showHeader={showHeader}
      title={texts.title}
      description={texts.description}
      sections={[
        {
          title: texts.sections.customer,
          rows: customerRows,
        },
        {
          title: texts.sections.property,
          rows: propertyRows,
        },
        {
          title: texts.sections.scheduling,
          rows: schedulingRows,
        },
        {
          title: texts.sections.address,
          rows: [
            {
              label: addressLabel || texts.labels.address,
              value: formatUserAddress(workAddress.address),
              details: true,
            },
          ],
        },
      ]}
    />
  );
}
