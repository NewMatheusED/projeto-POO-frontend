// Exportações centralizadas da API
export { ApiClient, apiClientInstance } from './client';
export { createApiClient, apiClient, retryConfig } from './config';

// Re-exportações para facilitar importação
export type { ApiResponse, ApiError, PaginatedResponse, RequestConfig } from '~/types/api';
