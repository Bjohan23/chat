const express = require('express');
const router = express.Router();
const Group = require('../models/group');
const { authenticateJWT, optionalAuth } = require('../middlewares/auth');

// Obtener un archivo multimedia
router.get('/:groupId/:mediaId', optionalAuth, (req, res) => {
  try {
    const { groupId, mediaId } = req.params;
    
    // Verificar que el grupo existe
    const group = Group.findById(parseInt(groupId));
    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }
    
    // Obtener el archivo
    const mediaFile = Group.getMediaFile(parseInt(groupId), mediaId);
    if (!mediaFile) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    
    // Enviar archivo
    const buffer = Buffer.from(mediaFile.data, 'base64');
    res.set('Content-Type', mediaFile.type);
    res.set('Content-Disposition', `inline; filename="${mediaFile.name}"`);
    res.set('Content-Length', buffer.length);
    return res.send(buffer);
  } catch (error) {
    console.error('Error al obtener archivo multimedia:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;