import { useId } from 'react';
import styles from './PropertyDetailsStep.module.css';
import { PropertySizeRange } from '../../../../../../types/services';

type Props = {
  showTitle?: boolean;
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
  showTitle = true,
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
  const titleId = useId();
  const sizeRangeErrorId = useId();
  const roomsErrorId = useId();
  const detailsErrorId = useId();
  const roomsGroupLabelId = useId();

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      {showTitle ? (
        <h3 id={titleId} className={`${styles.propertyTitle} type-title-sm`}>
          {property.title}
        </h3>
      ) : null}

      <label className={`label ${styles.field} ${styles.column}`} htmlFor="cleaning-size-range">
        <span className={styles.label}>{property.sizeRangeLabel}</span>
        <select
          id="cleaning-size-range"
          className={`input ${errors.sizeRange ? styles.fieldControlError : ''}`}
          value={values.sizeRange}
          onChange={(e) => onSizeRangeChange(e.target.value as PropertySizeRange | '')}
          onBlur={onSizeRangeBlur}
          aria-invalid={Boolean(errors.sizeRange)}
          aria-describedby={errors.sizeRange ? sizeRangeErrorId : undefined}
          required
        >
          <option value="">{requiredText}</option>
          {(Object.keys(property.sizeRangeOptions) as PropertySizeRange[]).map((size) => (
            <option key={size} value={size}>
              {property.sizeRangeOptions[size]}
            </option>
          ))}
        </select>
        {errors.sizeRange ? (
          <span className={styles.errorText} id={sizeRangeErrorId}>
            {errors.sizeRange}
          </span>
        ) : null}
      </label>

      <div className={`label ${styles.field}`}>
        <span className={styles.label} id={roomsGroupLabelId}>
          {property.roomsCountLabel}
        </span>
        <div
          className={`${styles.counter} ${errors.roomsCount ? styles.fieldControlError : ''}`}
          role="group"
          aria-labelledby={roomsGroupLabelId}
          aria-describedby={errors.roomsCount ? roomsErrorId : undefined}
        >
          <button
            type="button"
            className={`button button--outline ${styles.counterButton}`}
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
            className={`button button--outline ${styles.counterButton}`}
            onClick={onRoomsIncrement}
            aria-label={property.roomsCountIncrementAriaLabel ?? 'Increase rooms count'}
          >
            +
          </button>
        </div>
        {errors.roomsCount ? (
          <span className={styles.errorText} id={roomsErrorId}>
            {errors.roomsCount}
          </span>
        ) : null}
      </div>

      <fieldset className={styles.flagsGroup}>
        <legend className={styles.legend}>{property.hasBalconyLabel}</legend>
        <button
          type="button"
          role="switch"
          aria-checked={values.hasBalcony}
          className={`button button--outline ${styles.switch} ${values.hasBalcony ? styles.switchActive : ''}`}
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
          className={`button button--outline ${styles.switch} ${values.hasIndoorStairs ? styles.switchActive : ''}`}
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
          className={`button button--outline ${styles.switch} ${values.hasPets ? styles.switchActive : ''}`}
          onClick={onPetsToggle}
        >
          <span className={styles.switchTrack}>
            <span className={styles.switchThumb} />
          </span>
          <span className={styles.switchLabel}>{values.hasPets ? common.yes : common.no}</span>
        </button>
      </fieldset>

      <label
        className={` label ${styles.field} ${styles.column}`}
        htmlFor="cleaning-property-details"
      >
        <span className={styles.label}>{property.detailsLabel}</span>
        <textarea
          id="cleaning-property-details"
          className={`input ${errors.details ? styles.fieldControlError : ''}`}
          maxLength={1500}
          value={values.details}
          placeholder={property.detailsPlaceholder}
          onChange={(e) => onDetailsChange(e.target.value)}
          onBlur={onDetailsBlur}
          aria-invalid={Boolean(errors.details)}
          aria-describedby={errors.details ? detailsErrorId : undefined}
          rows={5}
        />
        {errors.details ? (
          <span className={styles.errorText} id={detailsErrorId}>
            {errors.details}
          </span>
        ) : null}
      </label>
    </section>
  );
}
