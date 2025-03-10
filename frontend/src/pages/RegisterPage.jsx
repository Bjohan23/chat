import React from 'react';
import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/Auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Si ya está autenticado, redirigir a la página de grupos
  if (isAuthenticated) {
    return <Navigate to="/groups" replace />;
  }
  
  return (
    <div className="min-h-screen bg-theme-bg-primary pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <h1 className="text-3xl font-bold text-center mb-8 text-theme-text-primary">Crear Cuenta</h1>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;