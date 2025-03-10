import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupsAPI from '../../api/groups';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Cargar grupos al montar el componente
    const fetchGroups = async () => {
      try {
        const response = await GroupsAPI.getGroups();
        setGroups(response.groups);
      } catch (error) {
        console.error('Error al cargar grupos:', error);
        toast.error('Error al cargar la lista de grupos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroups();
  }, []);
  
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Grupos Disponibles</h2>
        <button
          onClick={handleCreateGroup}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Crear Nuevo Grupo
        </button>
      </div>
      
      {groups.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-500">No hay grupos disponibles. ¡Crea el primero!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => (
            <div 
              key={group.id}
              className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              onClick={() => handleJoinGroup(group.id)}
            >
              <h3 className="font-bold text-lg mb-2">{group.name}</h3>
              {group.description && (
                <p className="text-gray-600 mb-3">{group.description}</p>
              )}
              <p className="text-sm text-gray-500">
                Creado el {new Date(group.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList;
