// Almacenamiento en memoria para grupos
const groups = [];
let nextId = 1;

// Almacenamiento en memoria para mensajes (temporales)
const messages = {};

const Group = {
  // Crear un grupo
  create: (groupData) => {
    const group = {
      id: nextId++,
      name: groupData.name,
      description: groupData.description,
      createdBy: groupData.userId,
      createdAt: new Date()
    };
    groups.push(group);
    messages[group.id] = []; // Inicializar array de mensajes para este grupo
    return group;
  },

  // Encontrar un grupo por ID
  findById: (id) => {
    return groups.find(group => group.id === id);
  },

  // Listar todos los grupos
  list: () => {
    return groups;
  },

  // Añadir un mensaje a un grupo
  addMessage: (groupId, messageData) => {
    const message = {
      id: messages[groupId].length + 1,
      text: messageData.text,
      userId: messageData.userId,
      username: messageData.username,
      timestamp: new Date()
    };
    
    if (messages[groupId]) {
      messages[groupId].push(message);
      // Limitar a los últimos 100 mensajes por grupo (para gestionar la memoria)
      if (messages[groupId].length > 100) {
        messages[groupId] = messages[groupId].slice(-100);
      }
    }
    
    return message;
  },

  // Obtener mensajes de un grupo
  getMessages: (groupId) => {
    return messages[groupId] || [];
  }
};

module.exports = Group;