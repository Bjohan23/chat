const socketAuth = require('../middlewares/socketAuth');
const socketHandlers = require('./handlers');

// Configuración de Socket.IO
const setupSocket = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*', // En producción, cambia esto por tu dominio específico
      methods: ['GET', 'POST']
    }
  });
  
  // Middleware de autenticación para sockets
  io.use(socketAuth);
  
  // Evento de conexión
  io.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    
    // Informar al cliente de su estado de autenticación
    socket.emit('authStatus', { 
      authenticated: socket.auth,
      user: socket.auth ? socket.user : null
    });
    
    // Configurar manejadores de eventos
    socketHandlers(io, socket);
  });
  
  return io;
};

module.exports = setupSocket;