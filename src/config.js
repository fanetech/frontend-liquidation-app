// Configuration de l'API
export const API_BASE_URL = 'http://localhost:8080/api';

// Configuration JWT
export const JWT_STORAGE_KEY = 'liquidation_jwt_token';
export const USER_STORAGE_KEY = 'liquidation_user_data';

// Configuration des endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER_USER: '/auth/register/user',
    REGISTER_ADMIN: '/auth/register/admin'
  },
  CUSTOMERS: '/customers',
  LIQUIDATIONS: '/liquidations'
};

// Configuration des rôles
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

// Configuration des statuts de liquidation
export const LIQUIDATION_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE'
};

// Configuration des types de taxes
export const TAX_TYPES = [
  'TVA',
  'IS',
  'IRPP',
  'TSS',
  'AUTRES'
];
