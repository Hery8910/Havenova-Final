import styles from './PropertyDetailsStep.module.css';
import { PropertySizeRange } from '../../../../../../types/services';

type Props = {
  property: {
    title: string;
    sizeRangeLabel: string;
    sizeRangeOptions: Record<PropertySizeRange, string>;
    roomsCountLabel: string;
    roomsCountDecrementAriaLabel?: string;
    roomsCountIncrementAriaLabel?: string;
    hasBalconyLabel: string;
    hasIndoorStairsLabel: string;
    hasPetsLabel: string;
    detailsLabel: string;
    detailsPlaceholder: string;
  };
  common: {
    yes: string;
    no: string;
  };
  requiredText: string;
  values: {
    sizeRange: PropertySizeRange | '';
    roomsCount: string;
    hasBalcony: boolean;
    hasIndoorStairs: boolean;
    hasPets: boolean;
    details: string;
  };
  errors: {
    sizeRange?: string;
    roomsCount?: string;
    details?: string;
  };
  onSizeRangeChange: (value: PropertySizeRange | '') => void;
  onSizeRangeBlur: () => void;
  onRoomsDecrement: () => void;
  onRoomsIncrement: () => void;
  onBalconyToggle: () => void;
  onIndoorStairsToggle: () => void;
  onPetsToggle: () => void;
  onDetailsChange: (value: string) => void;
  onDetailsBlur: () => void;
};

export default function PropertyDetailsStep({
  property,
  common,
  requiredText,
  values,
  errors,
  onSizeRangeChange,
  onSizeRangeBlur,
  onRoomsDecrement,
  onRoomsIncrement,
  onBalconyToggle,
  onIndoorStairsToggle,
  onPetsToggle,
  onDetailsChange,
  onDetailsBlur,
}: Props) {
  return (
    <section className={styles.container} aria-labelledby="cleaning-property-details-title">
      <h3 id="cleaning-property-details-title" className={styles.propertyTitle}>
        {property.title}
      </h3>

      <label className={styles.field} htmlFor="cleaning-size-range">
        <span className={styles.label}>{property.sizeRangeLabel}</span>
        <select
          id="cleaning-size-range"
          className={styles.input}
          value={values.sizeRange}
          onChange={(e) => onSizeRangeChange(e.target.value as PropertySizeRange | '')}
          onBlur={onSizeRangeBlur}
          aria-invalid={Boolean(errors.sizeRange)}
          aria-describedby="cleaning-size-range-error"
          required
        >
          <option value="">{requiredText}</option>
          {(Object.keys(property.sizeRangeOptions) as PropertySizeRange[]).map((size) => (
            <option key={size} value={size}>
              {property.sizeRangeOptions[size]}
            </option>
          ))}
        </select>
        <span id="cleaning-size-range-error" className={styles.error} aria-live="polite">
          {errors.sizeRange || ''}
        </span>
      </label>

      <label className={styles.field} htmlFor="cleaning-rooms-count">
        <span className={styles.label}>{property.roomsCountLabel}</span>
        <section
          id="cleaning-rooms-count"
          className={styles.counter}
          role="group"
          aria-label={property.roomsCountLabel}
          aria-invalid={Boolean(errors.roomsCount)}
          aria-describedby="cleaning-rooms-count-error"
        >
          <button
            type="button"
            className={styles.counterButton}
            onClick={onRoomsDecrement}
            aria-label={property.roomsCountDecrementAriaLabel ?? 'Decrease rooms count'}
          >
            -
          </button>
          <output className={styles.counterValue} aria-live="polite">
            {values.roomsCount || '1'}
          </output>
          <button
            type="button"
            className={styles.counterButton}
            onClick={onRoomsIncrement}
            aria-label={property.roomsCountIncrementAriaLabel ?? 'Increase rooms count'}
          >
            +
          </button>
        </section>
        <span id="cleaning-rooms-count-error" className={styles.error} aria-live="polite">
          {errors.roomsCount || ''}
        </span>
      </label>

      <fieldset className={styles.flagsGroup}>
        <legend className={styles.legend}>{property.hasBalconyLabel}</legend>
        <button
          type="button"
          role="switch"
          aria-checked={values.hasBalcony}
          className={`${styles.switch} ${values.hasBalcony ? styles.switchActive : ''}`}
          onClick={onBalconyToggle}
        >
          <span className={styles.switchTrack}>
            <span className={styles.switchThumb} />
          </span>
          <span className={styles.switchLabel}>{values.hasBalcony ? common.yes : common.no}</span>
        </button>
      </fieldset>

      <fieldset className={styles.flagsGroup}>
        <legend className={styles.legend}>{property.hasIndoorStairsLabel}</legend>
        <button
          type="button"
          role="switch"
          aria-checked={values.hasIndoorStairs}
          className={`${styles.switch} ${values.hasIndoorStairs ? styles.switchActive : ''}`}
          onClick={onIndoorStairsToggle}
        >
          <span className={styles.switchTrack}>
            <span className={styles.switchThumb} />
          </span>
          <span className={styles.switchLabel}>
            {values.hasIndoorStairs ? common.yes : common.no}
          </span>
        </button>
      </fieldset>

      <fieldset className={styles.flagsGroup}>
        <legend className={styles.legend}>{property.hasPetsLabel}</legend>
        <button
          type="button"
          role="switch"
          aria-checked={values.hasPets}
          className={`${styles.switch} ${values.hasPets ? styles.switchActive : ''}`}
          onClick={onPetsToggle}
        >
          <span className={styles.switchTrack}>
            <span className={styles.switchThumb} />
          </span>
          <span className={styles.switchLabel}>{values.hasPets ? common.yes : common.no}</span>
        </button>
      </fieldset>

      <label className={styles.field} htmlFor="cleaning-property-details">
        <span className={styles.label}>{property.detailsLabel}</span>
        <textarea
          id="cleaning-property-details"
          className={styles.textarea}
          maxLength={1500}
          value={values.details}
          placeholder={property.detailsPlaceholder}
          onChange={(e) => onDetailsChange(e.target.value)}
          onBlur={onDetailsBlur}
          aria-invalid={Boolean(errors.details)}
          aria-describedby="cleaning-property-details-error"
          rows={5}
        />
        <span id="cleaning-property-details-error" className={styles.error} aria-live="polite">
          {errors.details || ''}
        </span>
      </label>
    </section>
  );
}
