const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/groupController');
const { authenticateJWT, optionalAuth } = require('../middlewares/auth');

// Rutas que requieren autenticación
router.post('/', authenticateJWT, GroupController.create);

// Rutas con autenticación opcional (para lectura pública)
router.get('/', optionalAuth, GroupController.list);
router.get('/:id', optionalAuth, GroupController.getById);
router.get('/:id/messages', optionalAuth, GroupController.getMessages);

module.exports = router;