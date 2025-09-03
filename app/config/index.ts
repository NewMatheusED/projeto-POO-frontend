// Exportações centralizadas de configuração
import { env, validateEnv } from './env';
export { env, validateEnv };

// Re-exportações para facilitar importação
export const config = {
  api: {
    baseURL: env.API_BASE_URL,
    timeout: 10000,
    retries: 3,
    retryDelay: 1000
  },
  app: {
    name: env.APP_NAME,
    version: env.APP_VERSION,
    environment: env.APP_ENVIRONMENT
  },
  storage: {
    tokenKey: env.TOKEN_STORAGE_KEY,
    refreshTokenKey: env.REFRESH_TOKEN_STORAGE_KEY
  },
  debug: {
    enabled: env.DEBUG_MODE,
    devtools: env.ENABLE_DEVTOOLS
  }
} as const;
