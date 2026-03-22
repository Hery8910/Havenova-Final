import type { PropertySizeRange } from '../../../../../../types/services';
import styles from './PaintingDetailsStep.module.css';

export type PaintingPaintScope =
  | 'one_wall'
  | 'one_room'
  | 'multiple_rooms'
  | 'entire_apartment';

type Props = {
  texts: {
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
  requiredText: string;
  values: {
    paintScope: PaintingPaintScope | '';
    roomsCount: number;
    sizeRange: PropertySizeRange | '';
    description: string;
  };
  errors: {
    paintScope?: string;
    sizeRange?: string;
    description?: string;
  };
  onPaintScopeChange: (value: PaintingPaintScope | '') => void;
  onPaintScopeBlur: () => void;
  onRoomsDecrement: () => void;
  onRoomsIncrement: () => void;
  onSizeRangeChange: (value: PropertySizeRange | '') => void;
  onSizeRangeBlur: () => void;
  onDescriptionChange: (value: string) => void;
  onDescriptionBlur: () => void;
};

export default function PaintingDetailsStep({
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
  return (
    <section className={styles.container} aria-labelledby="home-service-painting-details-title">
      <header className={styles.header}>
        <h3 id="home-service-painting-details-title" className={styles.title}>
          {texts.title}
        </h3>
        <p className={styles.description}>{texts.description}</p>
      </header>

      <label className={styles.field} htmlFor="painting-scope">
        <span className={styles.label}>{texts.paintScopeLabel}</span>
        <select
          id="painting-scope"
          className={styles.input}
          value={values.paintScope}
          onChange={(event) => onPaintScopeChange(event.target.value as PaintingPaintScope | '')}
          onBlur={onPaintScopeBlur}
          aria-invalid={Boolean(errors.paintScope)}
          aria-describedby="painting-scope-error"
          required
        >
          <option value="">{requiredText}</option>
          {(Object.keys(texts.paintScopeOptions) as PaintingPaintScope[]).map((option) => (
            <option key={option} value={option}>
              {texts.paintScopeOptions[option]}
            </option>
          ))}
        </select>
        <span id="painting-scope-error" className={styles.error} aria-live="polite">
          {errors.paintScope || ''}
        </span>
      </label>

      <label className={styles.field} htmlFor="painting-rooms-count">
        <span className={styles.label}>{texts.roomsCountLabel}</span>
        <section
          id="painting-rooms-count"
          className={styles.counter}
          role="group"
          aria-label={texts.roomsCountLabel}
        >
          <button
            type="button"
            className={styles.counterButton}
            onClick={onRoomsDecrement}
            aria-label={texts.roomsCountDecrementAriaLabel ?? 'Decrease rooms count'}
          >
            -
          </button>
          <output className={styles.counterValue} aria-live="polite">
            {values.roomsCount}
          </output>
          <button
            type="button"
            className={styles.counterButton}
            onClick={onRoomsIncrement}
            aria-label={texts.roomsCountIncrementAriaLabel ?? 'Increase rooms count'}
          >
            +
          </button>
        </section>
      </label>

      <label className={styles.field} htmlFor="painting-size-range">
        <span className={styles.label}>{texts.sizeRangeLabel}</span>
        <select
          id="painting-size-range"
          className={styles.input}
          value={values.sizeRange}
          onChange={(event) => onSizeRangeChange(event.target.value as PropertySizeRange | '')}
          onBlur={onSizeRangeBlur}
          aria-invalid={Boolean(errors.sizeRange)}
          aria-describedby="painting-size-range-error"
          required
        >
          <option value="">{requiredText}</option>
          {(Object.keys(texts.sizeRangeOptions) as PropertySizeRange[]).map((size) => (
            <option key={size} value={size}>
              {texts.sizeRangeOptions[size]}
            </option>
          ))}
        </select>
        <span id="painting-size-range-error" className={styles.error} aria-live="polite">
          {errors.sizeRange || ''}
        </span>
      </label>

      <label className={styles.field} htmlFor="painting-description">
        <span className={styles.label}>{texts.descriptionLabel}</span>
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
          aria-describedby="painting-description-helper painting-description-error"
        />
        <span id="painting-description-helper" className={styles.hint}>
          {texts.descriptionHelper}
        </span>
        <span id="painting-description-error" className={styles.error} aria-live="polite">
          {errors.description || ''}
        </span>
      </label>

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
