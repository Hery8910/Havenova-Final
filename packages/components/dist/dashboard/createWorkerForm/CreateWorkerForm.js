'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styles from './CreateWorkerForm.module.css';
import { useClient } from '../../../contexts/ClientContext';
import { useI18n } from '../../../contexts/I18nContext';
import { AlertPopup } from '../../alertPopup/AlertPopup';
import { createWorker } from '../../../services/worker';
const CreateWorkerForm = () => {
    const { client } = useClient();
    const { language, texts } = useI18n();
    const popups = texts.popups;
    const [formData, setFormData] = useState({
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
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    function getRandomAvatarPath() {
        const number = Math.floor(Math.random() * 10) + 1;
        return `/avatars/avatar-${number}.svg`;
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleNestedChange = (e, section) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [section]: { ...prev[section], [name]: value },
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!client?._id)
            return;
        setLoading(true);
        setAlert(null);
        try {
            const payload = {
                ...formData,
                clientId: client._id,
                profileImage: getRandomAvatarPath(),
                employment: formData.employment?.type
                    ? {
                        type: formData.employment.type,
                        startDate: formData.employment.startDate,
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
                    description: popupData.description ||
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
        }
        catch (error) {
            if (error.response && error.response.data) {
                const errorKey = error.response.data.errorCode || error.response.data.code;
                const popupData = popups?.[errorKey] || {};
                setAlert({
                    type: 'error',
                    title: popupData.title || popups.GLOBAL_INTERNAL_ERROR.title,
                    description: popupData.description ||
                        error.response.data.message ||
                        popups.GLOBAL_INTERNAL_ERROR.description,
                });
            }
            else {
                setAlert({
                    type: 'error',
                    title: popups.GLOBAL_INTERNAL_ERROR.title,
                    description: popups.GLOBAL_INTERNAL_ERROR.description,
                });
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("section", { className: styles.container, children: [_jsxs("form", { onSubmit: handleSubmit, className: styles.form, children: [_jsx("h2", { children: "Crear Trabajador" }), _jsx("input", { type: "text", name: "name", placeholder: "Nombre", value: formData.name, onChange: handleChange, required: true }), _jsx("input", { type: "email", name: "email", placeholder: "Correo", value: formData.email, onChange: handleChange, required: true }), _jsx("input", { type: "tel", name: "phone", placeholder: "Tel\u00E9fono", value: formData.phone, onChange: handleChange }), _jsx("input", { type: "password", name: "password", placeholder: "Contrase\u00F1a (opcional)", value: formData.password, onChange: handleChange }), _jsxs("select", { name: "type", value: formData.employment?.type, onChange: (e) => handleNestedChange(e, 'employment'), children: [_jsx("option", { value: "EMPLOYEE", children: "Empleado" }), _jsx("option", { value: "CONTRACTOR", children: "Contratista" })] }), _jsx("input", { type: "date", name: "startDate", value: formData.employment?.startDate, onChange: (e) => handleNestedChange(e, 'employment') }), _jsx("input", { type: "date", name: "endDate", value: formData.employment?.endDate, onChange: (e) => handleNestedChange(e, 'employment') }), _jsxs("select", { name: "type", value: formData.pay?.type, onChange: (e) => handleNestedChange(e, 'pay'), children: [_jsx("option", { value: "HOURLY", children: "Por hora" }), _jsx("option", { value: "SALARIED", children: "Salario mensual" })] }), formData.pay?.type === 'HOURLY' && (_jsx("input", { type: "number", name: "hourlyRate", placeholder: "Tarifa por hora", value: formData.pay.hourlyRate || '', onChange: (e) => handleNestedChange(e, 'pay') })), formData.pay?.type === 'SALARIED' && (_jsx("input", { type: "number", name: "monthlySalary", placeholder: "Salario mensual", value: formData.pay.monthlySalary || '', onChange: (e) => handleNestedChange(e, 'pay') })), _jsxs("select", { name: "language", value: formData.language, onChange: handleChange, children: [_jsx("option", { value: "de", children: "Deutsch" }), _jsx("option", { value: "en", children: "English" })] }), _jsx("button", { type: "submit", disabled: loading, children: loading ? 'Creando...' : 'Crear trabajador' })] }), alert && (_jsx(AlertPopup, { type: alert.type, title: alert.title, description: alert.description, onClose: () => setAlert(null) }))] }));
};
export default CreateWorkerForm;
