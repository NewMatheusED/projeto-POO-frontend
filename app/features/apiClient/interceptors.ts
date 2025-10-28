import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// Callback para logout quando refresh falhar
let logoutCallback: (() => void) | null = null;

export function setLogoutCallback(callback: () => void) {
  logoutCallback = callback;
}

export async function setupAuthInterceptor(client: AxiosInstance) {
  // Interceptor de RESPONSE - Trata 401 e faz refresh automático
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Se é erro 401 e não é uma tentativa de retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Evita loop infinito: não tenta refresh se a própria requisição de refresh falhou
        const isRefreshRequest = originalRequest.url?.includes("/v1/auth/refresh");
        
        if (isRefreshRequest) {
          console.log("❌ Refresh falhou, fazendo logout");
          if (logoutCallback) {
            logoutCallback();
          }
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        console.log("🔄 Access token expirado, tentando refresh...");

        try {
          // Tenta fazer refresh do token (o refresh_token já está no cookie)
          const refreshResponse = await client.post("/v1/auth/refresh");
          
          if (refreshResponse.status === 200) {
            console.log("✅ Token renovado, reenviando requisição");
            
            // Reenvia a requisição original (com o novo access_token no cookie)
            return client(originalRequest);
          } else {
            // Refresh falhou, faz logout
            console.log("❌ Refresh falhou, fazendo logout");
            if (logoutCallback) {
              logoutCallback();
            }
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("❌ Erro no refresh:", refreshError);
          if (logoutCallback) {
            logoutCallback();
          }
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
}
