import axios from 'axios';
import { config } from '../config';

const API_BASE_URL = config.API_BASE_URL;

// Configuration axios avec intercepteur pour ajouter le token JWT
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Erreur lors du parsing de l\'utilisateur:', error);
      localStorage.removeItem('user'); // Nettoyer les données corrompues
      return null;
    }
  },

  fetchCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      const userInfo = response.data;
      
      // Mettre à jour les informations utilisateur dans le localStorage
      const user = {
        id: userInfo.id,
        username: userInfo.username,
        enabled: userInfo.enabled,
        roles: userInfo.roles.map(roleName => ({ name: roleName }))
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.roles && user.roles.some(role => role.name === 'ROLE_ADMIN');
  }
};

// Service des produits
export const productService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (product) => {
    const response = await api.post('/products', product);
    return response.data;
  },

  update: async (id, product) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

export default api;
