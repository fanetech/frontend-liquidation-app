import axios from 'axios';
import { API_BASE_URL, ENDPOINTS, JWT_STORAGE_KEY, USER_STORAGE_KEY, ROLES } from '../config.js';

// Configuration axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(JWT_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  // Connexion
  async login(username, password) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
        username,
        password
      });
      
      const { token, username: user, role, redirect } = response.data;
      
      // Stocker le token et les données utilisateur
      localStorage.setItem(JWT_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({
        username: user,
        role,
        redirect
      }));
      
      return { token, username: user, role, redirect };
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur de connexion');
    }
  },

  // Inscription utilisateur
  async registerUser(username, password) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER_USER, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur d\'inscription');
    }
  },

  // Inscription admin
  async registerAdmin(username, password) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER_ADMIN, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur d\'inscription admin');
    }
  },

  // Déconnexion
  logout() {
    localStorage.removeItem(JWT_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!localStorage.getItem(JWT_STORAGE_KEY);
  },

  // Obtenir les données utilisateur
  getCurrentUser() {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Vérifier si l'utilisateur est admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === ROLES.ADMIN;
  },

  // Obtenir le token JWT
  getToken() {
    return localStorage.getItem(JWT_STORAGE_KEY);
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
