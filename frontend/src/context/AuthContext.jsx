import React, { createContext, useState, useEffect } from 'react';
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

