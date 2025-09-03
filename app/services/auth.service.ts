import { ApiClient } from '~/lib/api';
import type { 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RefreshTokenRequest,
  User 
} from '~/types/auth';

// Serviço de autenticação
export class AuthService extends ApiClient {
  constructor() {
    super('/auth');
  }

  // Login do usuário
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>('/login', credentials);
    
    // Salvar tokens no localStorage
    if (response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('tokenExpiry', response.data.expiresIn.toString());
      
      // Configurar token no cliente da API
      this.setAuthToken(response.data.accessToken);
    }
    
    return response.data;
  }

  // Registro de usuário
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await this.post<LoginResponse>('/register', userData);
    
    // Salvar tokens no localStorage
    if (response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('tokenExpiry', response.data.expiresIn.toString());
      
      // Configurar token no cliente da API
      this.setAuthToken(response.data.accessToken);
    }
    
    return response.data;
  }

  // Logout do usuário
  async logout(): Promise<void> {
    try {
      await this.post('/logout');
    } catch (error) {
      // Mesmo se der erro no servidor, limpar tokens localmente
      console.warn('Erro ao fazer logout no servidor:', error);
    } finally {
      // Limpar tokens do localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
      
      // Remover token do cliente da API
      this.removeAuthToken();
    }
  }

  // Refresh do token
  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const response = await this.post<LoginResponse>('/refresh', {
      refreshToken
    } as RefreshTokenRequest);
    
    // Atualizar tokens no localStorage
    if (response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('tokenExpiry', response.data.expiresIn.toString());
      
      // Configurar novo token no cliente da API
      this.setAuthToken(response.data.accessToken);
    }
    
    return response.data;
  }

  // Obter perfil do usuário
  async getProfile(): Promise<User> {
    const response = await this.get<User>('/profile');
    return response.data;
  }

  // Atualizar perfil do usuário
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.put<User>('/profile', userData);
    return response.data;
  }

  // Alterar senha
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.put('/change-password', {
      currentPassword,
      newPassword
    });
  }

  // Solicitar reset de senha
  async requestPasswordReset(email: string): Promise<void> {
    await this.post('/forgot-password', { email });
  }

  // Reset de senha
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.post('/reset-password', {
      token,
      newPassword
    });
  }

  // Verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) {
      return false;
    }
    
    // Verificar se o token não expirou
    const now = Date.now();
    const tokenExpiry = parseInt(expiry);
    
    return now < tokenExpiry;
  }

  // Obter token atual
  getCurrentToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Verificar se o token está próximo do vencimento
  isTokenExpiringSoon(minutesThreshold: number = 5): boolean {
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!expiry) {
      return true;
    }
    
    const now = Date.now();
    const tokenExpiry = parseInt(expiry);
    const threshold = minutesThreshold * 60 * 1000; // Converter para milissegundos
    
    return (tokenExpiry - now) < threshold;
  }
}

// Instância do serviço de autenticação
export const authService = new AuthService();
