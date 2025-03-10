import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupsAPI from '../../api/groups';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { FiPlus, FiMessageCircle, FiCalendar, FiUsers, FiSearch, FiLoader } from 'react-icons/fi';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  
  useEffect(() => {
    // Cargar grupos al montar el componente
    const fetchGroups = async () => {
      try {
        const response = await GroupsAPI.getGroups();
        setGroups(response.groups);
        setFilteredGroups(response.groups);
      } catch (error) {
        console.error('Error al cargar grupos:', error);
        toast.error('Error al cargar la lista de grupos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, []);
  
  // Filtrar grupos cuando cambia el término de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredGroups(groups);
      return;
    }
    
    const normalized = searchTerm.toLowerCase();
    const filtered = groups.filter(group => 
      group.name.toLowerCase().includes(normalized) || 
      (group.description && group.description.toLowerCase().includes(normalized))
    );
    
    setFilteredGroups(filtered);
  }, [searchTerm, groups]);
  
  const handleCreateGroup = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para crear un grupo');
      navigate('/login');
      return;
    }
    
    navigate('/groups/create');
  };
  
  const handleJoinGroup = (groupId) => {
    navigate(`/chat/${groupId}`);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <FiLoader className="h-10 w-10 animate-spin text-blue-500 mb-4" />
          <p className="text-theme-text-secondary">Cargando grupos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-theme-text-primary">
          Grupos Disponibles
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-theme-text-secondary" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar grupos..."
              className="input pl-10 w-full"
            />
          </div>
          
          <button
            onClick={handleCreateGroup}
            className="btn btn-primary flex items-center justify-center whitespace-nowrap"
          >
            <FiPlus className="mr-2" />
            Crear Grupo
          </button>
        </div>
      </div>
      
      {filteredGroups.length === 0 ? (
        <div className="card p-8 text-center">
          {searchTerm ? (
            <div>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <p className="text-theme-text-primary text-lg font-medium mb-2">
                No hay resultados para "{searchTerm}"
              </p>
              <p className="text-theme-text-secondary mb-6">
                Intenta con otro término de búsqueda o crea un nuevo grupo con este tema.
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="btn btn-secondary"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <p className="text-theme-text-primary text-lg font-medium mb-2">
                No hay grupos disponibles
              </p>
              <p className="text-theme-text-secondary mb-6">
                ¡Sé el primero en crear un grupo y comenzar la conversación!
              </p>
              <button 
                onClick={handleCreateGroup}
                className="btn btn-primary"
              >
                <FiPlus className="mr-2" />
                Crear Nuevo Grupo
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div 
              key={group.id}
              className="card overflow-hidden hover:shadow-soft-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleJoinGroup(group.id)}
            >
              <div className={`h-3 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-700 to-purple-700' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`} />
              
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2 text-theme-text-primary">{group.name}</h3>
                
                {group.description && (
                  <p className="text-theme-text-secondary mb-4 line-clamp-2">
                    {group.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-theme-text-secondary mt-4">
                  <div className="flex items-center">
                    <FiCalendar className="mr-1" />
                    <span>{formatDate(group.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FiUsers className="mr-1" />
                    <span>Público</span>
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-3 bg-theme-bg-secondary border-t border-theme-border flex justify-end">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline flex items-center">
                  Entrar al chat
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;