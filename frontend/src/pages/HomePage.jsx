import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiMessageCircle, FiUsers, FiGlobe, FiLock, FiSmile, FiImage, FiVideo } from 'react-icons/fi';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Comunícate sin límites con nuestra app de chat en tiempo real
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
            Una plataforma moderna para mensajería instantánea, grupos y compartir archivos multimedia.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            {isAuthenticated ? (
              <Link
                to="/groups"
                className="btn-primary btn text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Ir a mis chats
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-primary btn text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 btn text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
          
          <div className="flex justify-center space-x-6 opacity-75">
            <div className="animate-pulse-slow">
              <FiMessageCircle className="h-10 w-10" />
            </div>
            <div className="animate-pulse-slow animation-delay-200">
              <FiUsers className="h-10 w-10" />
            </div>
            <div className="animate-pulse-slow animation-delay-400">
              <FiGlobe className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-theme-bg-primary">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-theme-text-primary">
            Características Principales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FiMessageCircle className="h-10 w-10 text-blue-500" />}
              title="Chat en Tiempo Real"
              description="Comunícate instantáneamente con otros usuarios a través de mensajería sin retrasos ni actualizaciones manuales."
            />
            
            <FeatureCard 
              icon={<FiUsers className="h-10 w-10 text-purple-500" />}
              title="Grupos Temáticos"
              description="Crea o únete a grupos organizados por temas para compartir con personas de intereses similares."
            />
            
            <FeatureCard 
              icon={<FiLock className="h-10 w-10 text-green-500" />}
              title="Acceso Seguro"
              description="Sistema de autenticación con JWT para proteger tus conversaciones y datos personales."
            />
            
            <FeatureCard 
              icon={<FiSmile className="h-10 w-10 text-yellow-500" />}
              title="Experiencia Personalizada"
              description="Cambia entre modo claro y oscuro para adaptar la interfaz a tus preferencias y comodidad visual."
            />
            
            <FeatureCard 
              icon={<FiImage className="h-10 w-10 text-red-500" />}
              title="Compartir Multimedia"
              description="Comparte fotos, videos y audios fácilmente durante tus conversaciones en grupo."
            />
            
            <FeatureCard 
              icon={<FiVideo className="h-10 w-10 text-indigo-500" />}
              title="Reproducción Integrada"
              description="Visualiza imágenes, reproduce videos y audios directamente en la interfaz de chat sin necesidad de aplicaciones externas."
            />
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-theme-bg-secondary py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-theme-text-primary">
            ¿Listo para comenzar a chatear?
          </h2>
          <p className="text-xl mb-8 text-theme-text-secondary">
            Únete ahora y conéctate con otros usuarios en nuestra plataforma de mensajería en tiempo real.
          </p>
          
          {isAuthenticated ? (
            <Link
              to="/groups"
              className="btn btn-primary text-lg px-8 py-3"
            >
              Explorar grupos
            </Link>
          ) : (
            <Link
              to="/register"
              className="btn btn-primary text-lg px-8 py-3"
            >
              Crear cuenta gratis
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para tarjetas de características
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="card p-6 hover:shadow-soft-lg transition-all duration-300 flex flex-col items-center text-center animate-fade-in">
      <div className="mb-4 p-3 rounded-full bg-theme-bg-secondary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-theme-text-primary">{title}</h3>
      <p className="text-theme-text-secondary">{description}</p>
    </div>
  );
};

export default HomePage;