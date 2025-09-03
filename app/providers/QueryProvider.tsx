import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Configuração do cliente React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo de cache padrão
      staleTime: 5 * 60 * 1000, // 5 minutos
      // Tempo de garbage collection
      gcTime: 10 * 60 * 1000, // 10 minutos
      // Retry automático
      retry: (failureCount, error: any) => {
        // Não tentar novamente para erros 4xx (exceto 408, 429)
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 408 && error?.status !== 429) {
          return false;
        }
        // Tentar até 3 vezes para outros erros
        return failureCount < 3;
      },
      // Delay entre tentativas
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry para mutations
      retry: (failureCount, error: any) => {
        // Não tentar novamente para erros 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Tentar até 2 vezes para outros erros
        return failureCount < 2;
      },
      // Delay entre tentativas
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Provider do React Query
export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools apenas em desenvolvimento */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
};

// Exportar o cliente para uso em outros lugares
export { queryClient };
