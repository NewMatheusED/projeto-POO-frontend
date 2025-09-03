import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '~/hooks/useAuth';
import type { User, AuthState } from '~/types/auth';

// Contexto de autenticação
interface AuthContextType extends AuthState {
  login: (credentials: { email: string; password: string }) => void;
  register: (userData: { name: string; email: string; password: string; confirmPassword: string }) => void;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  changePassword: (currentPassword: string, newPassword: string) => void;
  clearError: () => void;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
  isUpdatingProfile: boolean;
  isChangingPassword: boolean;
  loginError: any;
  registerError: any;
  logoutError: any;
  updateProfileError: any;
  changePasswordError: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// HOC para proteger rotas
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirecionar para login ou mostrar componente de não autenticado
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso Negado
            </h1>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para acessar esta página.
            </p>
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Fazer Login
            </a>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

// HOC para rotas públicas (apenas para usuários não autenticados)
export const withPublicRoute = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (isAuthenticated) {
      // Redirecionar para dashboard ou página principal
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Redirecionando...
            </h1>
            <p className="text-gray-600">
              Você já está logado. Redirecionando para o dashboard.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};
