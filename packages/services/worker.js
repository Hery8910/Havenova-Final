import api from './api';
export const createWorker = async (payload) => {
    const response = await api.post('/api/workers/create', payload);
    return response.data;
};
