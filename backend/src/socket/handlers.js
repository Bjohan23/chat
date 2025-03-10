const Group = require('../models/group');
const User = require('../models/user');

// Manejadores de eventos de socket
const socketHandlers = (io, socket) => {
  // Unirse a un grupo
  socket.on('joinGroup', (groupId) => {
    const group = Group.findById(parseInt(groupId));
    
    if (group) {
      socket.join(`group:${groupId}`);
      console.log(`Cliente ${socket.id} se unió al grupo ${groupId}`);
      
      // Enviar historial de mensajes al cliente
      const messages = Group.getMessages(parseInt(groupId));
      socket.emit('groupHistory', { groupId, messages });
    }
  });
  
  // Abandonar un grupo
  socket.on('leaveGroup', (groupId) => {
    socket.leave(`group:${groupId}`);
    console.log(`Cliente ${socket.id} abandonó el grupo ${groupId}`);
  });
  
  // Enviar mensaje a un grupo
  socket.on('sendMessage', (data) => {
    const { groupId, text } = data;
    
    // Verificar autenticación
    if (!socket.auth) {
      socket.emit('error', { message: 'Debes iniciar sesión para enviar mensajes' });
      return;
    }
    
    const group = Group.findById(parseInt(groupId));
    if (!group) {
      socket.emit('error', { message: 'Grupo no encontrado' });
      return;
    }
    
    // Añadir mensaje al grupo
    const message = Group.addMessage(parseInt(groupId), {
      text,
      userId: socket.user.id,
      username: socket.user.username,
      type: 'text'
    });
    
    // Emitir mensaje a todos los miembros del grupo
    io.to(`group:${groupId}`).emit('newMessage', {
      groupId,
      message
    });
  });

  // Manejar envío de archivos multimedia
  socket.on('sendMediaMessage', (data) => {
    const { groupId, fileData, fileType, fileName, messageText } = data;
    
    // Verificar autenticación
    if (!socket.auth) {
      socket.emit('error', { message: 'Debes iniciar sesión para enviar archivos' });
      return;
    }
    
    const group = Group.findById(parseInt(groupId));
    if (!group) {
      socket.emit('error', { message: 'Grupo no encontrado' });
      return;
    }

    try {
      // Determinar el tipo de mensaje basado en el tipo de archivo
      let messageType = 'file';
      if (fileType.startsWith('image/')) messageType = 'image';
      else if (fileType.startsWith('video/')) messageType = 'video';
      else if (fileType.startsWith('audio/')) messageType = 'audio';
      
      // Guardar el archivo en memoria
      const mediaId = Group.saveMediaFile(
        parseInt(groupId),
        fileData, // Base64 string
        fileType,
        fileName,
        socket.user.id
      );
      
      // Añadir mensaje con referencia al archivo
      const message = Group.addMessage(parseInt(groupId), {
        text: messageText || fileName,
        userId: socket.user.id,
        username: socket.user.username,
        type: messageType,
        mediaId,
        fileName,
        fileType,
        fileSize: fileData.length
      });
      
      // Emitir mensaje a todos los miembros del grupo
      io.to(`group:${groupId}`).emit('newMessage', {
        groupId,
        message
      });
      
    } catch (error) {
      console.error('Error al procesar archivo multimedia:', error);
      socket.emit('error', { message: 'Error al procesar el archivo' });
    }
  });
  
  // Manejo de desconexión
  socket.on('disconnect', () => {
    console.log(`Cliente ${socket.id} desconectado`);
  });
};

module.exports = socketHandlers;