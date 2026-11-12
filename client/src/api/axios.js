import axios from 'axios';

// All requests go to /api (forwarded to Express by the Vite proxy in development)
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach the JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turns any error into a readable message
export const getError = (err) => err.response?.data?.message || err.message || 'Something went wrong';

export default api;
