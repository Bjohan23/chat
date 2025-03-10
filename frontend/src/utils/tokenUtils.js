import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'chat_auth_token';
const USER_KEY = 'chat_user';

// Almacenar token y datos de usuario en localStorage
export const setToken = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Obtener token del localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Obtener información del usuario del localStorage
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Verificar si el token ha expirado
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Eliminar token y datos de usuario (logout)
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
