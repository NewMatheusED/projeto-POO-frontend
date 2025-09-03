import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authServiceMock } from '~/services/auth.service.mock';
import type { LoginRequest, RegisterRequest, User, AuthState } from '~/types/auth';
import { UserRole } from '~/types/auth';

// CONFIGURAÇÃO: Para pular direto para o sistema (sem login)
// Mude para false quando implementar o sistema de login real
const SKIP_LOGIN = true;

// Hook para gerenciamento de autenticação (usando mock para desenvolvimento)
export const useAuth = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: SKIP_LOGIN, // Pula login se SKIP_LOGIN = true
    isLoading: true,
    error: null
  });

  const queryClient = useQueryClient();

  // Verificar se está hidratado
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Query para obter perfil do usuário
  const {
    data: user,
    isLoading: isLoadingProfile,
    error: profileError
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => authServiceMock.getProfile(),
    enabled: isHydrated && authServiceMock.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authServiceMock.login(credentials),
    onSuccess: (response: any) => {
      setAuthState(prev => ({
        ...prev,
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));
      queryClient.setQueryData(['auth', 'profile'], response.data.user);
    },
    onError: (error: any) => {
      setAuthState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
    }
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => authServiceMock.register(userData),
    onSuccess: (response: any) => {
      setAuthState(prev => ({
        ...prev,
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));
      queryClient.setQueryData(['auth', 'profile'], response.data.user);
    },
    onError: (error: any) => {
      setAuthState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
    }
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: () => authServiceMock.logout(),
    onSuccess: () => {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      queryClient.clear();
    },
    onError: (error: any) => {
      // Mesmo com erro, limpar estado local
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message
      });
      queryClient.clear();
    }
  });

  // Mutation para atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: (userData: Partial<User>) => authServiceMock.updateProfile(userData),
    onSuccess: (data) => {
      setAuthState(prev => ({
        ...prev,
        user: data.data
      }));
      queryClient.setQueryData(['auth', 'profile'], data.data);
    },
    onError: (error: any) => {
      setAuthState(prev => ({
        ...prev,
        error: error.message
      }));
    }
  });

  // Mutation para alterar senha
  const changePasswordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authServiceMock.changePassword(currentPassword, newPassword),
    onError: (error: any) => {
      setAuthState(prev => ({
        ...prev,
        error: error.message
      }));
    }
  });

  // Função para fazer login
  const login = useCallback((credentials: LoginRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    loginMutation.mutate(credentials);
  }, [loginMutation]);

  // Função para fazer registro
  const register = useCallback((userData: RegisterRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    registerMutation.mutate(userData);
  }, [registerMutation]);

  // Função para fazer logout
  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  // Função para atualizar perfil
  const updateProfile = useCallback((userData: Partial<User>) => {
    updateProfileMutation.mutate(userData);
  }, [updateProfileMutation]);

  // Função para alterar senha
  const changePassword = useCallback((currentPassword: string, newPassword: string) => {
    changePasswordMutation.mutate({ currentPassword, newPassword });
  }, [changePasswordMutation]);

  // Função para limpar erro
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Verificar autenticação na inicialização (apenas após hidratação)
  useEffect(() => {
    if (!isHydrated) return;

    const checkAuth = async () => {
      try {
        if (SKIP_LOGIN || authServiceMock.isAuthenticated()) {
          // Se SKIP_LOGIN está ativo, criar usuário mock
          if (SKIP_LOGIN && !authServiceMock.isAuthenticated()) {
            const mockUser = {
              id: '1',
              name: 'Usuário Desenvolvimento',
              email: 'dev@exemplo.com',
              role: UserRole.ADMIN,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            setAuthState({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return;
          }

          // Se o token está próximo do vencimento, tentar renovar
          if (authServiceMock.isTokenExpiringSoon()) {
            try {
              await authServiceMock.refreshToken();
            } catch (error) {
              // Se não conseguir renovar, fazer logout
              await authServiceMock.logout();
              setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
              });
              return;
            }
          }

          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            isLoading: false
          }));
        } else {
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: false,
            isLoading: false
          }));
        }
      } catch (error) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
          error: 'Erro ao verificar autenticação'
        }));
      }
    };

    checkAuth();
  }, [isHydrated]);

  // Atualizar estado quando o perfil é carregado
  useEffect(() => {
    if (user) {
      setAuthState(prev => ({
        ...prev,
        user: user.data,
        isAuthenticated: true,
        isLoading: false
      }));
    }
  }, [user]);

  // Atualizar estado quando há erro no perfil
  useEffect(() => {
    if (profileError) {
      setAuthState(prev => ({
        ...prev,
        error: (profileError as any).message,
        isLoading: false
      }));
    }
  }, [profileError]);

  return {
    // Estado
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: !isHydrated || authState.isLoading || isLoadingProfile,
    error: authState.error,
    
    // Ações
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    
    // Estados das mutations
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    
    // Dados das mutations
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
    updateProfileError: updateProfileMutation.error,
    changePasswordError: changePasswordMutation.error
  };
};
