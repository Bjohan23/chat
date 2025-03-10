import React, { useRef, useEffect } from 'react';

const MessageList = ({ messages, currentUser }) => {
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
                <div>{message.text}</div>
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
