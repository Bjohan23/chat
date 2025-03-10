import axios from 'axios';
import { getToken } from './tokenUtils';

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Ajusta esta URL según tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
