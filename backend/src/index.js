const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/group');
const mediaRoutes = require('./routes/media'); // Nueva ruta para archivos multimedia

// Importar configuración de Socket.IO
const setupSocket = require('./socket');

// Crear aplicación Express
const app = express();
const server = http.createServer(app);

// Configuración de middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentar límite para archivos grandes
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/media', mediaRoutes); // Añadir rutas para archivos multimedia

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Chat con Socket.IO' });
});

// Configurar Socket.IO
const io = setupSocket(server);

// Puerto de escucha
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

// Exportar para tests u otros usos
module.exports = { app, server, io };