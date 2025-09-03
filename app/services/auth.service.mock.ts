import type { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  RegisterResponse, 
  User
} from '~/types/auth';
import { UserRole } from '~/types/auth';
import type { ApiResponse } from '~/types/api';

// Mock do AuthService para desenvolvimento
export class AuthServiceMock {
  private readonly STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user'
  };

  // Simular delay de rede
  private async delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Verificar se está no browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Login mock
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    await this.delay(800); // Simular delay de rede

    // Validação básica
    if (!credentials.email || !credentials.password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Simular usuário mock
    const mockUser: User = {
      id: '1',
      name: 'Usuário Teste',
      email: credentials.email,
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const mockTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    };

    // Salvar no localStorage se disponível
    if (this.isBrowser()) {
      localStorage.setItem(this.STORAGE_KEYS.ACCESS_TOKEN, mockTokens.accessToken);
      localStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, mockTokens.refreshToken);
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(mockUser));
    }

    return {
      data: {
        user: mockUser,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        expiresIn: 3600
      },
      message: 'Login realizado com sucesso',
      success: true,
      statusCode: 200
    };
  }

  // Register mock
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    await this.delay(1000);

    // Validação básica
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error('Todos os campos são obrigatórios');
    }

    if (userData.password !== userData.confirmPassword) {
      throw new Error('Senhas não coincidem');
    }

    // Simular usuário mock
    const mockUser: User = {
      id: '1',
      name: userData.name,
      email: userData.email,
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const mockTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    };

    // Salvar no localStorage se disponível
    if (this.isBrowser()) {
      localStorage.setItem(this.STORAGE_KEYS.ACCESS_TOKEN, mockTokens.accessToken);
      localStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, mockTokens.refreshToken);
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(mockUser));
    }

    return {
      data: {
        user: mockUser,
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        expiresIn: 3600
      },
      message: 'Conta criada com sucesso',
      success: true,
      statusCode: 201
    };
  }

  // Logout mock
  async logout(): Promise<ApiResponse<null>> {
    await this.delay(500);

    // Limpar localStorage se disponível
    if (this.isBrowser()) {
      localStorage.removeItem(this.STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(this.STORAGE_KEYS.USER);
    }

    return {
      data: null,
      message: 'Logout realizado com sucesso',
      success: true,
      statusCode: 200,
    };
  }

  // Refresh token mock
  async refreshToken(): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    await this.delay(500);

    const refreshToken = this.isBrowser() 
      ? localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN) 
      : null;

    if (!refreshToken) {
      throw new Error('Refresh token não encontrado');
    }

    const newTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    };

    // Salvar novos tokens
    if (this.isBrowser()) {
      localStorage.setItem(this.STORAGE_KEYS.ACCESS_TOKEN, newTokens.accessToken);
      localStorage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken);
    }

    return {
      data: newTokens,
      message: 'Token renovado com sucesso',
      success: true,
      statusCode: 200
    };
  }

  // Get profile mock
  async getProfile(): Promise<ApiResponse<User>> {
    await this.delay(300);

    if (!this.isBrowser()) {
      throw new Error('Não autenticado');
    }

    const userData = localStorage.getItem(this.STORAGE_KEYS.USER);
    if (!userData) {
      throw new Error('Usuário não encontrado');
    }

    try {
      const user = JSON.parse(userData);
      return {
        data: user,
        message: 'Perfil obtido com sucesso',
        success: true,
        statusCode: 200
      };
    } catch (error) {
      throw new Error('Erro ao obter perfil do usuário');
    }
  }

  // Update profile mock
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    await this.delay(800);

    if (!this.isBrowser()) {
      throw new Error('Não autenticado');
    }

    const currentUserData = localStorage.getItem(this.STORAGE_KEYS.USER);
    if (!currentUserData) {
      throw new Error('Usuário não encontrado');
    }

    try {
      const currentUser = JSON.parse(currentUserData);
      const updatedUser = {
        ...currentUser,
        ...userData,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      return {
        data: updatedUser,
        message: 'Perfil atualizado com sucesso',
        success: true,
        statusCode: 200
      };
    } catch (error) {
      throw new Error('Erro ao atualizar perfil');
    }
  }

  // Change password mock
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    await this.delay(1000);

    // Validação básica
    if (!currentPassword || !newPassword) {
      throw new Error('Senha atual e nova senha são obrigatórias');
    }

    if (newPassword.length < 6) {
      throw new Error('Nova senha deve ter pelo menos 6 caracteres');
    }

    // Simular validação de senha atual
    if (currentPassword !== 'senha123') {
      throw new Error('Senha atual incorreta');
    }

    return {
      data: null,
      message: 'Senha alterada com sucesso',
      success: true,
      statusCode: 200
    };
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    
    const token = localStorage.getItem(this.STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  }

  // Verificar se token está próximo do vencimento
  isTokenExpiringSoon(): boolean {
    // Mock: sempre retorna false para simplicidade
    return false;
  }

  // Obter token atual
  getAccessToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.STORAGE_KEYS.ACCESS_TOKEN);
  }

  // Obter refresh token
  getRefreshToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN);
  }
}

// Instância mock do serviço
export const authServiceMock = new AuthServiceMock();
