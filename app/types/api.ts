// Tipos base para API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Configurações de request
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Headers customizados
export interface ApiHeaders {
  [key: string]: string;
}

// Configuração de autenticação
export interface AuthConfig {
  token?: string;
  refreshToken?: string;
  tokenExpiry?: number;
}
