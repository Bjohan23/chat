const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/auth');

// Rutas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Rutas protegidas
router.get('/me', authenticateJWT, AuthController.getCurrentUser);

module.exports = router;