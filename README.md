# Chat App - Sistema de Chat en Tiempo Real
<div align="center">
  <img src="https://raw.githubusercontent.com/Bjohan23/chat/main/.github/images/logo.png" alt="Chat App Logo" width="200" height="200" style="border-radius: 20px" onerror="this.onerror=null; this.src='https://via.placeholder.com/200?text=Chat+App'"/>
  <h3>Una aplicación de chat moderna con soporte para grupos, multimedia y tema oscuro</h3>
  <p>
    <a href="https://github.com/Bjohan23/chat/stargazers">
      <img alt="GitHub stars" src="https://img.shields.io/github/stars/Bjohan23/chat?style=for-the-badge&color=yellow"/>
    </a>
    <a href="https://github.com/Bjohan23/chat/network">
      <img alt="GitHub forks" src="https://img.shields.io/github/forks/Bjohan23/chat?style=for-the-badge&color=orange"/>
    </a>
    <a href="https://github.com/Bjohan23/chat/issues">
      <img alt="GitHub issues" src="https://img.shields.io/github/issues/Bjohan23/chat?style=for-the-badge&color=red"/>
    </a>
    <a href="https://github.com/Bjohan23/chat/blob/main/LICENSE">
      <img alt="License" src="https://img.shields.io/github/license/Bjohan23/chat?style=for-the-badge&color=blue"/>
    </a>
  </p>
</div>

## 🌟 Características

- ✅ Mensajería en tiempo real con Socket.IO
- 🔐 Autenticación JWT para proteger los datos de los usuarios
- 👥 Sistema de grupos para diferentes temas de conversación
- 📱 Diseño responsive que se adapta a diferentes dispositivos
- 🌙 Modo oscuro/claro para una experiencia visual personalizada
- 📸 Soporte para multimedia (imágenes, videos, audio)
- 🔍 Búsqueda de grupos para encontrar conversaciones de interés

## 🛠️ Tecnologías
### Backend

- Node.js - Entorno de ejecución
- Express.js - Framework para API REST
- Socket.IO - Comunicación en tiempo real
- JWT - Autenticación de usuarios

### Frontend

- React - Biblioteca UI
- Vite - Herramienta de construcción
- Socket.IO Client - Cliente para WebSockets
- Tailwind CSS - Framework CSS
- React Router - Enrutamiento
- React Icons - Iconografía
- React Hot Toast - Notificaciones

## 📋 Prerrequisitos

- Node.js (v14.0.0 o superior)
- npm o yarn

## 🚀 Instalación
### Clonar el repositorio
```bash
git clone https://github.com/Bjohan23/chat.git
cd chat
```

### Configurar el Backend
```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env (editar con tus propias variables)
cp .env.example .env

# Iniciar el servidor
npm run dev
```

### Configurar el Frontend
```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

## 🏗️ Estructura del Proyecto
```
chat/
├── backend/              # Servidor Node.js
│   ├── src/              # Código fuente
│   │   ├── config/       # Configuración (JWT, Socket.IO)
│   │   ├── controllers/  # Controladores para rutas
│   │   ├── middlewares/  # Middlewares (auth, socket)
│   │   ├── models/       # Modelos (usuario, grupo)
│   │   ├── routes/       # Rutas API
│   │   ├── socket/       # Lógica de WebSockets
│   │   └── index.js      # Punto de entrada
│   └── package.json      # Dependencias del backend
└── frontend/             # Cliente React
    ├── public/           # Archivos estáticos
    ├── src/              # Código fuente
    │   ├── api/          # Comunicación con la API
    │   ├── components/   # Componentes React
    │   ├── context/      # Contextos (Auth, Socket, Theme)
    │   ├── hooks/        # Hooks personalizados
    │   ├── pages/        # Páginas principales
    │   └── utils/        # Utilidades
    └── package.json      # Dependencias del frontend
```

## 📱 Capturas de Pantalla
<div align="center">
  <img src="https://raw.githubusercontent.com/Bjohan23/chat/main/.github/images/screenshot-light.png" alt="Modo Claro" width="45%" />
  <img src="https://raw.githubusercontent.com/Bjohan23/chat/main/.github/images/screenshot-dark.png" alt="Modo Oscuro" width="45%" />
</div>

## 🔍 Uso

### Registro e Inicio de Sesión:

- Crea una cuenta o inicia sesión para acceder a todas las funcionalidades
- Los usuarios no autenticados pueden ver grupos pero no enviar mensajes


### Grupos de Chat:

- Explora grupos existentes
- Crea nuevos grupos para diferentes temas (requiere autenticación)
- Unirse a grupos para participar en conversaciones


### Mensajería en Tiempo Real:

- Envía mensajes de texto
- Comparte archivos multimedia (imágenes, videos, audio)
- Ver quién está en línea


### Personalización:

- Cambia entre modo claro y oscuro según tus preferencias



## 🌐 API Endpoints
| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | /api/auth/register | Registro de usuario | No |
| POST | /api/auth/login | Inicio de sesión | No |
| GET | /api/auth/me | Obtener usuario actual | Sí |
| GET | /api/groups | Listar todos los grupos | No |
| POST | /api/groups | Crear un nuevo grupo | Sí |
| GET | /api/groups/:id | Obtener detalles de un grupo | No |
| GET | /api/groups/:id/messages | Obtener mensajes de un grupo | No |
| GET | /api/media/:groupId/:id | Obtener archivo multimedia | No |

## 🔌 Eventos de Socket.IO
| Evento | Descripción | Dirección |
|--------|-------------|-----------|
| joinGroup | Unirse a un grupo | Cliente → Servidor |
| leaveGroup | Abandonar un grupo | Cliente → Servidor |
| sendMessage | Enviar mensaje de texto | Cliente → Servidor |
| sendMediaMessage | Enviar mensaje multimedia | Cliente → Servidor |
| newMessage | Recibir nuevo mensaje | Servidor → Cliente |
| groupHistory | Recibir historial de mensajes | Servidor → Cliente |
| onlineUsers | Actualización de usuarios conectados | Servidor → Cliente |

## 🤝 Contribuir
Las contribuciones son bienvenidas. Para contribuir:

1. Haz un Fork del proyecto
2. Crea una nueva rama (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Haz Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia
Este proyecto está bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.

## 👏 Agradecimientos

- Socket.IO por su excelente biblioteca para WebSockets
- React y todo su ecosistema
- La comunidad de código abierto


<div align="center">
  <p>Desarrollado con ❤️ por <a href="https://github.com/Bjohan23">Bjohan23</a></p>
</div>