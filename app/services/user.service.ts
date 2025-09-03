import { ApiClient } from '~/lib/api';
import type { User } from '~/types/auth';
import { UserRole } from '~/types/auth';
import type { SearchParams } from '~/types/common';
import type { PaginatedResponse } from '~/types/api';

// Serviço de usuários
export class UserService extends ApiClient {
  constructor() {
    super('/users');
  }

  // Listar usuários com paginação e filtros
  async getUsers(params?: SearchParams): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    
    if (params?.query) {
      queryParams.append('q', params.query);
    }
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params?.sort) {
      queryParams.append('sort', `${params.sort.field}:${params.sort.direction}`);
    }
    
    if (params?.filters) {
      params.filters.forEach(filter => {
        queryParams.append(`filter[${filter.field}][${filter.operator}]`, filter.value);
      });
    }

    const response = await this.get<PaginatedResponse<User>>(`?${queryParams.toString()}`);
    return response.data;
  }

  // Obter usuário por ID
  async getUserById(id: string): Promise<User> {
    const response = await this.get<User>(`/${id}`);
    return response.data;
  }

  // Criar novo usuário
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await this.post<User>('/', userData);
    return response.data;
  }

  // Atualizar usuário
  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response = await this.put<User>(`/${id}`, userData);
    return response.data;
  }

  // Deletar usuário
  async deleteUser(id: string): Promise<void> {
    await this.delete(`/${id}`);
  }

  // Atualizar role do usuário
  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const response = await this.patch<User>(`/${id}/role`, { role });
    return response.data;
  }

  // Ativar/desativar usuário
  async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    const response = await this.patch<User>(`/${id}/status`, { isActive });
    return response.data;
  }

  // Buscar usuários por email
  async searchUsersByEmail(email: string): Promise<User[]> {
    const response = await this.get<User[]>(`/search/email?q=${encodeURIComponent(email)}`);
    return response.data;
  }

  // Obter estatísticas de usuários
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<UserRole, number>;
  }> {
    const response = await this.get('/stats');
    return response.data;
  }

  // Exportar usuários
  async exportUsers(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await this.client.get(`${this.basePath}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Importar usuários
  async importUsers(file: File): Promise<{
    success: number;
    errors: Array<{ row: number; error: string }>;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post(`${this.basePath}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  }
}

// Instância do serviço de usuários
export const userService = new UserService();
