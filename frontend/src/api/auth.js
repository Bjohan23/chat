import api from '../utils/api';

// Funciones para comunicación con los endpoints de autenticación
const AuthAPI = {
  // Registrar un nuevo usuario
  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },
  
  // Iniciar sesión
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  // Obtener información del usuario actual
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default AuthAPI;
