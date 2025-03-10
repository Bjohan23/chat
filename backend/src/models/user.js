// Almacenamiento en memoria para usuarios
const users = [];
let nextId = 1;

const User = {
  // Crear un usuario
  create: (userData) => {
    const user = {
      id: nextId++,
      username: userData.username,
      password: userData.password,
      createdAt: new Date()
    };
    users.push(user);
    return { ...user, password: undefined }; // Devolver sin la contraseña
  },

  // Encontrar un usuario por nombre de usuario
  findByUsername: (username) => {
    return users.find(user => user.username === username);
  },

  // Encontrar un usuario por ID
  findById: (id) => {
    return users.find(user => user.id === id);
  },

  // Listar todos los usuarios (sin contraseñas)
  list: () => {
    return users.map(user => ({ ...user, password: undefined }));
  }
};

module.exports = User;