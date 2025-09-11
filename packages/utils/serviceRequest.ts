import { ServiceRequestItem } from '../types/services';

export const saveRequestItemToStorage = (item: ServiceRequestItem) => {
  try {
    const existing = localStorage.getItem('service_request_items');
    const items = existing ? JSON.parse(existing) : [];
    const updated = [...items, item];

    localStorage.setItem('service_request_items', JSON.stringify(updated));
  } catch (err) {
    console.error('❌ Error saving service item to localStorage', err);
  }
};

export const getRequestItemsFromStorage = (): ServiceRequestItem[] => {
  try {
    const stored = localStorage.getItem('service_request_items');
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('❌ Error reading service items from localStorage', err);
    return [];
  }
};

export const getRequestsByType = <T extends ServiceRequestItem>(
  all: ServiceRequestItem[],
  type: T['serviceType']
): T[] => {
  return all.filter((req): req is T => req.serviceType === type);
};

export const removeRequestItemFromStorage = (index: number) => {
  try {
    const stored = localStorage.getItem('service_request_items');
    if (!stored) return;

    const items = JSON.parse(stored);
    if (!Array.isArray(items)) return;

    const updated = items.filter((_, i) => i !== index);
    localStorage.setItem('service_request_items', JSON.stringify(updated));
  } catch (err) {
    console.error('❌ Error removing item from storage', err);
  }
};

export const clearAllRequestItemsFromStorage = () => {
  try {
    localStorage.removeItem('service_request_items');
  } catch (err) {
    console.error('❌ Error clearing service items from storage', err);
  }
};

// utils/requestItemHelpers.ts

export const addItem = (
  items: ServiceRequestItem[],
  newItem: ServiceRequestItem
): ServiceRequestItem[] => [...items, newItem];

export const removeItem = (items: ServiceRequestItem[], index: number): ServiceRequestItem[] =>
  items.filter((_, i) => i !== index);

export const clearItems = (): ServiceRequestItem[] => [];
