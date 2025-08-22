import api from './api';
import { config } from '../config';

const LIQ_ENDPOINT = config.ENDPOINTS.LIQUIDATIONS;

// Liste paginée avec filtres
export async function listLiquidations({ customerId, status, startDate, endDate, page = 0, size = 10 } = {}) {
  const params = new URLSearchParams();
  if (customerId) params.append('customerId', customerId);
  if (status) params.append('status', status);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  params.append('page', page);
  params.append('size', size);
  const { data } = await api.get(`${LIQ_ENDPOINT}?${params.toString()}`);
  return data; // Spring Page<Liquidation>
}

export async function getLiquidation(id) {
  const { data } = await api.get(`${LIQ_ENDPOINT}/${id}`);
  return data;
}

export async function createLiquidation(liquidation) {
  const { data } = await api.post(LIQ_ENDPOINT, liquidation);
  return data;
}

export async function updateLiquidation(id, liquidation) {
  const { data } = await api.put(`${LIQ_ENDPOINT}/${id}`, liquidation);
  return data;
}

export async function payLiquidation(id) {
  const { data } = await api.put(`${LIQ_ENDPOINT}/${id}/pay`);
  return data;
}

export async function listByCustomer(customerId) {
  const { data } = await api.get(`${LIQ_ENDPOINT}/customer/${customerId}`);
  return data;
}

export async function getPenalty(id, dailyRate = 0.0) {
  const { data } = await api.get(`${LIQ_ENDPOINT}/${id}/penalty?dailyRate=${dailyRate}`);
  return data;
}
