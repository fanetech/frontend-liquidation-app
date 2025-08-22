import api from './api';
import { config } from '../config';

const CUSTOMERS_ENDPOINT = config.ENDPOINTS.CUSTOMERS;

export const customerService = {
  // Récupérer la liste paginée des clients
  getCustomers: async (page = 0, size = 10) => {
    const response = await api.get(`${CUSTOMERS_ENDPOINT}?page=${page}&size=${size}`);
    return response.data;
  },

  // Récupérer un client par ID
  getCustomerById: async (id) => {
    const response = await api.get(`${CUSTOMERS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Créer un nouveau client
  createCustomer: async (customerData) => {
    const response = await api.post(CUSTOMERS_ENDPOINT, customerData);
    return response.data;
  },

  // Mettre à jour un client
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`${CUSTOMERS_ENDPOINT}/${id}`, customerData);
    return response.data;
  },

  // Supprimer un client
  deleteCustomer: async (id) => {
    const response = await api.delete(`${CUSTOMERS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Rechercher des clients
  searchCustomers: async (searchTerm, page = 0, size = 10) => {
    const response = await api.get(`${CUSTOMERS_ENDPOINT}/search?q=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
    return response.data;
  }
};

export default customerService;
