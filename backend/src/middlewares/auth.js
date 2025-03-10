const { verifyToken } = require('../config/jwt');
const User = require('../models/user');

// Middleware para verificar autenticación
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  const userData = verifyToken(token);
  
  if (!userData) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
  
  // Verificar que el usuario existe
  const user = User.findById(userData.id);
  if (!user) {
    return res.status(403).json({ message: 'Usuario no encontrado' });
  }
  
  // Añadir el usuario al objeto request
  req.user = userData;
  next();
};

// Middleware opcional que permite acceso incluso sin autenticación
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const userData = verifyToken(token);
    
    if (userData) {
      // Verificar que el usuario existe
      const user = User.findById(userData.id);
      if (user) {
        req.user = userData;
      }
    }
  }
  
  next();
};

module.exports = {
  authenticateJWT,
  optionalAuth
};