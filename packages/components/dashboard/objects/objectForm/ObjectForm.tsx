'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import styles from './ObjectForm.module.css';
import { ObjectFormValues } from '@/packages/types/object';
import { PropertyManagerLookupItem } from '@/packages/types/propertyManager';
import { useI18n } from '../../../../contexts';

interface ObjectFormProps {
  mode: 'create' | 'edit';
  initialValues: ObjectFormValues;
  initialManagerLabel?: string;
  onManagerSearch: (query: string) => Promise<PropertyManagerLookupItem[]>;
  loading: boolean;
  onSubmit: (values: ObjectFormValues) => void;
  onCancel: () => void;
}

const ObjectForm = ({
  mode,
  initialValues,
  initialManagerLabel,
  onManagerSearch,
  loading,
  onSubmit,
  onCancel,
}: ObjectFormProps) => {
  const { texts } = useI18n();
  const formTexts = texts.components?.dashboard?.pages?.objects?.form;

  const [values, setValues] = useState<ObjectFormValues>(initialValues);
  const [managerQuery, setManagerQuery] = useState(initialManagerLabel || '');
  const [managerResults, setManagerResults] = useState<PropertyManagerLookupItem[]>([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const objectNumberSuffixRef = useRef<HTMLInputElement | null>(null);
  const managerSearchKeyRef = useRef(0);

  const objectNumberParts = useMemo(() => {
    const raw = values.objectNumber.replace(/[^0-9]/g, '');
    const left = raw.slice(0, 4);
    const right = raw.slice(4, 6);
    return { left, right };
  }, [values.objectNumber]);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    setManagerQuery(initialManagerLabel || '');
  }, [initialManagerLabel]);

  useEffect(() => {
    const trimmed = managerQuery.trim();
    if (!trimmed.length) {
      setManagerResults([]);
      setShowResults(false);
      setManagerLoading(false);
      return;
    }

    setManagerLoading(true);
    setShowResults(true);

    const searchKey = ++managerSearchKeyRef.current;
    const timeoutId = window.setTimeout(async () => {
      try {
        const results = await onManagerSearch(trimmed);
        if (searchKey !== managerSearchKeyRef.current) return;
        setManagerResults(results);
      } finally {
        if (searchKey === managerSearchKeyRef.current) {
          setManagerLoading(false);
        }
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [managerQuery, onManagerSearch]);

  const managerEmptyLabel = useMemo(
    () => formTexts?.fields?.propertyManagerEmpty || 'No managers found.',
    [formTexts?.fields?.propertyManagerEmpty]
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
    >
      <header className={styles.header}>
        <h2 className={styles.formTitle}>
          {mode === 'create'
            ? formTexts?.createTitle || 'Create object'
            : formTexts?.editTitle || 'Edit object'}
        </h2>
      </header>
      <article className={styles.article}>
        {mode === 'edit' && (
          <label className={`${styles.field} ${styles.statusField}`}>
            <span className="text-label">{formTexts?.fields?.status || 'Status'}</span>
            <span className={styles.statusControl}>
              <span className={`${styles.statusText} text-body-sm`}>
                {values.status === 'active'
                  ? formTexts?.statusOptions?.active || 'Active'
                  : formTexts?.statusOptions?.inactive || 'Inactive'}
              </span>
              <input
                className={styles.statusInput}
                type="checkbox"
                name="status"
                checked={values.status === 'active'}
                onChange={(event) => {
                  setValues((prev) => ({
                    ...prev,
                    status: event.target.checked ? 'active' : 'inactive',
                  }));
                }}
                aria-label={formTexts?.fields?.status || 'Status'}
              />
              <span className={styles.statusTrack} aria-hidden="true">
                <span className={styles.statusThumb} />
              </span>
            </span>
          </label>
        )}
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.propertyManagerId || 'Manager ID'}</span>
          <div className={styles.searchField}>
            <IoSearch aria-hidden="true" />
            <input
              className={styles.searchInput}
              name="propertyManagerSearch"
              value={managerQuery}
              onChange={(event) => {
                setManagerQuery(event.target.value);
                setValues((prev) => ({ ...prev, propertyManagerId: '' }));
              }}
              placeholder={
                formTexts?.fields?.propertyManagerPlaceholder || 'Search manager by name or email'
              }
              autoComplete="off"
              required
            />
          </div>
          {!values.propertyManagerId && managerQuery.trim().length === 0 && (
            <span
              className={`${styles.selectionStatus} text-body-sm ${styles.selectionStatusMissing}`}
            >
              {formTexts?.fields?.propertyManagerNotSelected || 'No manager selected'}
            </span>
          )}
          {showResults && !values.propertyManagerId && (
            <div className={styles.searchResults}>
              {managerLoading ? (
                <span className={`${styles.searchMeta} text-body-sm`}>
                  {formTexts?.fields?.propertyManagerLoading || 'Searching...'}
                </span>
              ) : managerResults.length === 0 ? (
                <span className={`${styles.searchMeta} text-body-sm`}>{managerEmptyLabel}</span>
              ) : (
                managerResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.searchItem}
                    onClick={() => {
                      setValues((prev) => ({ ...prev, propertyManagerId: item.id }));
                      const label = item.email ? `${item.name} • ${item.email}` : item.name;
                      setManagerQuery(label);
                      setShowResults(false);
                    }}
                  >
                    <span className={styles.searchName}>{item.name}</span>
                    <span className={`${styles.searchEmail} text-body-sm`}>
                      {item.email || '-'}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.objectNumber || 'Object number'}</span>
          <div className={styles.objectNumberGroup}>
            <input
              className={styles.objectNumberInput}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={objectNumberParts.left}
              onChange={(event) => {
                const nextLeft = event.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                const nextValue = nextLeft
                  ? `${nextLeft}${objectNumberParts.right ? `-${objectNumberParts.right}` : ''}`
                  : objectNumberParts.right;
                setValues((prev) => ({ ...prev, objectNumber: nextValue }));
                if (nextLeft.length === 4) {
                  requestAnimationFrame(() => {
                    objectNumberSuffixRef.current?.focus();
                  });
                }
              }}
              required
              aria-label={formTexts?.fields?.objectNumber || 'Object number'}
            />
            <span className={styles.objectNumberSeparator}>-</span>
            <input
              className={styles.objectNumberInput}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              ref={objectNumberSuffixRef}
              value={objectNumberParts.right}
              onChange={(event) => {
                const nextRight = event.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                const nextValue = objectNumberParts.left
                  ? `${objectNumberParts.left}-${nextRight}`
                  : nextRight
                  ? `-${nextRight}`
                  : '';
                setValues((prev) => ({ ...prev, objectNumber: nextValue }));
              }}
              required
              aria-label={formTexts?.fields?.objectNumber || 'Object number'}
            />
          </div>
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.street || 'Street'}</span>
          <input
            className={styles.inputField}
            name="street"
            value={values.street}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.streetNumber || 'Street number'}</span>
          <input
            className={styles.inputField}
            name="streetNumber"
            value={values.streetNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.postalCode || 'Postal code'}</span>
          <input
            className={styles.inputField}
            name="postalCode"
            value={values.postalCode}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.district || 'District'}</span>
          <input
            className={styles.inputField}
            name="district"
            value={values.district}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.entrancesCount || 'Entrances'}</span>
          <input
            className={styles.inputField}
            name="entrancesCount"
            value={values.entrancesCount}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.floorCount || 'Floors'}</span>
          <input
            className={styles.inputField}
            name="floorCount"
            value={values.floorCount}
            onChange={handleChange}
          />
        <label className={styles.field}>
          <span className="text-label">
            {formTexts?.fields?.preferredCleaningDay || 'Preferred cleaning day'}
          </span>
          <select
            className={styles.inputField}
            name="preferredCleaningDay"
            value={values.preferredCleaningDay}
            onChange={handleChange}
          >
            <option value="">
              {formTexts?.fields?.preferredCleaningDayPlaceholder || 'Select a day'}
            </option>
            <option value="Monday">{formTexts?.days?.monday || 'Monday'}</option>
            <option value="Tuesday">{formTexts?.days?.tuesday || 'Tuesday'}</option>
            <option value="Wednesday">{formTexts?.days?.wednesday || 'Wednesday'}</option>
            <option value="Thursday">{formTexts?.days?.thursday || 'Thursday'}</option>
            <option value="Friday">{formTexts?.days?.friday || 'Friday'}</option>
            <option value="Saturday">{formTexts?.days?.saturday || 'Saturday'}</option>
            <option value="Sunday">{formTexts?.days?.sunday || 'Sunday'}</option>
          </select>
        </label>
        </label>
        <label className={styles.field}>
          <span className="text-label">
            {formTexts?.fields?.preferredCleaningWindowDay || 'Preferred window cleaning day'}
          </span>
          <select
            className={styles.inputField}
            name="preferredCleaningWindowDay"
            value={values.preferredCleaningWindowDay}
            onChange={handleChange}
          >
            <option value="">
              {formTexts?.fields?.preferredCleaningWindowDayPlaceholder || 'Select a day'}
            </option>
            <option value="Monday">{formTexts?.days?.monday || 'Monday'}</option>
            <option value="Tuesday">{formTexts?.days?.tuesday || 'Tuesday'}</option>
            <option value="Wednesday">{formTexts?.days?.wednesday || 'Wednesday'}</option>
            <option value="Thursday">{formTexts?.days?.thursday || 'Thursday'}</option>
            <option value="Friday">{formTexts?.days?.friday || 'Friday'}</option>
            <option value="Saturday">{formTexts?.days?.saturday || 'Saturday'}</option>
            <option value="Sunday">{formTexts?.days?.sunday || 'Sunday'}</option>
          </select>
        </label>
        <label className={styles.field}>
          <span className="text-label">
            {formTexts?.fields?.cleaningSuppliesRoom || 'Cleaning supplies room'}
          </span>
          <textarea
            className={styles.textarea}
            name="cleaningSuppliesRoom"
            rows={3}
            value={values.cleaningSuppliesRoom}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.keyAccess || 'Key access'}</span>
          <textarea
            className={styles.textarea}
            name="keyAccess"
            rows={3}
            value={values.keyAccess}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.waterAccess || 'Water access'}</span>
          <textarea
            className={styles.textarea}
            name="waterAccess"
            rows={3}
            value={values.waterAccess}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.waterDisposal || 'Water disposal'}</span>
          <textarea
            className={styles.textarea}
            name="waterDisposal"
            rows={3}
            value={values.waterDisposal}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">
            {formTexts?.fields?.ladderAvailable || 'Ladder available'}
          </span>
          <textarea
            className={styles.textarea}
            name="ladderAvailable"
            rows={3}
            value={values.ladderAvailable}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">
            {formTexts?.fields?.electricityAccess || 'Electricity access'}
          </span>
          <textarea
            className={styles.textarea}
            name="electricityAccess"
            rows={3}
            value={values.electricityAccess}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">
            {formTexts?.fields?.lightBulbChangeRequired || 'Light bulb change'}
          </span>
          <textarea
            className={styles.textarea}
            name="lightBulbChangeRequired"
            rows={3}
            value={values.lightBulbChangeRequired}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.flooringType || 'Flooring type'}</span>
          <textarea
            className={styles.textarea}
            name="flooringType"
            rows={3}
            value={values.flooringType}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">
            {formTexts?.fields?.onSiteContact || 'On-site contact'}
          </span>
          <input
            className={styles.inputField}
            name="onSiteContact"
            value={values.onSiteContact}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.decisionMaker || 'Decision maker'}</span>
          <input
            className={styles.inputField}
            name="decisionMaker"
            value={values.decisionMaker}
            onChange={handleChange}
          />
        </label>
        <label className={`${styles.field} ${styles.notesField}`}>
          <span className="text-label">{formTexts?.fields?.cleaningInfo || 'Cleaning info'}</span>
          <textarea
            className={styles.textarea}
            name="cleaningInfo"
            rows={3}
            value={values.cleaningInfo}
            onChange={handleChange}
          />
        </label>
        <label className={`${styles.field} ${styles.notesField}`}>
          <span className="text-label">{formTexts?.fields?.notes || 'Notes'}</span>
          <textarea
            className={styles.textarea}
            name="notes"
            rows={3}
            value={values.notes}
            onChange={handleChange}
          />
        </label>
      </article>
      <aside className={styles.aside}>
        <button className={styles.ghostButton} type="button" onClick={onCancel}>
          {formTexts?.cancel || 'Cancel'}
        </button>
        <button className={styles.button} type="submit" disabled={loading}>
          {mode === 'create'
            ? formTexts?.submitCreate || 'Create object'
            : formTexts?.submitEdit || 'Save changes'}
        </button>
      </aside>
    </form>
  );
};

export default ObjectForm;
