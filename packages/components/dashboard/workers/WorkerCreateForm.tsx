'use client';

import { useMemo, useState } from 'react';
import styles from './WorkerCreateForm.module.css';
import { useClient } from '../../../contexts/client/ClientContext';
import { useI18n } from '../../../contexts/i18n/I18nContext';
import AlertPopup from '../../alert/alertPopup/AlertPopup';
import { createWorkerProfile } from '../../../services/worker';
import type { CreateWorkerProfilePayload, WorkerRecord } from '../../../types/worker/workerTypes';

interface WorkerCreateFormProps {
  title?: string;
  onCreated?: (worker: WorkerRecord) => void;
}

type FormState = Omit<CreateWorkerProfilePayload, 'clientId'>;

const WorkerCreateForm = ({ title = 'Crear trabajador', onCreated }: WorkerCreateFormProps) => {
  const { client } = useClient();
  const { language } = useI18n();
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const initialFormState = useMemo<FormState>(
    () => ({
      name: '',
      email: '',
      phone: '',
      address: '',
      profileImage: '',
      language: language || 'de',
      theme: 'light',
    }),
    [language]
  );

  const [formData, setFormData] = useState<FormState>(initialFormState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cleanValue = (value?: string) => {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client?._id) return;

    setLoading(true);
    setAlert(null);

    try {
      const payload: CreateWorkerProfilePayload = {
        clientId: client._id,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: cleanValue(formData.phone),
        address: cleanValue(formData.address),
        profileImage: cleanValue(formData.profileImage),
        language: formData.language || undefined,
        theme: formData.theme || undefined,
      };

      const worker = await createWorkerProfile(payload);
      setAlert({
        type: 'success',
        title: 'Trabajador creado',
        description: 'El perfil fue creado correctamente.',
      });
      setFormData(initialFormState);
      onCreated?.(worker);
    } catch (error: any) {
      setAlert({
        type: 'error',
        title: 'No se pudo crear el trabajador',
        description: 'Intenta de nuevo o revisa los datos ingresados.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <p className="text-label">Nuevo trabajador</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>
          Completa la informacion basica para registrar un trabajador nuevo.
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span className="text-label">Nombre</span>
            <input
              className={styles.input}
              name="name"
              type="text"
              required
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label className={styles.field}>
            <span className="text-label">Email</span>
            <input
              className={styles.input}
              name="email"
              type="email"
              required
              placeholder="correo@empresa.com"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span className="text-label">Telefono</span>
            <input
              className={styles.input}
              name="phone"
              type="tel"
              placeholder="Opcional"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
          <label className={styles.field}>
            <span className="text-label">Direccion</span>
            <input
              className={styles.input}
              name="address"
              type="text"
              placeholder="Opcional"
              value={formData.address}
              onChange={handleChange}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span className="text-label">Foto de perfil (URL)</span>
          <input
            className={styles.input}
            name="profileImage"
            type="url"
            placeholder="https://"
            value={formData.profileImage}
            onChange={handleChange}
          />
        </label>

        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span className="text-label">Idioma</span>
            <select
              className={styles.input}
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className="text-label">Tema</span>
            <select
              className={styles.input}
              name="theme"
              value={formData.theme}
              onChange={handleChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>

        <div className={styles.actions}>
          <button className="button" type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear trabajador'}
          </button>
        </div>
      </form>

      {alert && (
        <AlertPopup
          type={alert.type}
          title={alert.title}
          description={alert.description}
          cancelLabel="Cerrar"
          onCancel={() => setAlert(null)}
        />
      )}
    </section>
  );
};

export default WorkerCreateForm;
