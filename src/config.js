// Configuration de l'application
export const config = {
  // URL de l'API backend
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  
  // URL du backend
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  
  // Configuration des timeouts
  REQUEST_TIMEOUT: 10000,
  
  // Messages d'erreur par défaut
  DEFAULT_ERROR_MESSAGE: 'Une erreur est survenue. Veuillez réessayer.',
  
  // Configuration de l'authentification
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  
  // Rôles de l'application
  ROLES: {
    USER: 'ROLE_USER',
    ADMIN: 'ROLE_ADMIN'
  },
  
  // Endpoints de l'API
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      CREATE_ADMIN: '/auth/create-admin'
    },
    CUSTOMERS: '/customers',
    LIQUIDATIONS: '/liquidations'
  }
};

export default config;
