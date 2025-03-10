const Group = require('../models/group');

const GroupController = {
  // Crear un nuevo grupo
  create: (req, res) => {
    try {
      const { name, description } = req.body;
      
      // Validar datos
      if (!name) {
        return res.status(400).json({ message: 'Se requiere un nombre para el grupo' });
      }
      
      // Crear el grupo
      const newGroup = Group.create({
        name,
        description: description || '',
        userId: req.user.id
      });
      
      res.status(201).json({
        message: 'Grupo creado exitosamente',
        group: newGroup
      });
    } catch (error) {
      console.error('Error al crear grupo:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  
  // Listar todos los grupos
  list: (req, res) => {
    try {
      const groups = Group.list();
      res.json({ groups });
    } catch (error) {
      console.error('Error al listar grupos:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  
  // Obtener un grupo por ID
  getById: (req, res) => {
    try {
      const { id } = req.params;
      const group = Group.findById(parseInt(id));
      
      if (!group) {
        return res.status(404).json({ message: 'Grupo no encontrado' });
      }
      
      res.json({ group });
    } catch (error) {
      console.error('Error al obtener grupo:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  
  // Obtener mensajes de un grupo
  getMessages: (req, res) => {
    try {
      const { id } = req.params;
      const group = Group.findById(parseInt(id));
      
      if (!group) {
        return res.status(404).json({ message: 'Grupo no encontrado' });
      }
      
      const messages = Group.getMessages(parseInt(id));
      res.json({ messages });
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
};

module.exports = GroupController;