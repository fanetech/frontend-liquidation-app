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
    const response = await api.post(config.ENDPOINTS.AUTH.LOGIN, { username, password });
    return response.data;
  },

  register: async (username, password, role = null) => {
    const data = { username, password };
    if (role) {
      data.role = role;
    }
    const response = await api.post(config.ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },

  createAdmin: async (username, password) => {
    const response = await api.post(config.ENDPOINTS.AUTH.CREATE_ADMIN, { username, password });
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
      localStorage.removeItem('user');
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    if (!user || !user.roles) return false;
    
    const roles = Array.isArray(user.roles) ? user.roles : [];
    return roles.some(role => {
      const roleName = typeof role === 'string' ? role : role.name;
      return roleName === 'ROLE_ADMIN';
    });
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
