import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

// Hook personalizado para acceder al contexto del socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket debe ser usado dentro de un SocketProvider');
  }
  
  return context;
};
