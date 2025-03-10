import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import GroupsAPI from '../../api/groups';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import toast from 'react-hot-toast';

const ChatBox = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { socket, connected, joinGroup, leaveGroup, sendMessage } = useSocket();
  
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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
    
    // Suscribirse a eventos
    socket.on('groupHistory', handleGroupHistory);
    socket.on('newMessage', handleNewMessage);
    
    // Limpiar suscripciones
    return () => {
      socket.off('groupHistory', handleGroupHistory);
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, groupId]);

  // Manejar envío de mensajes
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Grupo no encontrado</p>
        <button
          onClick={() => navigate('/groups')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Volver a la lista de grupos
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="border-b p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{group.name}</h2>
          {group.description && (
            <p className="text-sm text-gray-600">{group.description}</p>
          )}
        </div>
        <button
          onClick={() => navigate('/groups')}
          className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Volver
        </button>
      </div>
      
      <MessageList messages={messages} currentUser={user} />
      
      <div className="border-t p-3">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={!connected || !isAuthenticated} 
        />
        {!isAuthenticated && (
          <p className="text-xs text-center text-gray-500 mt-2">
            Debes <a href="/login" className="text-blue-500">iniciar sesión</a> para enviar mensajes
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
