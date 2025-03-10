import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiUserPlus, FiUser, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

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
    
    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const success = await register(username, password);
      if (success) {
        navigate('/groups');
      } else {
        setError('Error al crear la cuenta. El usuario podría ya existir.');
      }
    } catch (err) {
      setError('Error al registrar. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Validar fortaleza de la contraseña
  const getPasswordStrength = () => {
    if (!password) return null;
    
    const hasMinLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (hasMinLength && hasNumber && hasSpecial) {
      return { strength: 'fuerte', color: 'text-green-600 dark:text-green-400' };
    } else if (hasMinLength && (hasNumber || hasSpecial)) {
      return { strength: 'media', color: 'text-yellow-600 dark:text-yellow-400' };
    } else if (hasMinLength) {
      return { strength: 'débil', color: 'text-red-500 dark:text-red-400' };
    } else {
      return { strength: 'muy débil', color: 'text-red-600 dark:text-red-300' };
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="mx-auto max-w-md w-full">
      <div className="card p-8 shadow-soft-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUserPlus className="h-8 w-8 text-purple-600 dark:text-purple-300" />
          </div>
          <h2 className="text-2xl font-bold text-theme-text-primary">Crear Cuenta</h2>
          <p className="text-theme-text-secondary mt-2">
            Regístrate para acceder a todas las funciones
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
            <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-red-600 dark:text-red-300">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-theme-text-primary mb-2 flex items-center">
              <FiUser className="mr-2 h-4 w-4" />
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input w-full"
              placeholder="Elige un nombre de usuario"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-theme-text-primary mb-2 flex items-center">
              <FiLock className="mr-2 h-4 w-4" />
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full"
              placeholder="Crea una contraseña segura"
              required
              disabled={loading}
            />
            {passwordStrength && (
              <div className="mt-2 text-xs flex items-center">
                <span className="mr-2">Seguridad:</span>
                <span className={passwordStrength.color}>{passwordStrength.strength}</span>
              </div>
            )}
            <div className="mt-2 text-xs text-theme-text-secondary">
              <ul className="space-y-1">
                <PasswordRequirement 
                  met={password.length >= 6} 
                  text="Al menos 6 caracteres" 
                />
                <PasswordRequirement 
                  met={/\d/.test(password)} 
                  text="Al menos un número" 
                />
                <PasswordRequirement 
                  met={/[!@#$%^&*(),.?":{}|<>]/.test(password)} 
                  text="Al menos un carácter especial" 
                />
              </ul>
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-theme-text-primary mb-2 flex items-center">
              <FiLock className="mr-2 h-4 w-4" />
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input w-full"
              placeholder="Repite tu contraseña"
              required
              disabled={loading}
            />
            {confirmPassword && (
              <div className="mt-2 text-xs flex items-center">
                {password === confirmPassword ? (
                  <span className="flex items-center text-green-600 dark:text-green-400">
                    <FiCheckCircle className="mr-1" /> Las contraseñas coinciden
                  </span>
                ) : (
                  <span className="flex items-center text-red-500 dark:text-red-400">
                    <FiAlertCircle className="mr-1" /> Las contraseñas no coinciden
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                <span className="flex items-center">
                  <FiUserPlus className="mr-2" />
                  Crear Cuenta
                </span>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-theme-text-secondary">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Componente para requisitos de contraseña
const PasswordRequirement = ({ met, text }) => (
  <li className="flex items-center">
    {met ? (
      <FiCheckCircle className="text-green-500 dark:text-green-400 mr-2 h-3 w-3" />
    ) : (
      <FiAlertCircle className="text-gray-400 mr-2 h-3 w-3" />
    )}
    <span className={met ? 'text-theme-text-primary' : 'text-theme-text-secondary'}>
      {text}
    </span>
  </li>
);

export default RegisterForm;