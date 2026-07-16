import type { PropertySizeRange } from '../../../../../../types/services';
import styles from './PaintingDetailsStep.module.css';
import { useId } from 'react';
import { RequestField, RequestQuantityStepper, RequestStepIntro } from '../../../shared';
import type { HomeServicePaintingDetails, HomeServiceRequestFormTexts } from '../homeServiceRequest.types';

export type PaintingPaintScope =
  | 'one_wall'
  | 'one_room'
  | 'multiple_rooms'
  | 'entire_apartment';

type Props = {
  showHeader?: boolean;
  texts: HomeServiceRequestFormTexts['serviceDetails']['painting'];
  requiredText: string;
  values: HomeServicePaintingDetails;
  errors: {
    paintScope?: string;
    sizeRange?: string;
    description?: string;
  };
  onPaintScopeChange: (value: PaintingPaintScope | '') => void;
  onPaintScopeBlur: () => void;
  onRoomsDecrement: () => void;
  onRoomsIncrement: () => void;
  onSizeRangeChange: (value: HomeServicePaintingDetails['sizeRange']) => void;
  onSizeRangeBlur: () => void;
  onDescriptionChange: (value: string) => void;
  onDescriptionBlur: () => void;
};

export default function PaintingDetailsStep({
  showHeader = true,
  texts,
  requiredText,
  values,
  errors,
  onPaintScopeChange,
  onPaintScopeBlur,
  onRoomsDecrement,
  onRoomsIncrement,
  onSizeRangeChange,
  onSizeRangeBlur,
  onDescriptionChange,
  onDescriptionBlur,
}: Props) {
  const paintScopeErrorId = useId();
  const sizeRangeErrorId = useId();
  const descriptionHelperId = useId();
  const descriptionErrorId = useId();

  return (
    <section className={styles.container} aria-labelledby="home-service-painting-details-title">
      {showHeader ? (
        <RequestStepIntro
          title={texts.title}
          titleId="home-service-painting-details-title"
          description={texts.description}
        />
      ) : null}

      <RequestField
        htmlFor="painting-scope"
        label={texts.paintScopeLabel}
        errorText={errors.paintScope}
        errorId={paintScopeErrorId}
        fieldClassName={styles.field}
        labelClassName={styles.label}
        errorClassName={styles.error}
      >
        <select
          id="painting-scope"
          className={styles.input}
          value={values.paintScope}
          onChange={(event) => onPaintScopeChange(event.target.value as PaintingPaintScope | '')}
          onBlur={onPaintScopeBlur}
          aria-invalid={Boolean(errors.paintScope)}
          aria-describedby={paintScopeErrorId}
          required
        >
          <option value="">{requiredText}</option>
          {(Object.keys(texts.paintScopeOptions) as PaintingPaintScope[]).map((option) => (
            <option key={option} value={option}>
              {texts.paintScopeOptions[option]}
            </option>
          ))}
        </select>
      </RequestField>

      <label className={styles.field} htmlFor="painting-rooms-count">
        <span className={styles.label}>{texts.roomsCountLabel}</span>
        <RequestQuantityStepper
          value={values.roomsCount}
          label={texts.roomsCountLabel}
          decrementLabel={texts.roomsCountDecrementAriaLabel ?? 'Decrease rooms count'}
          incrementLabel={texts.roomsCountIncrementAriaLabel ?? 'Increase rooms count'}
          onDecrement={onRoomsDecrement}
          onIncrement={onRoomsIncrement}
        />
      </label>

      <RequestField
        htmlFor="painting-size-range"
        label={texts.sizeRangeLabel}
        errorText={errors.sizeRange}
        errorId={sizeRangeErrorId}
        fieldClassName={styles.field}
        labelClassName={styles.label}
        errorClassName={styles.error}
      >
        <select
          id="painting-size-range"
          className={styles.input}
          value={values.sizeRange}
          onChange={(event) => onSizeRangeChange(event.target.value as PropertySizeRange | '')}
          onBlur={onSizeRangeBlur}
          aria-invalid={Boolean(errors.sizeRange)}
          aria-describedby={sizeRangeErrorId}
          required
        >
          <option value="">{requiredText}</option>
          {(Object.keys(texts.sizeRangeOptions) as PropertySizeRange[]).map((size) => (
            <option key={size} value={size}>
              {texts.sizeRangeOptions[size]}
            </option>
          ))}
        </select>
      </RequestField>

      <RequestField
        htmlFor="painting-description"
        label={texts.descriptionLabel}
        helperText={texts.descriptionHelper}
        helperId={descriptionHelperId}
        errorText={errors.description}
        errorId={descriptionErrorId}
        fieldClassName={styles.field}
        labelClassName={styles.label}
        helperClassName={styles.hint}
        errorClassName={styles.error}
      >
        <textarea
          id="painting-description"
          className={styles.textarea}
          value={values.description}
          placeholder={texts.descriptionPlaceholder}
          onChange={(event) => onDescriptionChange(event.target.value)}
          onBlur={onDescriptionBlur}
          maxLength={1500}
          rows={6}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={`${descriptionHelperId} ${descriptionErrorId}`}
        />
      </RequestField>

      <section className={styles.photosPlaceholder} aria-labelledby="painting-photos-title">
        <div>
          <h4 id="painting-photos-title" className={styles.photosTitle}>
            {texts.photosLabel}
          </h4>
          <p className={styles.photosDescription}>{texts.photosDescription}</p>
        </div>
      </section>
    </section>
  );
}
