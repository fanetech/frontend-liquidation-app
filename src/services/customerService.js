import api from './api.js';
import { ENDPOINTS } from '../config.js';

export const customerService = {
  // Lister les clients avec pagination
  async list(page = 0, size = 10) {
    try {
      const response = await api.get(ENDPOINTS.CUSTOMERS, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors de la récupération des clients');
    }
  },

  // Rechercher des clients
  async search(term = '', page = 0, size = 10) {
    try {
      const response = await api.get(`${ENDPOINTS.CUSTOMERS}/search`, {
        params: { q: term, page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors de la recherche des clients');
    }
  },

  // Obtenir un client par ID
  async get(id) {
    try {
      const response = await api.get(`${ENDPOINTS.CUSTOMERS}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors de la récupération du client');
    }
  },

  // Créer un nouveau client
  async create(customerData) {
    try {
      const response = await api.post(ENDPOINTS.CUSTOMERS, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors de la création du client');
    }
  },

  // Mettre à jour un client
  async update(id, customerData) {
    try {
      const response = await api.put(`${ENDPOINTS.CUSTOMERS}/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors de la mise à jour du client');
    }
  },

  // Supprimer un client
  async delete(id) {
    try {
      await api.delete(`${ENDPOINTS.CUSTOMERS}/${id}`);
      return true;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors de la suppression du client');
    }
  }
};

export default customerService;
