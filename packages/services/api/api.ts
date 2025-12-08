import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error('❌ NEXT_PUBLIC_API_URL is not defined ');
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
