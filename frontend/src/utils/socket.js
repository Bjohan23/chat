import { io } from 'socket.io-client';
import { getToken } from './tokenUtils';

let socket = null;

// Función para inicializar y obtener la conexión del socket
export const getSocket = () => {
  if (!socket) {
    // Crear una nueva conexión si no existe
    const token = getToken();
    
    socket = io('http://localhost:3000', {
      auth: {
        token: token || ''
      }
    });
    
    // Configurar eventos básicos
    socket.on('connect', () => {
      console.log('Conectado al servidor de WebSockets');
    });
    
    socket.on('disconnect', () => {
      console.log('Desconectado del servidor de WebSockets');
    });
    
    socket.on('error', (error) => {
      console.error('Error de WebSocket:', error);
    });
  }
  
  return socket;
};

// Desconectar el socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Actualizar el token de autenticación en el socket
export const updateSocketAuth = (token) => {
  if (socket) {
    socket.auth = { token };
    socket.disconnect().connect();
  }
};
