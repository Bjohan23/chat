import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { FiMessageCircle, FiLogOut, FiUsers, FiMenu, FiX } from 'react-icons/fi';

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Detectar scroll para cambiar apariencia de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled 
        ? 'bg-theme-bg-primary shadow-md py-2' 
        : 'bg-theme-bg-primary py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" onClick={() => setIsMenuOpen(false)}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FiMessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 font-bold text-xl text-theme-text-primary">Chat App</span>
            </Link>
            
            {/* Enlaces de navegación para pantallas medianas y grandes */}
            <div className="hidden md:ml-10 md:flex md:items-center md:space-x-4">
              <Link 
                to="/groups" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${isActive('/groups') 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-hover'}`}
              >
                Grupos
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/groups/create" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive('/groups/create') 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-hover'}`}
                >
                  Crear Grupo
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {/* ThemeToggle siempre visible */}
            <ThemeToggle className="mr-4" />
            
            {/* Autenticación para pantallas medianas y grandes */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center">
                  <div className="flex flex-col items-end mr-4">
                    <span className="text-sm font-medium text-theme-text-primary">
                      {user.username}
                    </span>
                    <span className="text-xs text-theme-text-secondary">
                      Conectado
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-primary flex items-center"
                  >
                    <FiLogOut className="mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/login"
                    className="btn btn-secondary"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
            
            {/* Botón de menú móvil */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-theme-text-secondary hover:text-theme-text-primary focus:outline-none"
              >
                {isMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-theme-bg-primary animate-slide-down shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/groups" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/groups') ? 'text-blue-600 dark:text-blue-400' : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-hover'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <FiUsers className="mr-2" />
                Grupos
              </div>
            </Link>
            {isAuthenticated && (
              <Link 
                to="/groups/create" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/groups/create') ? 'text-blue-600 dark:text-blue-400' : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-hover'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <FiMessageCircle className="mr-2" />
                  Crear Grupo
                </div>
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-theme-border">
            {isAuthenticated ? (
              <div className="px-2">
                <div className="px-3 py-2 text-theme-text-primary">
                  <div className="text-base font-medium">
                    {user.username}
                  </div>
                  <div className="text-sm text-theme-text-secondary">
                    Conectado
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-hover"
                >
                  <div className="flex items-center">
                    <FiLogOut className="mr-2" />
                    Cerrar Sesión
                  </div>
                </button>
              </div>
            ) : (
              <div className="px-5 py-3 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="btn btn-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;