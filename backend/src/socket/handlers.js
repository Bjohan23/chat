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
      username: socket.user.username
    });
    
    // Emitir mensaje a todos los miembros del grupo
    io.to(`group:${groupId}`).emit('newMessage', {
      groupId,
      message
    });
  });
  
  // Manejo de desconexión
  socket.on('disconnect', () => {
    console.log(`Cliente ${socket.id} desconectado`);
  });
};

module.exports = socketHandlers;