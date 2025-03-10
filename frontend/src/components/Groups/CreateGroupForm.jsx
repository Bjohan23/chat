import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupsAPI from '../../api/groups';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiArrowLeft, FiMessageSquare, FiInfo } from 'react-icons/fi';

const CreateGroupForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar nombre del grupo
    if (!name.trim()) {
      setNameError('El nombre del grupo es requerido');
      return;
    }
    
    if (name.length < 3) {
      setNameError('El nombre debe tener al menos 3 caracteres');
      return;
    }
    
    setNameError('');
    setLoading(true);
    
    try {
      const response = await GroupsAPI.createGroup(name, description);
      toast.success('¡Grupo creado exitosamente!');
      navigate(`/chat/${response.group.id}`);
    } catch (error) {
      console.error('Error al crear grupo:', error);
      toast.error(error.response?.data?.message || 'Error al crear el grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card shadow-soft-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-700 p-6 text-white">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center mr-4">
              <FiMessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Crear Nuevo Grupo</h2>
              <p className="opacity-80">Define un espacio para chatear con otros usuarios</p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-theme-text-primary mb-2">
              Nombre del Grupo *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input w-full ${nameError ? 'border-red-300 dark:border-red-700' : ''}`}
              placeholder="Ejemplo: Amantes del código"
              required
              disabled={loading}
            />
            {nameError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <FiInfo className="mr-1" /> {nameError}
              </p>
            )}
            <p className="mt-1 text-xs text-theme-text-secondary flex items-center">
              <FiInfo className="mr-1" /> 
              El nombre será visible para todos los usuarios
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-theme-text-primary mb-2">
              Descripción (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="input w-full"
              placeholder="Describe el propósito de este grupo..."
              disabled={loading}
            ></textarea>
            <p className="mt-1 text-xs text-theme-text-secondary">
              Una buena descripción ayuda a los usuarios a entender de qué trata el grupo
            </p>
          </div>
          
          <div className="bg-theme-bg-secondary -mx-6 -mb-6 p-6 flex justify-end space-x-3 border-t border-theme-border">
            <button
              type="button"
              onClick={() => navigate('/groups')}
              disabled={loading}
              className="btn btn-secondary flex items-center"
            >
              <FiX className="mr-2" />
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                </span>
              ) : (
                <span className="flex items-center">
                  <FiPlus className="mr-2" />
                  Crear Grupo
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate('/groups')} 
          className="inline-flex items-center text-theme-text-secondary hover:text-theme-text-primary transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Volver a la lista de grupos
        </button>
      </div>
    </div>
  );
};

export default CreateGroupForm;