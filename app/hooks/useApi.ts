import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ApiClient } from '~/lib/api';
import type { ApiResponse, ApiError } from '~/types/api';

// Hook genérico para operações de API
export const useApi = <T = any, D = any>(
  apiClient: ApiClient,
  endpoint: string
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Mutation para GET
  const getMutation = useMutation({
    mutationFn: (params?: Record<string, any>) => 
      apiClient.get<T>(endpoint, { params }),
    onSuccess: () => {
      setError(null);
    },
    onError: (error: ApiError) => {
      setError(error);
    }
  });

  // Mutation para POST
  const postMutation = useMutation({
    mutationFn: (data: D) => apiClient.post<T, D>(endpoint, data),
    onSuccess: () => {
      setError(null);
    },
    onError: (error: ApiError) => {
      setError(error);
    }
  });

  // Mutation para PUT
  const putMutation = useMutation({
    mutationFn: (data: D) => apiClient.put<T, D>(endpoint, data),
    onSuccess: () => {
      setError(null);
    },
    onError: (error: ApiError) => {
      setError(error);
    }
  });

  // Mutation para PATCH
  const patchMutation = useMutation({
    mutationFn: (data: Partial<D>) => apiClient.patch<T, Partial<D>>(endpoint, data),
    onSuccess: () => {
      setError(null);
    },
    onError: (error: ApiError) => {
      setError(error);
    }
  });

  // Mutation para DELETE
  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete<T>(endpoint),
    onSuccess: () => {
      setError(null);
    },
    onError: (error: ApiError) => {
      setError(error);
    }
  });

  // Funções de ação
  const get = useCallback((params?: Record<string, any>) => {
    setIsLoading(true);
    return getMutation.mutateAsync(params).finally(() => setIsLoading(false));
  }, [getMutation]);

  const post = useCallback((data: D) => {
    setIsLoading(true);
    return postMutation.mutateAsync(data).finally(() => setIsLoading(false));
  }, [postMutation]);

  const put = useCallback((data: D) => {
    setIsLoading(true);
    return putMutation.mutateAsync(data).finally(() => setIsLoading(false));
  }, [putMutation]);

  const patch = useCallback((data: Partial<D>) => {
    setIsLoading(true);
    return patchMutation.mutateAsync(data).finally(() => setIsLoading(false));
  }, [patchMutation]);

  const del = useCallback(() => {
    setIsLoading(true);
    return deleteMutation.mutateAsync().finally(() => setIsLoading(false));
  }, [deleteMutation]);

  // Função para limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    isLoading: isLoading || 
      getMutation.isPending || 
      postMutation.isPending || 
      putMutation.isPending || 
      patchMutation.isPending || 
      deleteMutation.isPending,
    error: error || 
      getMutation.error || 
      postMutation.error || 
      putMutation.error || 
      patchMutation.error || 
      deleteMutation.error,
    
    // Dados
    data: getMutation.data?.data || 
      postMutation.data?.data || 
      putMutation.data?.data || 
      patchMutation.data?.data,
    
    // Ações
    get,
    post,
    put,
    patch,
    delete: del,
    clearError,
    
    // Estados individuais
    isGetting: getMutation.isPending,
    isPosting: postMutation.isPending,
    isPutting: putMutation.isPending,
    isPatching: patchMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Sucessos
    isGetSuccess: getMutation.isSuccess,
    isPostSuccess: postMutation.isSuccess,
    isPutSuccess: putMutation.isSuccess,
    isPatchSuccess: patchMutation.isSuccess,
    isDeleteSuccess: deleteMutation.isSuccess
  };
};

// Hook para upload de arquivos
export const useFileUpload = <T = any>(
  apiClient: ApiClient,
  endpoint: string
) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<ApiError | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => 
      apiClient.upload<T>(endpoint, file, setUploadProgress),
    onSuccess: () => {
      setError(null);
      setUploadProgress(0);
    },
    onError: (error: ApiError) => {
      setError(error);
      setUploadProgress(0);
    }
  });

  const upload = useCallback((file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    return uploadMutation.mutateAsync(file).finally(() => setIsUploading(false));
  }, [uploadMutation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    upload,
    isUploading,
    uploadProgress,
    error,
    data: uploadMutation.data?.data,
    isSuccess: uploadMutation.isSuccess,
    clearError
  };
};
