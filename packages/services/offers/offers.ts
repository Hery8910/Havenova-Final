import { Offer, OfferDB } from '../types/offers';
import api from './api/api';

//  Crear una nueva oferta
export const createOffer = async (offer: Offer) => {
  const response = await api.post('/api/offers', offer);
  return response.data;
};

//  Editar una oferta existente
export const updateOffer = async (offerId: string, updates: Partial<Offer>) => {
  const response = await api.put(`/api/offers/${offerId}`, updates);
  return response.data;
};

//  Eliminar una oferta
export const deleteOffer = async (offerId: string) => {
  const response = await api.delete(`/api/offers/${offerId}`);
  return response.data;
};

//  Obtener todas las ofertas
export const getAllOffers = async () => {
  const response = await api.get('/api/offers');
  return response.data.offers as OfferDB[];
};
export const getActiveOffers = async () => {
  const response = await api.get('/api/offers/active');
  return response.data.offers as OfferDB[];
};
