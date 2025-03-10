import api from '../utils/api';

// Funciones para comunicación con los endpoints de grupos
const GroupsAPI = {
  // Crear un nuevo grupo
  createGroup: async (name, description = '') => {
    const response = await api.post('/groups', { name, description });
    return response.data;
  },
  
  // Obtener todos los grupos
  getGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },
  
  // Obtener un grupo por ID
  getGroupById: async (groupId) => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },
  
  // Obtener mensajes de un grupo
  getGroupMessages: async (groupId) => {
    const response = await api.get(`/groups/${groupId}/messages`);
    return response.data;
  }
};

export default GroupsAPI;
