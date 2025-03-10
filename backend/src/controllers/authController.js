const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../config/jwt');

const AuthController = {
  // Registrar un nuevo usuario
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validar datos
      if (!username || !password) {
        return res.status(400).json({ message: 'Se requieren nombre de usuario y contraseña' });
      }
      
      // Verificar si el usuario ya existe
      const existingUser = User.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: 'El nombre de usuario ya está en uso' });
      }
      
      // Crear hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Crear el usuario
      const newUser = User.create({
        username,
        password: hashedPassword
      });
      
      // Generar token JWT
      const token = generateToken(newUser);
      
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id,
          username: newUser.username
        },
        token
      });
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  
  // Iniciar sesión
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validar datos
      if (!username || !password) {
        return res.status(400).json({ message: 'Se requieren nombre de usuario y contraseña' });
      }
      
      // Buscar usuario
      const user = User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      
      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      
      // Generar token JWT
      const token = generateToken(user);
      
      res.json({
        message: 'Inicio de sesión exitoso',
        user: {
          id: user.id,
          username: user.username
        },
        token
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  
  // Obtener información del usuario actual
  getCurrentUser: (req, res) => {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username
      }
    });
  }
};

module.exports = AuthController;