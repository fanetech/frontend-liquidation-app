import api from './api.js';
import { ENDPOINTS } from '../config.js';

export const liquidationService = {
  // Lister les liquidations avec filtres et pagination
  async list(filters = {}) {
    try {
      const {
        customerId,
        status,
        startDate,
        endDate,
        page = 0,
        size = 10
      } = filters;

      const params = { page, size };
      
      if (customerId) params.customerId = customerId;
      if (status) params.status = status;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await api.get(ENDPOINTS.LIQUIDATIONS, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors de la récupération des liquidations');
    }
  },

  // Obtenir une liquidation par ID
  async get(id) {
    try {
      const response = await api.get(`${ENDPOINTS.LIQUIDATIONS}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors de la récupération de la liquidation');
    }
  },

  // Créer une nouvelle liquidation
  async create(liquidationData) {
    try {
      const response = await api.post(ENDPOINTS.LIQUIDATIONS, liquidationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors de la création de la liquidation');
    }
  },

  // Mettre à jour une liquidation
  async update(id, liquidationData) {
    try {
      const response = await api.put(`${ENDPOINTS.LIQUIDATIONS}/${id}`, liquidationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors de la mise à jour de la liquidation');
    }
  },

  // Marquer une liquidation comme payée
  async payLiquidation(id) {
    try {
      const response = await api.put(`${ENDPOINTS.LIQUIDATIONS}/${id}/pay`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors du paiement de la liquidation');
    }
  },

  // Obtenir les liquidations d'un client
  async getByCustomer(customerId) {
    try {
      const response = await api.get(`${ENDPOINTS.LIQUIDATIONS}/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors de la récupération des liquidations du client');
    }
  },

  // Calculer la pénalité pour une liquidation
  async calculatePenalty(id, dailyRate = 0.0) {
    try {
      const response = await api.get(`${ENDPOINTS.LIQUIDATIONS}/${id}/penalty`, {
        params: { dailyRate }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Erreur lors du calcul de la pénalité');
    }
  }
};

export default liquidationService;
