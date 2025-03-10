const { verifyToken } = require('../config/jwt');
const User = require('../models/user');

// Middleware para autenticación en WebSockets
const socketAuth = (socket, next) => {
  // Obtener token de la query o headers
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  
  if (!token) {
    // No hay token, pero permitimos conexión para lectura solamente
    socket.auth = false;
    return next();
  }

  const userData = verifyToken(token);
  
  if (!userData) {
    socket.auth = false;
    return next();
  }
  
  // Verificar que el usuario existe
  const user = User.findById(userData.id);
  if (!user) {
    socket.auth = false;
    return next();
  }
  
  // Autenticación exitosa
  socket.auth = true;
  socket.user = userData;
  next();
};

module.exports = socketAuth;