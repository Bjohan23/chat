import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Mientras verifica la autenticación, mostrar carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, renderizar el contenido protegido
  return <Outlet />;
};

export default ProtectedRoute;
