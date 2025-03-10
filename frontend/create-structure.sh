#!/bin/bash

# Crear directorios principales
mkdir -p src/api
mkdir -p src/components/Auth
mkdir -p src/components/Chat
mkdir -p src/components/Groups
mkdir -p src/components/shared
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/pages
mkdir -p src/utils

# Crear archivos de API
echo "import api from '../utils/api';

// Funciones para comunicación con los endpoints de autenticación
const AuthAPI = {
  // Registrar un nuevo usuario
  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },
  
  // Iniciar sesión
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  // Obtener información del usuario actual
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default AuthAPI;" > src/api/auth.js

echo "import api from '../utils/api';

// Funciones para comunicación con los endpoints de grupos
const GroupsAPI = {
  // Crear un nuevo grupo
  createGroup: async (name, description = '') => {
    const response = await api.post('/groups', { name, description });
    return response.data;
  },
  
  // Obtener todos los grupos
  getGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },
  
  // Obtener un grupo por ID
  getGroupById: async (groupId) => {
    const response = await api.get(\`/groups/\${groupId}\`);
    return response.data;
  },
  
  // Obtener mensajes de un grupo
  getGroupMessages: async (groupId) => {
    const response = await api.get(\`/groups/\${groupId}/messages\`);
    return response.data;
  }
};

export default GroupsAPI;" > src/api/groups.js

# Crear componentes Auth
echo "import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/groups');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=\"mx-auto max-w-md p-6 bg-white rounded-lg shadow-md\">
      <h2 className=\"text-2xl font-bold mb-6 text-center\">Iniciar Sesión</h2>
      
      <form onSubmit={handleSubmit}>
        <div className=\"mb-4\">
          <label htmlFor=\"username\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Nombre de usuario
          </label>
          <input
            id=\"username\"
            type=\"text\"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className=\"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500\"
            required
          />
        </div>
        
        <div className=\"mb-6\">
          <label htmlFor=\"password\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Contraseña
          </label>
          <input
            id=\"password\"
            type=\"password\"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=\"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500\"
            required
          />
        </div>
        
        <div>
          <button
            type=\"submit\"
            disabled={loading}
            className=\"w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50\"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </div>
      </form>
      
      <div className=\"mt-4 text-center\">
        <p className=\"text-sm text-gray-600\">
          ¿No tienes una cuenta?{' '}
          <button
            onClick={() => navigate('/register')}
            className=\"font-medium text-blue-600 hover:text-blue-500\"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;" > src/components/Auth/LoginForm.jsx

echo "import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const success = await register(username, password);
      if (success) {
        navigate('/groups');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=\"mx-auto max-w-md p-6 bg-white rounded-lg shadow-md\">
      <h2 className=\"text-2xl font-bold mb-6 text-center\">Crear Cuenta</h2>
      
      <form onSubmit={handleSubmit}>
        <div className=\"mb-4\">
          <label htmlFor=\"username\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Nombre de usuario
          </label>
          <input
            id=\"username\"
            type=\"text\"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className=\"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500\"
            required
          />
        </div>
        
        <div className=\"mb-4\">
          <label htmlFor=\"password\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Contraseña
          </label>
          <input
            id=\"password\"
            type=\"password\"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=\"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500\"
            required
          />
        </div>
        
        <div className=\"mb-6\">
          <label htmlFor=\"confirmPassword\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Confirmar Contraseña
          </label>
          <input
            id=\"confirmPassword\"
            type=\"password\"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className=\"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500\"
            required
          />
          {error && <p className=\"mt-1 text-sm text-red-600\">{error}</p>}
        </div>
        
        <div>
          <button
            type=\"submit\"
            disabled={loading}
            className=\"w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50\"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>
      </form>
      
      <div className=\"mt-4 text-center\">
        <p className=\"text-sm text-gray-600\">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={() => navigate('/login')}
            className=\"font-medium text-blue-600 hover:text-blue-500\"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;" > src/components/Auth/RegisterForm.jsx

# Crear componentes Chat
echo "import React, { useState, useEffect, useRef } from 'react';
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
      <div className=\"flex justify-center items-center h-40\">
        <div className=\"animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500\"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className=\"text-center p-8\">
        <p className=\"text-red-500\">Grupo no encontrado</p>
        <button
          onClick={() => navigate('/groups')}
          className=\"mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition\"
        >
          Volver a la lista de grupos
        </button>
      </div>
    );
  }

  return (
    <div className=\"flex flex-col h-[calc(100vh-64px)]\">
      <div className=\"border-b p-4 flex justify-between items-center\">
        <div>
          <h2 className=\"text-xl font-bold\">{group.name}</h2>
          {group.description && (
            <p className=\"text-sm text-gray-600\">{group.description}</p>
          )}
        </div>
        <button
          onClick={() => navigate('/groups')}
          className=\"px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transition\"
        >
          Volver
        </button>
      </div>
      
      <MessageList messages={messages} currentUser={user} />
      
      <div className=\"border-t p-3\">
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={!connected || !isAuthenticated} 
        />
        {!isAuthenticated && (
          <p className=\"text-xs text-center text-gray-500 mt-2\">
            Debes <a href=\"/login\" className=\"text-blue-500\">iniciar sesión</a> para enviar mensajes
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatBox;" > src/components/Chat/ChatBox.jsx

echo "import React, { useRef, useEffect } from 'react';

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
    <div className=\"flex-1 p-4 overflow-y-auto\">
      {messages.length === 0 ? (
        <div className=\"flex justify-center items-center h-full text-gray-500\">
          No hay mensajes aún. ¡Sé el primero en escribir!
        </div>
      ) : (
        <div className=\"space-y-2\">
          {messages.map((message) => (
            <div 
              key={\`\${message.id}-\${message.timestamp}\`}
              className={\`flex \${isCurrentUserMessage(message) ? 'justify-end' : 'justify-start'}\`}
            >
              <div className={\`
                message-bubble 
                \${isCurrentUserMessage(message) ? 'message-mine' : 'message-others'}
              \`}>
                {!isCurrentUserMessage(message) && (
                  <div className=\"font-bold text-xs mb-1\">{message.username}</div>
                )}
                <div>{message.text}</div>
                <div className=\"text-xs opacity-70 text-right mt-1\">
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

export default MessageList;" > src/components/Chat/MessageList.jsx

echo "import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e) => {
    // Enviar con Enter, nueva línea con Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className=\"flex\">
      <input
        type=\"text\"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? \"Inicia sesión para enviar mensajes\" : \"Escribe un mensaje...\"}
        disabled={disabled}
        className=\"flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500\"
      />
      <button
        type=\"submit\"
        disabled={!message.trim() || disabled}
        className=\"px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed\"
      >
        Enviar
      </button>
    </form>
  );
};

export default MessageInput;" > src/components/Chat/MessageInput.jsx

# Crear componentes Groups
echo "import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupsAPI from '../../api/groups';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Cargar grupos al montar el componente
    const fetchGroups = async () => {
      try {
        const response = await GroupsAPI.getGroups();
        setGroups(response.groups);
      } catch (error) {
        console.error('Error al cargar grupos:', error);
        toast.error('Error al cargar la lista de grupos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, []);
  
  const handleCreateGroup = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para crear un grupo');
      navigate('/login');
      return;
    }
    
    navigate('/groups/create');
  };
  
  const handleJoinGroup = (groupId) => {
    navigate(\`/chat/\${groupId}\`);
  };
  
  if (loading) {
    return (
      <div className=\"flex justify-center items-center h-40\">
        <div className=\"animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500\"></div>
      </div>
    );
  }
  
  return (
    <div className=\"max-w-4xl mx-auto\">
      <div className=\"flex justify-between items-center mb-6\">
        <h2 className=\"text-2xl font-bold\">Grupos Disponibles</h2>
        <button
          onClick={handleCreateGroup}
          className=\"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition\"
        >
          Crear Nuevo Grupo
        </button>
      </div>
      
      {groups.length === 0 ? (
        <div className=\"p-6 bg-gray-50 rounded-lg text-center\">
          <p className=\"text-gray-500\">No hay grupos disponibles. ¡Crea el primero!</p>
        </div>
      ) : (
        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
          {groups.map((group) => (
            <div 
              key={group.id}
              className=\"border rounded-lg p-4 hover:shadow-md transition cursor-pointer\"
              onClick={() => handleJoinGroup(group.id)}
            >
              <h3 className=\"font-bold text-lg mb-2\">{group.name}</h3>
              {group.description && (
                <p className=\"text-gray-600 mb-3\">{group.description}</p>
              )}
              <p className=\"text-sm text-gray-500\">
                Creado el {new Date(group.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;" > src/components/Groups/GroupList.jsx

echo "import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupsAPI from '../../api/groups';
import toast from 'react-hot-toast';

const CreateGroupForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('El nombre del grupo es requerido');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await GroupsAPI.createGroup(name, description);
      toast.success('Grupo creado exitosamente');
      navigate(\`/chat/\${response.group.id}\`);
    } catch (error) {
      console.error('Error al crear grupo:', error);
      toast.error(error.response?.data?.message || 'Error al crear el grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=\"max-w-md mx-auto p-6 bg-white rounded-lg shadow-md\">
      <h2 className=\"text-2xl font-bold mb-6 text-center\">Crear Nuevo Grupo</h2>
      
      <form onSubmit={handleSubmit}>
        <div className=\"mb-4\">
          <label htmlFor=\"name\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Nombre del Grupo *
          </label>
          <input
            id=\"name\"
            type=\"text\"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className=\"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500\"
            required
          />
        </div>
        
        <div className=\"mb-6\">
          <label htmlFor=\"description\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Descripción (opcional)
          </label>
          <textarea
            id=\"description\"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows=\"3\"
            className=\"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500\"
          ></textarea>
        </div>
        
        <div className=\"flex justify-end space-x-3\">
          <button
            type=\"button\"
            onClick={() => navigate('/groups')}
            className=\"py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500\"
          >
            Cancelar
          </button>
          <button
            type=\"submit\"
            disabled={loading}
            className=\"py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50\"
          >
            {loading ? 'Creando...' : 'Crear Grupo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroupForm;" > src/components/Groups/CreateGroupForm.jsx

# Crear componentes shared
echo "import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <nav className=\"bg-blue-600 text-white shadow-md\">
      <div className=\"max-w-6xl mx-auto px-4\">
        <div className=\"flex justify-between h-16\">
          <div className=\"flex items-center\">
            <Link to=\"/\" className=\"flex-shrink-0 flex items-center\">
              <svg 
                xmlns=\"http://www.w3.org/2000/svg\" 
                className=\"h-8 w-8 mr-2\" 
                fill=\"none\" 
                viewBox=\"0 0 24 24\" 
                stroke=\"currentColor\"
              >
                <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z\" />
              </svg>
              <span className=\"font-bold text-xl\">Chat App</span>
            </Link>
            
            <div className=\"ml-10 flex items-center space-x-4\">
              <Link 
                to=\"/groups\" 
                className=\"px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700\"
              >
                Grupos
              </Link>
            </div>
          </div>
          
          <div className=\"flex items-center\">
            {isAuthenticated ? (
              <div className=\"flex items-center\">
                <span className=\"text-sm mr-4\">
                  Hola, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className=\"px-3 py-2 rounded-md text-sm font-medium bg-blue-700 hover:bg-blue-800\"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className=\"flex space-x-2\">
                <Link
                  to=\"/login\"
                  className=\"px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700\"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to=\"/register\"
                  className=\"px-3 py-2 rounded-md text-sm font-medium bg-blue-700 hover:bg-blue-800\"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;" > src/components/shared/NavBar.jsx

echo "import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Mientras verifica la autenticación, mostrar carga
  if (loading) {
    return (
      <div className=\"flex justify-center items-center h-screen\">
        <div className=\"animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500\"></div>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to=\"/login\" replace />;
  }
  
  // Si está autenticado, renderizar el contenido protegido
  return <Outlet />;
};

export default ProtectedRoute;" > src/components/shared/ProtectedRoute.jsx

# Crear contextos
echo "import React, { createContext, useState, useEffect } from 'react';
import { getUser, isAuthenticated, setToken, removeToken } from '../utils/tokenUtils';
import { updateSocketAuth } from '../utils/socket';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getUser());
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Registrar un nuevo usuario
  const register = async (username, password) => {
    try {
      const response = await api.post('/auth/register', { username, password });
      const { user, token } = response.data;
      
      setToken(token, user);
      setUser(user);
      updateSocketAuth(token);
      
      toast.success('¡Registro exitoso!');
      return true;
    } catch (error) {
      console.error('Error de registro:', error);
      toast.error(error.response?.data?.message || 'Error al registrar usuario');
      return false;
    }
  };

  // Iniciar sesión
  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { user, token } = response.data;
      
      setToken(token, user);
      setUser(user);
      updateSocketAuth(token);
      
      toast.success('¡Inicio de sesión exitoso!');
      return true;
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      toast.error(error.response?.data?.message || 'Credenciales inválidas');
      return false;
    }
  };

  // Cerrar sesión
  const logout = () => {
    removeToken();
    setUser(null);
    updateSocketAuth('');
    toast.success('Sesión cerrada');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
" > src/context/AuthContext.jsx

echo "import React, { createContext, useEffect, useState } from 'react';
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

  // Enviar mensaje a un grupo
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

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        authStatus,
        joinGroup,
        leaveGroup,
        sendMessage
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};" > src/context/SocketContext.jsx

# Crear hooks
echo "import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};" > src/hooks/useAuth.js

echo "import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

// Hook personalizado para acceder al contexto del socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket debe ser usado dentro de un SocketProvider');
  }
  
  return context;
};" > src/hooks/useSocket.js

# Crear páginas
echo "import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className=\"max-w-4xl mx-auto px-4 py-12\">
      <div className=\"text-center mb-10\">
        <h1 className=\"text-4xl font-bold mb-4\">Bienvenido a Chat App</h1>
        <p className=\"text-xl text-gray-600 mb-8\">
          Una aplicación de chat en tiempo real con grupos y mensajería instantánea.
        </p>
        
        {isAuthenticated ? (
          <Link
            to=\"/groups\"
            className=\"px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition\"
          >
            Ir a mis grupos
          </Link>
        ) : (
          <div className=\"flex flex-col sm:flex-row justify-center gap-4\">
            <Link
              to=\"/login\"
              className=\"px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition\"
            >
              Iniciar Sesión
            </Link>
            <Link
              to=\"/register\"
              className=\"px-6 py-3 border border-blue-600 text-blue-600 rounded-md text-lg font-medium hover:bg-blue-50 transition\"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
      
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-8 mt-12\">
        <div className=\"bg-white p-6 rounded-lg shadow-md\">
          <div className=\"text-blue-600 text-4xl mb-4\">
            <svg 
              xmlns=\"http://www.w3.org/2000/svg\" 
              className=\"h-12 w-12\"
              fill=\"none\" 
              viewBox=\"0 0 24 24\" 
              stroke=\"currentColor\"
            >
              <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z\" />
            </svg>
          </div>
          <h2 className=\"text-xl font-bold mb-2\">Chats en Tiempo Real</h2>
          <p className=\"text-gray-600\">
            Comunícate instantáneamente con otros usuarios a través de mensajes en tiempo real.
          </p>
        </div>
        
        <div className=\"bg-white p-6 rounded-lg shadow-md\">
          <div className=\"text-blue-600 text-4xl mb-4\">
            <svg 
              xmlns=\"http://www.w3.org/2000/svg\" 
              className=\"h-12 w-12\"
              fill=\"none\" 
              viewBox=\"0 0 24 24\" 
              stroke=\"currentColor\"
            >
              <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z\" />
            </svg>
          </div>
          <h2 className=\"text-xl font-bold mb-2\">Grupos de Chat</h2>
          <p className=\"text-gray-600\">
            Crea o únete a grupos temáticos para compartir mensajes con múltiples usuarios.
          </p>
        </div>
        
        <div className=\"bg-white p-6 rounded-lg shadow-md\">
          <div className=\"text-blue-600 text-4xl mb-4\">
            <svg 
              xmlns=\"http://www.w3.org/2000/svg\" 
              className=\"h-12 w-12\"
              fill=\"none\" 
              viewBox=\"0 0 24 24\" 
              stroke=\"currentColor\"
            >
              <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z\" />
            </svg>
          </div>
          <h2 className=\"text-xl font-bold mb-2\">Acceso Seguro</h2>
          <p className=\"text-gray-600\">
            Autenticación segura con JWT para proteger tus conversaciones y datos.
          </p>
        </div>
      </div>
      
      <div className=\"text-center mt-16\">
        <Link
          to=\"/groups\"
          className=\"text-blue-600 hover:underline font-medium\"
        >
          Explorar grupos de chat disponibles
        </Link>
      </div>
    </div>
  );
};

export default HomePage;" > src/pages/HomePage.jsx

echo "import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Si ya está autenticado, redirigir a la página de grupos
  if (isAuthenticated) {
    return <Navigate to=\"/groups\" replace />;
  }
  
  return (
    <div className=\"max-w-4xl mx-auto px-4 py-12\">
      <h1 className=\"text-3xl font-bold text-center mb-8\">Iniciar Sesión</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;" > src/pages/LoginPage.jsx

echo "import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Si ya está autenticado, redirigir a la página de grupos
  if (isAuthenticated) {
    return <Navigate to=\"/groups\" replace />;
  }
  
  return (
    <div className=\"max-w-4xl mx-auto px-4 py-12\">
      <h1 className=\"text-3xl font-bold text-center mb-8\">Crear Cuenta</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;" > src/pages/RegisterPage.jsx

echo "import React from 'react';
import GroupList from '../components/Groups/GroupList';

const GroupsPage = () => {
  return (
    <div className=\"max-w-4xl mx-auto px-4 py-8\">
      <h1 className=\"text-3xl font-bold mb-8\">Grupos de Chat</h1>
      <GroupList />
    </div>
  );
};

export default GroupsPage;" > src/pages/GroupsPage.jsx

echo "import React from 'react';
import CreateGroupForm from '../components/Groups/CreateGroupForm';

const CreateGroupPage = () => {
  return (
    <div className=\"max-w-4xl mx-auto px-4 py-8\">
      <h1 className=\"text-3xl font-bold text-center mb-8\">Crear Nuevo Grupo</h1>
      <CreateGroupForm />
    </div>
  );
};

export default CreateGroupPage;" > src/pages/CreateGroupPage.jsx

echo "import React from 'react';
import ChatBox from '../components/Chat/ChatBox';

const ChatPage = () => {
  return (
    <div className=\"h-[calc(100vh-64px)]\">
      <ChatBox />
    </div>
  );
};

export default ChatPage;" > src/pages/ChatPage.jsx

# Crear utilidades
echo "import axios from 'axios';
import { getToken } from './tokenUtils';

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Ajusta esta URL según tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;" > src/utils/api.js

echo "import jwtDecode from 'jwt-decode';

const TOKEN_KEY = 'chat_auth_token';
const USER_KEY = 'chat_user';

// Almacenar token y datos de usuario en localStorage
export const setToken = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Obtener token del localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Obtener información del usuario del localStorage
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Verificar si el token ha expirado
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Eliminar token y datos de usuario (logout)
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};" > src/utils/tokenUtils.js

echo "import { io } from 'socket.io-client';
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
};" > src/utils/socket.js

# Actualizar App.jsx
echo "import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Components
import NavBar from './components/shared/NavBar';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GroupsPage from './pages/GroupsPage';
import CreateGroupPage from './pages/CreateGroupPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className=\"min-h-screen bg-gray-50\">
            <NavBar />
            
            <Toaster 
              position=\"top-right\"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            
            <Routes>
              {/* Rutas públicas */}
              <Route path=\"/\" element={<HomePage />} />
              <Route path=\"/login\" element={<LoginPage />} />
              <Route path=\"/register\" element={<RegisterPage />} />
              <Route path=\"/groups\" element={<GroupsPage />} />
              <Route path=\"/chat/:groupId\" element={<ChatPage />} />
              
              {/* Rutas protegidas (requieren autenticación) */}
              <Route element={<ProtectedRoute />}>
                <Route path=\"/groups/create\" element={<CreateGroupPage />} />
              </Route>
              
              {/* Ruta de fallback */}
              <Route path=\"*\" element={<HomePage />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;" > src/App.jsx

# Actualizar index.css para Tailwind
echo "@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
}

body {
  margin: 0;
  min-height: 100vh;
}

/* Estilos personalizados para mensajes de chat */
.message-bubble {
  @apply max-w-[80%] rounded-lg p-3 my-1;
}

.message-mine {
  @apply bg-blue-500 text-white ml-auto rounded-bl-lg rounded-tl-lg rounded-tr-lg;
}

.message-others {
  @apply bg-gray-200 text-gray-800 mr-auto rounded-br-lg rounded-tr-lg rounded-tl-lg;
}" > src/index.css

echo "Script completado. Se han creado todas las carpetas y archivos necesarios."