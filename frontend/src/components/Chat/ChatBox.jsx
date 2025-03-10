import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import GroupsAPI from '../../api/groups';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUsers, FiInfo } from 'react-icons/fi';

const ChatBox = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { socket, connected, joinGroup, leaveGroup, sendMessage } = useSocket();
  
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  // Referencia para mantener el estado actual en los event listeners
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Cargar información del grupo y unirse
  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        // Obtener información del grupo
        const groupResponse = await GroupsAPI.getGroupById(groupId);
        setGroup(groupResponse.group);
        
        // Obtener mensajes iniciales
        const messagesResponse = await GroupsAPI.getGroupMessages(groupId);
        setMessages(messagesResponse.messages || []);
        
        // Unirse al grupo a través de WebSocket
        joinGroup(groupId);
      } catch (error) {
        console.error('Error al cargar información del grupo:', error);
        toast.error('No se pudo cargar el grupo');
        navigate('/groups');
      } finally {
        setLoading(false);
      }
    };
    
    if (connected && groupId) {
      fetchGroupInfo();
    }
    
    // Limpiar: abandonar el grupo al desmontar
    return () => {
      if (connected) {
        leaveGroup(groupId);
      }
    };
  }, [groupId, connected, joinGroup, leaveGroup, navigate]);

  // Configurar eventos del socket
  useEffect(() => {
    if (!socket) return;
    
    // Recibir historial de mensajes
    const handleGroupHistory = (data) => {
      if (data.groupId.toString() === groupId.toString()) {
        setMessages(data.messages);
      }
    };
    
    // Recibir nuevos mensajes
    const handleNewMessage = (data) => {
      if (data.groupId.toString() === groupId.toString()) {
        setMessages(prevMessages => [...prevMessages, data.message]);
      }
    };
    
    // Actualización de usuarios en línea
    const handleOnlineUsers = (data) => {
      if (data.groupId.toString() === groupId.toString()) {
        setOnlineUsers(data.count);
      }
    };
    
    // Suscribirse a eventos
    socket.on('groupHistory', handleGroupHistory);
    socket.on('newMessage', handleNewMessage);
    socket.on('onlineUsers', handleOnlineUsers);
    
    // Limpiar suscripciones
    return () => {
      socket.off('groupHistory', handleGroupHistory);
      socket.off('newMessage', handleNewMessage);
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, [socket, groupId]);

  // Manejar envío de mensajes de texto
  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para enviar mensajes');
      return;
    }
    
    const result = sendMessage(groupId, text);
    
    if (!result.success) {
      toast.error(result.error || 'Error al enviar el mensaje');
    }
  };

  // Manejar envío de mensajes multimedia
  const handleSendMediaMessage = (mediaData) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para enviar archivos');
      return Promise.reject(new Error('No autenticado'));
    }
    
    return new Promise((resolve, reject) => {
      if (socket && connected) {
        socket.emit('sendMediaMessage', {
          groupId,
          ...mediaData
        });
        resolve();
      } else {
        const error = 'No hay conexión con el servidor';
        toast.error(error);
        reject(new Error(error));
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen pt-16">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-theme-text-secondary">Cargando chat...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center h-screen pt-16 px-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
          <FiInfo className="h-8 w-8 text-red-500 dark:text-red-300" />
        </div>
        <h2 className="text-xl font-bold text-theme-text-primary mb-2">Grupo no encontrado</h2>
        <p className="text-theme-text-secondary mb-6 text-center">
          Este grupo no existe o ha sido eliminado.
        </p>
        <button
          onClick={() => navigate('/groups')}
          className="btn btn-primary"
        >
          Volver a la lista de grupos
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen pt-16">
      <div className="border-b border-theme-border p-4 flex justify-between items-center bg-theme-bg-primary">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/groups')}
            className="mr-3 p-2 rounded-full text-theme-text-secondary hover:bg-theme-hover hover:text-theme-text-primary transition-colors duration-200"
            aria-label="Volver"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-theme-text-primary">{group.name}</h2>
            <div className="flex items-center text-sm text-theme-text-secondary">
              <FiUsers className="mr-1" /> {onlineUsers} online
              {group.description && (
                <button 
                  className="ml-3 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  {showInfo ? 'Ocultar info' : 'Ver info'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showInfo && group.description && (
        <div className="p-4 bg-theme-bg-secondary border-b border-theme-border animate-slide-down">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-medium text-theme-text-primary mb-2">Acerca de este grupo</h3>
            <p className="text-theme-text-secondary text-sm">{group.description}</p>
            <div className="mt-2 text-xs text-theme-text-secondary">
              Creado el {new Date(group.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
      
      <MessageList 
        messages={messages} 
        currentUser={user} 
        groupId={groupId} 
        theme={theme}
      />
      
      <div className="border-t border-theme-border p-3 bg-theme-bg-primary">
        <MessageInput 
          onSendMessage={handleSendMessage}
          onSendMediaMessage={handleSendMediaMessage}
          disabled={!connected || !isAuthenticated} 
          theme={theme}
        />
      </div>
    </div>
  );
};

export default ChatBox;