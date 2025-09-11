import api from './api';
// REGISTER
export const registerUser = async (payload) => {
    const response = await api.post('/api/users/register', payload);
    return response.data;
};
// LOGIN
export const loginUser = async (payload) => {
    const response = await api.post('/api/users/login', payload);
    return response.data;
};
// UPDATE USER
export const updateUser = async (payload) => {
    const response = await api.post('/api/users/update-user', payload);
    return response.data;
};
// UPDATE PASSWORD
export const chagePassword = async (payload) => {
    const response = await api.post('/api/users/update-password', payload);
    return response.data;
};
// FORGOT PASSWORD
export const forgotPassword = async (payload) => {
    const response = await api.post('/api/users/forgot-password', payload);
    return response.data;
};
// RESET PASSWORD
export const resetPassword = async (payload) => {
    const response = await api.post('/api/users/reset-password', payload);
    return response.data;
};
// LOGOUT
export const logoutUser = async () => {
    const response = await api.post('/api/users/logout', {}, {
        withCredentials: true,
    });
    return response.data;
};
// GET USER PROFILE
export const getUser = async (clientId) => {
    let url = `/api/users/profile?clientId=${clientId}`;
    const response = await api.get(url);
    return response.data;
};
// RESEND VERIFICATION
export const resendVerificationEmail = async (payload) => {
    const response = await api.post('/api/users/resend-verification', { payload });
    return response.data;
};
