import { ServiceOrder } from '../types/services';

export const addRequest = (requests: ServiceOrder[], newRequest: ServiceOrder): ServiceOrder[] => {
  return [...requests, newRequest];
};

export const updateRequest = (
  requests: ServiceOrder[],
  updatedRequest: ServiceOrder
): ServiceOrder[] => {
  return requests.map((req) =>
    req.id === updatedRequest.id ? { ...req, ...updatedRequest } : req
  );
};

export const removeRequest = (requests: ServiceOrder[], requestId: string): ServiceOrder[] => {
  return requests.filter((req) => req.id !== requestId);
};

export const clearRequests = (): ServiceOrder[] => {
  return [];
};
