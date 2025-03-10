// Almacenamiento en memoria para grupos
const groups = [];
let nextId = 1;

// Almacenamiento en memoria para mensajes (temporales)
const messages = {};

// Almacenamiento en memoria para archivos multimedia (temporales)
const mediaFiles = {};
let mediaIdCounter = 1;

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
    mediaFiles[group.id] = {}; // Inicializar objeto de archivos multimedia para este grupo
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
      timestamp: new Date(),
      // Campos nuevos para soporte multimedia
      type: messageData.type || 'text', // 'text', 'image', 'video', 'audio'
      mediaId: messageData.mediaId || null,
      fileName: messageData.fileName || null,
      fileType: messageData.fileType || null,
      fileSize: messageData.fileSize || null
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
  },

  // Guardar archivo multimedia (en memoria)
  saveMediaFile: (groupId, fileData, fileType, fileName, userId) => {
    if (!mediaFiles[groupId]) {
      mediaFiles[groupId] = {};
    }

    const mediaId = `media_${Date.now()}_${mediaIdCounter++}`;
    
    // Guardar el archivo en memoria
    mediaFiles[groupId][mediaId] = {
      id: mediaId,
      data: fileData, // Buffer o string base64
      type: fileType,
      name: fileName,
      userId: userId,
      timestamp: new Date(),
      size: fileData.length
    };
    
    // Eliminar archivos más antiguos si hay demasiados (máximo 50 por grupo)
    const mediaIds = Object.keys(mediaFiles[groupId]);
    if (mediaIds.length > 50) {
      const oldestId = mediaIds[0];
      delete mediaFiles[groupId][oldestId];
    }
    
    return mediaId;
  },

  // Obtener archivo multimedia
  getMediaFile: (groupId, mediaId) => {
    if (!mediaFiles[groupId] || !mediaFiles[groupId][mediaId]) {
      return null;
    }
    
    return mediaFiles[groupId][mediaId];
  }
};

module.exports = Group;