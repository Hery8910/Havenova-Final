'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import type {
  PropertyManagerContactMethod,
  PropertyManagerStatus,
} from '@/packages/types/propertyManager';
import { useI18n } from '@/packages/contexts';

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
      <div>
        <h2 className={styles.formTitle}>
          {mode === 'create'
            ? formTexts?.createTitle || 'Create property manager'
            : formTexts?.editTitle || 'Edit property manager'}
        </h2>
        <p className={styles.formSubtitle}>
          {mode === 'create'
            ? formTexts?.createSubtitle || 'Add a new manager and assign buildings later.'
            : formTexts?.editSubtitle || 'Update the manager details and status.'}
        </p>
      </div>
      <div className={styles.formGrid}>
        <label className={styles.field}>
          {formTexts?.fields?.name || 'Name'}
          <input
            className={styles.inputField}
            name="name"
            value={values.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.field}>
          {formTexts?.fields?.email || 'Email'}
          <input
            className={styles.inputField}
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          {formTexts?.fields?.phone || 'Phone'}
          <input
            className={styles.inputField}
            name="phone"
            value={values.phone}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          {formTexts?.fields?.address || 'Address'}
          <input
            className={styles.inputField}
            name="address"
            value={values.address}
            onChange={handleChange}
          />
        </label>
        <label className={styles.field}>
          {formTexts?.fields?.status || 'Status'}
          <select
            className={styles.inputField}
            name="status"
            value={values.status}
            onChange={handleChange}
          >
            <option value="active">{formTexts?.statusOptions?.active || 'Active'}</option>
            <option value="inactive">{formTexts?.statusOptions?.inactive || 'Inactive'}</option>
          </select>
        </label>
        <label className={styles.field}>
          {formTexts?.fields?.preferredContactMethod || 'Preferred contact'}
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
          {formTexts?.fields?.notes || 'Notes'}
          <textarea
            className={styles.textarea}
            name="notes"
            rows={3}
            value={values.notes}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className={styles.formActions}>
        <button className={styles.button} type="submit" disabled={loading}>
          {mode === 'create'
            ? formTexts?.submitCreate || 'Create manager'
            : formTexts?.submitEdit || 'Save changes'}
        </button>
        <button className={styles.ghostButton} type="button" onClick={onCancel}>
          {formTexts?.cancel || 'Cancel'}
        </button>
      </div>
    </form>
  );
};

export default PropertyManagerForm;
