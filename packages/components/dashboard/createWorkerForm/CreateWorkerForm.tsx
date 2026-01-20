'use client';

import { useState } from 'react';

import styles from './CreateWorkerForm.module.css';
import { useClient } from '../../../contexts/client/ClientContext';
import { useI18n } from '../../../contexts/i18n/I18nContext';
import AlertPopup from '../../alert/alertPopup/AlertPopup';
import { createWorkerProfile } from '../../../services/worker';
import { CreateWorkerProfilePayload } from '../../../types/worker/workerTypes';

type FormState = Omit<CreateWorkerProfilePayload, 'clientId'>;

const CreateWorkerForm = () => {
  const { client } = useClient();
  const { language, texts } = useI18n();
  const popups = texts.popups;

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    address: '',
    jobTitle: '',
    language: language || 'de',
    theme: 'light',
  });

  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    title: string;
    description: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function getRandomAvatarPath(): string {
    const number = Math.floor(Math.random() * 10) + 1;
    return `/avatars/avatar-${number}.svg`;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const cleanValue = (value?: string) => {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
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
        jobTitle: cleanValue(formData.jobTitle),
        profileImage: cleanValue(formData.profileImage) ?? getRandomAvatarPath(),
        language: formData.language || undefined,
        theme: formData.theme || undefined,
      };

      await createWorkerProfile(payload);
      const popupData = popups?.WORKER_CREATED || {};
      setAlert({
        type: 'success',
        title: popupData.title || 'Mitarbeiter erstellt',
        description:
          popupData.description || 'Der Mitarbeiter wurde erfolgreich erstellt.',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        profileImage: '',
        address: '',
        jobTitle: '',
        language: language || 'de',
        theme: 'light',
      });
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode || error.response.data.code;
        const popupData = errorKey ? (popups as Record<string, any>)?.[errorKey] || {} : {};
        setAlert({
          type: 'error',
          title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
          description:
            popupData.description ||
            error.response.data.message ||
            popups.GLOBAL_INTERNAL_ERROR.description,
        });
      } else {
        setAlert({
          type: 'error',
          title: popups.GLOBAL_INTERNAL_ERROR.title,
          description: popups.GLOBAL_INTERNAL_ERROR.description,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Crear Trabajador</h2>

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="jobTitle"
          placeholder="Cargo (opcional)"
          value={formData.jobTitle}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={formData.address}
          onChange={handleChange}
        />

        <input
          type="url"
          name="profileImage"
          placeholder="Foto de perfil (URL)"
          value={formData.profileImage}
          onChange={handleChange}
        />

        <select name="language" value={formData.language} onChange={handleChange}>
          <option value="de">Deutsch</option>
          <option value="en">English</option>
        </select>

        <select name="theme" value={formData.theme} onChange={handleChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear trabajador'}
        </button>
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

export default CreateWorkerForm;
