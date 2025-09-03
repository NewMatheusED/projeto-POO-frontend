import { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { apiClient } from './config';
import { type ApiResponse, type ApiError, type RequestConfig } from '~/types/api';

// Classe base para clientes de API
export class ApiClient {
  protected client: AxiosInstance;
  protected basePath: string;

  constructor(basePath: string = '', client: AxiosInstance = apiClient) {
    this.client = client;
    this.basePath = basePath;
  }

  // Método GET genérico
  async get<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.get(
        `${this.basePath}${endpoint}`,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método POST genérico
  async post<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(
        `${this.basePath}${endpoint}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método PUT genérico
  async put<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.put(
        `${this.basePath}${endpoint}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método PATCH genérico
  async patch<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(
        `${this.basePath}${endpoint}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método DELETE genérico
  async delete<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(
        `${this.basePath}${endpoint}`,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Upload de arquivos
  async upload<T = any>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.post(
        `${this.basePath}${endpoint}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          }
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método para fazer request com retry
  async requestWithRetry<T = any>(
    requestFn: () => Promise<ApiResponse<T>>,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const { retries = 3, retryDelay = 1000 } = config || {};

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        
        // Aguardar antes da próxima tentativa
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }

    throw new Error('Máximo de tentativas excedido');
  }

  // Tratamento de erros
  private handleError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Erro do servidor',
        status: error.response.status,
        code: error.response.data?.code,
        details: error.response.data?.details
      };
    }

    if (error.request) {
      return {
        message: 'Erro de conexão com o servidor',
        status: 0,
        code: 'NETWORK_ERROR'
      };
    }

    return {
      message: error.message || 'Erro desconhecido',
      status: 500,
      code: 'UNKNOWN_ERROR'
    };
  }

  // Método para atualizar token de autenticação
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Método para remover token de autenticação
  removeAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

// Instância principal do cliente de API
export const apiClientInstance = new ApiClient();
