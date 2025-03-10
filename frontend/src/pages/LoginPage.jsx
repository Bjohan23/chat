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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Iniciar Sesión</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
