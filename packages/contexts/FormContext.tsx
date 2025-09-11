'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Estructura de datos del formulario global
interface FormData {
  serviceType: string;
  preferredDate: string;
  address: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  serviceDetails: Record<string, any>; // Detalles específicos según el servicio
}

interface FormContextType {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  updateDetails: (key: string, value: any) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const defaultData: FormData = {
  serviceType: '',
  preferredDate: '',
  address: '',
  user: {
    name: '',
    email: '',
    phone: '',
    address: '',
  },
  serviceDetails: {},
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormDataState] = useState<FormData>(defaultData);

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const updateDetails = (key: string, value: any) => {
    setFormDataState((prev) => ({
      ...prev,
      serviceDetails: {
        ...prev.serviceDetails,
        [key]: value,
      },
    }));
  };

  return (
    <FormContext.Provider value={{ formData, setFormData, updateDetails }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within a FormProvider');
  return context;
}
