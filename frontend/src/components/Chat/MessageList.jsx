import React, { useRef, useEffect } from 'react';
import { FiFile, FiDownload } from 'react-icons/fi';

const MessageList = ({ messages, currentUser, groupId }) => {
  const messagesEndRef = useRef(null);
  
  // Desplazar hacia abajo cuando hay nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Formatear la hora del mensaje
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Determinar si un mensaje es del usuario actual
  const isCurrentUserMessage = (message) => {
    return currentUser && message.userId === currentUser.id;
  };

  // Generar URL para archivos multimedia
  const getMediaUrl = (message) => {
    return `/api/media/${groupId}/${message.mediaId}`;
  };
  
  // Renderizar contenido del mensaje según su tipo
  const renderMessageContent = (message) => {
    switch (message.type) {
      case 'image':
        return (
          <div className="my-1">
            <img 
              src={getMediaUrl(message)} 
              alt={message.fileName || "Imagen"} 
              className="max-w-full rounded-md max-h-64 object-contain cursor-pointer"
              onClick={() => window.open(getMediaUrl(message), '_blank')}
            />
            {message.text && message.text !== message.fileName && (
              <p className="mt-1">{message.text}</p>
            )}
          </div>
        );
        
      case 'video':
        return (
          <div className="my-1">
            <video 
              src={getMediaUrl(message)} 
              controls 
              className="max-w-full rounded-md max-h-64"
            />
            {message.text && message.text !== message.fileName && (
              <p className="mt-1">{message.text}</p>
            )}
          </div>
        );
        
      case 'audio':
        return (
          <div className="my-1">
            <audio 
              src={getMediaUrl(message)} 
              controls 
              className="w-full"
            />
            {message.text && message.text !== message.fileName && (
              <p className="mt-1">{message.text}</p>
            )}
          </div>
        );
        
      case 'file':
        return (
          <div className="my-1">
            <div className="flex items-center bg-gray-100 p-2 rounded">
              <FiFile className="mr-2 flex-shrink-0" />
              <span className="mr-2 truncate flex-grow">{message.fileName}</span>
              <a 
                href={getMediaUrl(message)} 
                download={message.fileName}
                className="text-blue-500 hover:text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiDownload />
              </a>
            </div>
            {message.text && message.text !== message.fileName && (
              <p className="mt-1">{message.text}</p>
            )}
          </div>
        );
        
      case 'text':
      default:
        return <div>{message.text}</div>;
    }
  };
  
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex justify-center items-center h-full text-gray-500">
          No hay mensajes aún. ¡Sé el primero en escribir!
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => (
            <div 
              key={`${message.id}-${message.timestamp}`}
              className={`flex ${isCurrentUserMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                message-bubble 
                ${isCurrentUserMessage(message) ? 'message-mine' : 'message-others'}
              `}>
                {!isCurrentUserMessage(message) && (
                  <div className="font-bold text-xs mb-1">{message.username}</div>
                )}
                
                {renderMessageContent(message)}
                
                <div className="text-xs opacity-70 text-right mt-1">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;