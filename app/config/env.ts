// Configurações de ambiente
export const env = {
  // API
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // App
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Projeto POO Frontend',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  APP_ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  
  // Storage
  TOKEN_STORAGE_KEY: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'accessToken',
  REFRESH_TOKEN_STORAGE_KEY: import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'refreshToken',
  
  // Debug
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  ENABLE_DEVTOOLS: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  
  // Development
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// Validação de variáveis de ambiente obrigatórias
export const validateEnv = () => {
  const requiredVars = [
    'VITE_API_BASE_URL'
  ];
  
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Variáveis de ambiente ausentes:', missingVars);
  }
  
  return missingVars.length === 0;
};

// Executar validação em desenvolvimento
if (env.IS_DEV) {
  validateEnv();
}
