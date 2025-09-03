import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { userService } from '~/services/user.service';
import type { User, UserRole } from '~/types/auth';
import type { SearchParams } from '~/types/common';

// Hook para gerenciamento de usuários
export const useUsers = (initialParams?: SearchParams) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    page: 1,
    limit: 10,
    ...initialParams
  });

  const queryClient = useQueryClient();

  // Query para listar usuários
  const {
    data: usersData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', searchParams],
    queryFn: () => userService.getUsers(searchParams),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // Query para estatísticas de usuários
  const {
    data: userStats,
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['users', 'stats'],
    queryFn: () => userService.getUserStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para criar usuário
  const createUserMutation = useMutation({
    mutationFn: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
      userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
    }
  });

  // Mutation para atualizar usuário
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) =>
      userService.updateUser(id, userData),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['users', updatedUser.id], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Mutation para deletar usuário
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
    }
  });

  // Mutation para atualizar role do usuário
  const updateUserRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      userService.updateUserRole(id, role),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['users', updatedUser.id], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Mutation para ativar/desativar usuário
  const toggleUserStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      userService.toggleUserStatus(id, isActive),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['users', updatedUser.id], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
    }
  });

  // Função para atualizar parâmetros de busca
  const updateSearchParams = useCallback((newParams: Partial<SearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...newParams,
      page: newParams.page || 1 // Reset para primeira página quando mudar filtros
    }));
  }, []);

  // Função para criar usuário
  const createUser = useCallback((userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    createUserMutation.mutate(userData);
  }, [createUserMutation]);

  // Função para atualizar usuário
  const updateUser = useCallback((id: string, userData: Partial<User>) => {
    updateUserMutation.mutate({ id, userData });
  }, [updateUserMutation]);

  // Função para deletar usuário
  const deleteUser = useCallback((id: string) => {
    deleteUserMutation.mutate(id);
  }, [deleteUserMutation]);

  // Função para atualizar role do usuário
  const updateUserRole = useCallback((id: string, role: UserRole) => {
    updateUserRoleMutation.mutate({ id, role });
  }, [updateUserRoleMutation]);

  // Função para ativar/desativar usuário
  const toggleUserStatus = useCallback((id: string, isActive: boolean) => {
    toggleUserStatusMutation.mutate({ id, isActive });
  }, [toggleUserStatusMutation]);

  // Função para buscar usuários por email
  const searchUsersByEmail = useCallback(async (email: string) => {
    try {
      return await userService.searchUsersByEmail(email);
    } catch (error) {
      console.error('Erro ao buscar usuários por email:', error);
      return [];
    }
  }, []);

  // Função para exportar usuários
  const exportUsers = useCallback(async (format: 'csv' | 'xlsx' = 'csv') => {
    try {
      return await userService.exportUsers(format);
    } catch (error) {
      console.error('Erro ao exportar usuários:', error);
      throw error;
    }
  }, []);

  // Função para importar usuários
  const importUsers = useCallback(async (file: File) => {
    try {
      const result = await userService.importUsers(file);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
      return result;
    } catch (error) {
      console.error('Erro ao importar usuários:', error);
      throw error;
    }
  }, [queryClient]);

  return {
    // Dados
    users: (usersData as any)?.data || [],
    pagination: (usersData as any)?.pagination,
    userStats,
    
    // Estados de loading
    isLoading,
    isLoadingStats,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isUpdatingRole: updateUserRoleMutation.isPending,
    isTogglingStatus: toggleUserStatusMutation.isPending,
    
    // Erros
    error,
    createError: createUserMutation.error,
    updateError: updateUserMutation.error,
    deleteError: deleteUserMutation.error,
    updateRoleError: updateUserRoleMutation.error,
    toggleStatusError: toggleUserStatusMutation.error,
    
    // Parâmetros de busca
    searchParams,
    
    // Ações
    updateSearchParams,
    createUser,
    updateUser,
    deleteUser,
    updateUserRole,
    toggleUserStatus,
    searchUsersByEmail,
    exportUsers,
    importUsers,
    refetch
  };
};
