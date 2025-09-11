'use client';

import { useState } from 'react';

import styles from './CreateWorkerForm.module.css';
import { useClient } from '../../../contexts/ClientContext';
import { useI18n } from '../../../contexts/I18nContext';
import { AlertPopup } from '../../alertPopup/AlertPopup';
import { createWorker } from '../../../services/worker';
import { CreateWorkerPayload } from '../../../types/worker';

type FormState = Omit<CreateWorkerPayload, 'clientId'>;

const CreateWorkerForm = () => {
  const { client } = useClient();
  const { language, texts } = useI18n();
  const popups = texts.popups;

  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    password: '',
    roles: ['INSPECTOR'],
    employment: {
      type: 'EMPLOYEE',
      startDate: new Date().toISOString().split('T')[0],
      endDate: undefined,
    },
    pay: { type: 'HOURLY', currency: 'EUR', hourlyRate: 0 },
    language: language || 'de',
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

  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: string
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!client?._id) return;

    setLoading(true);
    setAlert(null);

    try {
      const payload: CreateWorkerPayload = {
        ...formData,
        clientId: client._id,
        profileImage: getRandomAvatarPath(),
        employment: formData.employment?.type
          ? {
              type: formData.employment.type as 'EMPLOYEE' | 'CONTRACTOR',
              startDate: formData.employment.startDate!,
              endDate: formData.employment.endDate || undefined,
            }
          : undefined,
      };

      const response = await createWorker(payload);
      if (response.success) {
        const popupData = popups?.[response.code] || {};
        setAlert({
          type: 'success',
          title: popupData.title || 'Registrierung erfolgreich!',
          description:
            popupData.description ||
            'Bitte überprüfen Sie Ihre E-Mails, um Ihre Adresse zu bestätigen und Ihr Konto zu aktivieren.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          profileImage: '',
          password: '',
          roles: ['INSPECTOR'],
          employment: {
            type: 'EMPLOYEE',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
          },
          pay: { type: 'HOURLY', currency: 'EUR', hourlyRate: 0 },
          language: language || 'de',
        });
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const errorKey = error.response.data.errorCode || error.response.data.code;
        const popupData = popups?.[errorKey] || {};
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
          type="password"
          name="password"
          placeholder="Contraseña (opcional)"
          value={formData.password}
          onChange={handleChange}
        />

        <select
          name="type"
          value={formData.employment?.type}
          onChange={(e) => handleNestedChange(e, 'employment')}
        >
          <option value="EMPLOYEE">Empleado</option>
          <option value="CONTRACTOR">Contratista</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={formData.employment?.startDate}
          onChange={(e) => handleNestedChange(e, 'employment')}
        />

        <input
          type="date"
          name="endDate"
          value={formData.employment?.endDate}
          onChange={(e) => handleNestedChange(e, 'employment')}
        />

        <select
          name="type"
          value={formData.pay?.type}
          onChange={(e) => handleNestedChange(e, 'pay')}
        >
          <option value="HOURLY">Por hora</option>
          <option value="SALARIED">Salario mensual</option>
        </select>

        {formData.pay?.type === 'HOURLY' && (
          <input
            type="number"
            name="hourlyRate"
            placeholder="Tarifa por hora"
            value={formData.pay.hourlyRate || ''}
            onChange={(e) => handleNestedChange(e, 'pay')}
          />
        )}

        {formData.pay?.type === 'SALARIED' && (
          <input
            type="number"
            name="monthlySalary"
            placeholder="Salario mensual"
            value={formData.pay.monthlySalary || ''}
            onChange={(e) => handleNestedChange(e, 'pay')}
          />
        )}

        <select name="language" value={formData.language} onChange={handleChange}>
          <option value="de">Deutsch</option>
          <option value="en">English</option>
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
          onClose={() => setAlert(null)}
        />
      )}
    </section>
  );
};

export default CreateWorkerForm;
