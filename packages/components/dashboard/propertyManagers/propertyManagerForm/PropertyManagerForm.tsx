'use client';

import { useEffect, useState } from 'react';
import styles from './PropertyManagerForm.module.css';
import type {
  PropertyManagerContactMethod,
  PropertyManagerStatus,
} from '@/packages/types/propertyManager';
import { useI18n } from '../../../../contexts';

export interface PropertyManagerFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  status: PropertyManagerStatus;
  preferredContactMethod: PropertyManagerContactMethod;
  notes: string;
}

interface PropertyManagerFormProps {
  mode: 'create' | 'edit';
  initialValues: PropertyManagerFormValues;
  loading: boolean;
  onSubmit: (values: PropertyManagerFormValues) => void;
  onCancel: () => void;
}

const PropertyManagerForm = ({
  mode,
  initialValues,
  loading,
  onSubmit,
  onCancel,
}: PropertyManagerFormProps) => {
  const { texts } = useI18n();
  const formTexts = texts.components?.dashboard?.pages?.propertyManagers?.form;

  const [values, setValues] = useState<PropertyManagerFormValues>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

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
            ? formTexts?.createTitle || 'Create property manager'
            : formTexts?.editTitle || 'Edit property manager'}
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
          <span className="text-label">{formTexts?.fields?.name || 'Name'}</span>
          <input
            className={styles.inputField}
            name="name"
            value={values.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.email || 'Email'}</span>
          <input
            className={styles.inputField}
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.phone || 'Phone'}</span>
          <input
            className={styles.inputField}
            name="phone"
            value={values.phone}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">{formTexts?.fields?.address || 'Address'}</span>
          <input
            className={styles.inputField}
            name="address"
            value={values.address}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          <span className="text-label">
            {formTexts?.fields?.preferredContactMethod || 'Preferred contact'}
          </span>
          <select
            className={styles.inputField}
            name="preferredContactMethod"
            value={values.preferredContactMethod}
            onChange={handleChange}
          >
            <option value="email">{formTexts?.contactOptions?.email || 'Email'}</option>
            <option value="phone">{formTexts?.contactOptions?.phone || 'Phone'}</option>
            <option value="none">{formTexts?.contactOptions?.none || 'No preference'}</option>
          </select>
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
            ? formTexts?.submitCreate || 'Create manager'
            : formTexts?.submitEdit || 'Save changes'}
        </button>
      </aside>
    </form>
  );
};

export default PropertyManagerForm;
