import React, { createContext, useEffect, useState } from 'react';
import { getSocket, disconnectSocket } from '../utils/socket';
import { useAuth } from '../hooks/useAuth';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [authStatus, setAuthStatus] = useState({ authenticated: false, user: null });

  useEffect(() => {
    // Inicializar socket
    const socketInstance = getSocket();
    setSocket(socketInstance);

    // Configurar eventos
    socketInstance.on('connect', () => {
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    socketInstance.on('authStatus', (status) => {
      setAuthStatus(status);
    });

    // Limpiar al desmontar
    return () => {
      disconnectSocket();
    };
  }, []);

  // Unirse a un grupo
  const joinGroup = (groupId) => {
    if (socket && connected) {
      socket.emit('joinGroup', groupId);
    }
  };

  // Abandonar un grupo
  const leaveGroup = (groupId) => {
    if (socket && connected) {
      socket.emit('leaveGroup', groupId);
    }
  };

  // Enviar mensaje de texto a un grupo
  const sendMessage = (groupId, text) => {
    if (socket && connected) {
      if (!isAuthenticated) {
        return { success: false, error: 'Debes iniciar sesión para enviar mensajes' };
      }
      
      socket.emit('sendMessage', { groupId, text });
      return { success: true };
    }
    
    return { success: false, error: 'No hay conexión con el servidor' };
  };

  // Enviar mensaje multimedia a un grupo
  const sendMediaMessage = (groupId, mediaData) => {
    if (socket && connected) {
      if (!isAuthenticated) {
        return { success: false, error: 'Debes iniciar sesión para enviar archivos' };
      }
      
      socket.emit('sendMediaMessage', { groupId, ...mediaData });
      return { success: true };
    }
    
    return { success: false, error: 'No hay conexión con el servidor' };
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        authStatus,
        joinGroup,
        leaveGroup,
        sendMessage,
        sendMediaMessage
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};