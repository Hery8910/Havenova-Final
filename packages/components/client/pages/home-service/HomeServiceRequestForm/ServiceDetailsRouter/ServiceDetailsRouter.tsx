import type { HomeServiceKind } from '../homeServiceTypes';
import PaintingDetailsStep, {
  type PaintingPaintScope,
} from '../PaintingDetailsStep/PaintingDetailsStep';
import ServiceDetailsStep from '../ServiceDetailsStep/ServiceDetailsStep';
import type { HomeServicePaintingDetails } from '../homeServiceRequest.types';

type Props = {
  showHeader?: boolean;
  serviceType: HomeServiceKind;
  texts: {
    title: string;
    description: string;
    selectedServiceLabel: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    helper: string;
    services: Record<HomeServiceKind, { title: string; description: string; detailsHint: string }>;
    painting: {
      title: string;
      description: string;
      paintScopeLabel: string;
      paintScopeOptions: Record<PaintingPaintScope, string>;
      roomsCountLabel: string;
      roomsCountDecrementAriaLabel?: string;
      roomsCountIncrementAriaLabel?: string;
      sizeRangeLabel: string;
      sizeRangeOptions: Record<PropertySizeRange, string>;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      descriptionHelper: string;
      photosLabel: string;
      photosDescription: string;
    };
  };
  requiredText: string;
  serviceDetails: string;
  serviceDetailsError?: string;
  paintingDetails: HomeServicePaintingDetails;
  paintingErrors: {
    paintScope?: string;
    sizeRange?: string;
  };
  onServiceDetailsChange: (value: string) => void;
  onServiceDetailsBlur: () => void;
  onPaintingPaintScopeChange: (value: PaintingPaintScope | '') => void;
  onPaintingPaintScopeBlur: () => void;
  onPaintingRoomsDecrement: () => void;
  onPaintingRoomsIncrement: () => void;
  onPaintingSizeRangeChange: (value: PropertySizeRange | '') => void;
  onPaintingSizeRangeBlur: () => void;
};

export default function ServiceDetailsRouter({
  showHeader = true,
  serviceType,
  texts,
  requiredText,
  serviceDetails,
  serviceDetailsError,
  paintingDetails,
  paintingErrors,
  onServiceDetailsChange,
  onServiceDetailsBlur,
  onPaintingPaintScopeChange,
  onPaintingPaintScopeBlur,
  onPaintingRoomsDecrement,
  onPaintingRoomsIncrement,
  onPaintingSizeRangeChange,
  onPaintingSizeRangeBlur,
}: Props) {
  if (serviceType === 'painting') {
    return (
      <PaintingDetailsStep
        showHeader={showHeader}
        texts={texts.painting}
        requiredText={requiredText}
        values={paintingDetails}
        errors={{
          paintScope: paintingErrors.paintScope,
          sizeRange: paintingErrors.sizeRange,
          description: serviceDetailsError,
        }}
        onPaintScopeChange={onPaintingPaintScopeChange}
        onPaintScopeBlur={onPaintingPaintScopeBlur}
        onRoomsDecrement={onPaintingRoomsDecrement}
        onRoomsIncrement={onPaintingRoomsIncrement}
        onSizeRangeChange={onPaintingSizeRangeChange}
        onSizeRangeBlur={onPaintingSizeRangeBlur}
        onDescriptionChange={onServiceDetailsChange}
        onDescriptionBlur={onServiceDetailsBlur}
      />
    );
  }

  return (
    <ServiceDetailsStep
      showHeader={showHeader}
      texts={texts}
      selectedServiceType={serviceType}
      details={serviceDetails}
      error={serviceDetailsError}
      onDetailsChange={onServiceDetailsChange}
      onDetailsBlur={onServiceDetailsBlur}
    />
  );
}
