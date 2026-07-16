'use client';

import { useLang } from '../../../../../../hooks';
import { formatUserAddress } from '../../../../../../types';
import { ServiceRequestReviewStep } from '../../../shared';
import type {
  HomeServiceCanonicalType,
  HomeServiceCustomerType,
  HomeServiceRequestFormTexts,
  HomeServiceWorkAddressSelection,
} from '../homeServiceRequest.types';
import type { SelectedCalendarSlot } from '../../../../../../types/calendar';
import type { PropertySizeRange } from '../../../../../../types/services';

export default function ReviewStep({
  showHeader = true,
  texts,
  customerType,
  serviceType,
  serviceDetails,
  paintingDetails,
  sizeRangeOptions,
  scheduling,
  workAddress,
}: {
  showHeader?: boolean;
  texts: HomeServiceRequestFormTexts['review'];
  customerType: {
    selected: HomeServiceCustomerType;
    options: Record<HomeServiceCustomerType, string>;
  };
  serviceType: {
    selected: HomeServiceCanonicalType;
    label: string;
  };
  serviceDetails: string;
  paintingDetails: {
    paintScopeLabel: string;
    roomsCount: number;
    sizeRange: PropertySizeRange | '';
  };
  sizeRangeOptions: Record<PropertySizeRange, string>;
  scheduling: SelectedCalendarSlot;
  workAddress: HomeServiceWorkAddressSelection;
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

  const paintingRows =
    serviceType.selected === 'painting'
      ? [
          {
            label: texts.labels.paintScope,
            value: paintingDetails.paintScopeLabel,
          },
          {
            label: texts.labels.roomsCount,
            value: paintingDetails.roomsCount,
          },
          {
            label: texts.labels.sizeRange,
            value: paintingDetails.sizeRange
              ? sizeRangeOptions[paintingDetails.sizeRange]
              : texts.emptyDetails,
          },
          {
            label: texts.labels.serviceDetails,
            value: serviceDetails || texts.emptyDetails,
            details: true,
          },
        ]
      : [
          {
            label: texts.labels.serviceDetails,
            value: serviceDetails || texts.emptyDetails,
            details: true,
          },
        ];

  return (
    <ServiceRequestReviewStep
      showHeader={showHeader}
      title={texts.title}
      description={texts.description}
      sections={[
        {
          title: texts.sections.customer,
          rows: [
            {
              label: texts.labels.customerType,
              value: customerType.options[customerType.selected],
            },
            {
              label: texts.labels.serviceType,
              value: serviceType.label,
            },
          ],
        },
        {
          title: texts.sections.details,
          rows: paintingRows,
        },
        {
          title: texts.sections.scheduling,
          rows: [
            {
              label: texts.labels.visitDate,
              value: dateFormatter.format(scheduling.start),
            },
            {
              label: texts.labels.visitTime,
              value: `${timeFormatter.format(scheduling.start)} - ${timeFormatter.format(scheduling.end)}`,
            },
          ],
        },
        {
          title: texts.sections.address,
          rows: [
            {
              label: texts.labels.address,
              value: formatUserAddress(workAddress.address),
              details: true,
            },
          ],
        },
      ]}
    />
  );
}
