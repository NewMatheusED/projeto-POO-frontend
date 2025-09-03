import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { type ApiError, type RequestConfig } from '~/types/api';

// Configuração base da API
const API_BASE_URL = 'https://projeto-poo-jkax.onrender.com/api/v1';
const API_TIMEOUT = 10000; // 10 segundos

// Interceptor para requests
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // Adicionar token de autenticação se disponível (quando implementado)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Adicionar timestamp para evitar cache
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now()
    };
  }

  return config;
};

// Interceptor para responses
const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

// Interceptor para erros
const errorInterceptor = (error: any): Promise<ApiError> => {
  const apiError: ApiError = {
    message: 'Erro interno do servidor',
    status: 500,
    code: 'INTERNAL_ERROR'
  };

  if (error.response) {
    // Erro de resposta do servidor
    apiError.status = error.response.status;
    apiError.message = error.response.data?.message || error.message;
    apiError.code = error.response.data?.code;
    apiError.details = error.response.data?.details;
  } else if (error.request) {
    // Erro de rede
    apiError.message = 'Erro de conexão com o servidor';
    apiError.code = 'NETWORK_ERROR';
  } else {
    // Outros erros
    apiError.message = error.message;
    apiError.code = 'UNKNOWN_ERROR';
  }

  return Promise.reject(apiError);
};

// Criar instância do axios
export const createApiClient = (baseURL: string = API_BASE_URL): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  // Configurar interceptors
  client.interceptors.request.use(requestInterceptor, errorInterceptor);
  client.interceptors.response.use(responseInterceptor, errorInterceptor);

  return client;
};

// Instância principal da API
export const apiClient = createApiClient();

// Configuração de retry para requests
export const retryConfig: RequestConfig = {
  retries: 3,
  retryDelay: 1000
};
