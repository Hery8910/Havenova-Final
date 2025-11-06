'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  getRequestItemsFromStorage,
  saveRequestItemToStorage,
  removeRequestItemFromStorage,
  clearAllRequestItemsFromStorage,
} from '../../utils/serviceRequest';
import { ServiceRequestItem } from '../../types';

interface ServiceCartContextType {
  items: ServiceRequestItem[];
  addItem: (item: ServiceRequestItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  reload: () => void;
  totalCount: number;
}

const ServiceCartContext = createContext<ServiceCartContextType | undefined>(undefined);

export const ServiceCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ServiceRequestItem[]>([]);

  const reload = useCallback(() => {
    const stored = getRequestItemsFromStorage();
    setItems(stored);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addItem = useCallback(
    (item: ServiceRequestItem) => {
      saveRequestItemToStorage(item);
      reload();
    },
    [reload]
  );

  const removeItem = useCallback(
    (id: string) => {
      removeRequestItemFromStorage(id);
      reload();
    },
    [reload]
  );

  const clear = useCallback(() => {
    clearAllRequestItemsFromStorage();
    setItems([]);
  }, []);

  const totalCount = items.length;

  return (
    <ServiceCartContext.Provider value={{ items, addItem, removeItem, clear, reload, totalCount }}>
      {children}
    </ServiceCartContext.Provider>
  );
};

export const useServiceCart = () => {
  const context = useContext(ServiceCartContext);
  if (!context) {
    throw new Error('useServiceCart must be used within a ServiceCartProvider');
  }
  return context;
};
