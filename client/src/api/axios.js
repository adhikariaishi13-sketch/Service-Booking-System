import axios from 'axios';

// In production, call the deployed Express API directly.
// In local development, use Vite's /api proxy.
const API_BASE_URL = import.meta.env.PROD
  ? 'https://service-booking-system-api.onrender.com/api'
  : '/api';

const api = axios.create({ baseURL: API_BASE_URL });

// Attach the JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turns any error into a readable message
export const getError = (err) => err.response?.data?.message || err.message || 'Something went wrong';

export default api;
