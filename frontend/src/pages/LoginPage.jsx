import React from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Si ya está autenticado, redirigir a la página de grupos
  if (isAuthenticated) {
    return <Navigate to="/groups" replace />;
  }
  
  return (
    <div className="min-h-screen bg-theme-bg-primary pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <h1 className="text-3xl font-bold text-center mb-8 text-theme-text-primary">Iniciar Sesión</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;