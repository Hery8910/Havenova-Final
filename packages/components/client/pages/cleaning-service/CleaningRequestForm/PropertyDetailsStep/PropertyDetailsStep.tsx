import { useId } from 'react';
import styles from './PropertyDetailsStep.module.css';
import { PropertySizeRange } from '../../../../../../types/services';
import { CgMathMinus, CgMathPlus } from 'react-icons/cg';
import { RequestField, RequestQuantityStepper } from '../../../shared';

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
  const balconyCheckboxId = useId();
  const indoorStairsCheckboxId = useId();
  const petsCheckboxId = useId();

  return (
    <section className={styles.container} aria-labelledby={titleId}>
      {showTitle ? (
        <h3 id={titleId} className={`${styles.propertyTitle} type-title-sm`}>
          {property.title}
        </h3>
      ) : null}

      <RequestField
        htmlFor="cleaning-size-range"
        label={property.sizeRangeLabel}
        errorText={errors.sizeRange}
        errorId={sizeRangeErrorId}
        fieldClassName={styles.field}
        labelClassName={styles.label}
        errorClassName={styles.errorText}
      >
        <select
          id="cleaning-size-range"
          className={`input ${errors.sizeRange ? styles.fieldControlError : ''}`}
          value={values.sizeRange}
          onChange={(e) => onSizeRangeChange(e.target.value as PropertySizeRange | '')}
          onBlur={onSizeRangeBlur}
          aria-invalid={Boolean(errors.sizeRange)}
          aria-describedby={sizeRangeErrorId}
          required
        >
          <option value="">{requiredText}</option>
          {(Object.keys(property.sizeRangeOptions) as PropertySizeRange[]).map((size) => (
            <option key={size} value={size}>
              {property.sizeRangeOptions[size]}
            </option>
          ))}
        </select>
      </RequestField>

      <div className={styles.field}>
        <span className={styles.label}>
          {property.roomsCountLabel}
        </span>
        <RequestQuantityStepper
          value={values.roomsCount || '1'}
          label={property.roomsCountLabel}
          describedBy={errors.roomsCount ? roomsErrorId : undefined}
          error={Boolean(errors.roomsCount)}
          decrementLabel={property.roomsCountDecrementAriaLabel ?? 'Decrease rooms count'}
          incrementLabel={property.roomsCountIncrementAriaLabel ?? 'Increase rooms count'}
          onDecrement={onRoomsDecrement}
          onIncrement={onRoomsIncrement}
          decrementIcon={<CgMathMinus />}
          incrementIcon={<CgMathPlus />}
        />
        <span id={roomsErrorId} className={styles.errorText} aria-live="polite">
          {errors.roomsCount || ''}
        </span>
      </div>

      <fieldset className={styles.flagsGroup}>
        <legend className={styles.legend}>{property.hasBalconyLabel}</legend>
        <label className={styles.checkboxLabel} htmlFor={balconyCheckboxId}>
          <input
            id={balconyCheckboxId}
            type="checkbox"
            checked={values.hasBalcony}
            onChange={onBalconyToggle}
            className={styles.checkboxInput}
          />
          <span className={styles.customCheckbox} aria-hidden="true" />
        </label>
      </fieldset>

      <fieldset className={styles.flagsGroup}>
        <legend className={styles.legend}>{property.hasIndoorStairsLabel}</legend>
        <label className={styles.checkboxLabel} htmlFor={indoorStairsCheckboxId}>
          <input
            id={indoorStairsCheckboxId}
            type="checkbox"
            checked={values.hasIndoorStairs}
            onChange={onIndoorStairsToggle}
            className={styles.checkboxInput}
          />
          <span className={styles.customCheckbox} aria-hidden="true" />
        </label>
      </fieldset>

      <fieldset className={styles.flagsGroup}>
        <legend className={styles.legend}>{property.hasPetsLabel}</legend>
        <label className={styles.checkboxLabel} htmlFor={petsCheckboxId}>
          <input
            id={petsCheckboxId}
            type="checkbox"
            checked={values.hasPets}
            onChange={onPetsToggle}
            className={styles.checkboxInput}
          />
          <span className={styles.customCheckbox} aria-hidden="true" />
        </label>
      </fieldset>

      <RequestField
        htmlFor="cleaning-property-details"
        label={property.detailsLabel}
        errorText={errors.details}
        errorId={detailsErrorId}
        fieldClassName={styles.field}
        labelClassName={styles.label}
        errorClassName={styles.errorText}
      >
        <textarea
          id="cleaning-property-details"
          className={`input ${styles.textarea} ${errors.details ? styles.fieldControlError : ''}`}
          maxLength={1500}
          value={values.details}
          placeholder={property.detailsPlaceholder}
          onChange={(e) => onDetailsChange(e.target.value)}
          onBlur={onDetailsBlur}
          aria-invalid={Boolean(errors.details)}
          aria-describedby={detailsErrorId}
          rows={5}
        />
      </RequestField>
    </section>
  );
}
