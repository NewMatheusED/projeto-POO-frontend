import { Navigate, Outlet, useRouteLoaderData } from "react-router";
import { useEffect, useState } from "react";
import Menu from "~/features/menu/components/Menu/Menu";
import type { IUsuario } from "~/features/user/typings";
import { useAuthInterceptor } from "~/hooks/useAuthInterceptor";
import { useAuthGuard } from "~/hooks/useAuthGuard";
import { typedApiClient } from "~/features/apiClient/client";

export default function MenuLayout() {
  // Configura interceptor de autenticação
  useAuthInterceptor();
  
  // Verifica autenticação sempre que navega entre rotas
  useAuthGuard();
  
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const rootData = useRouteLoaderData("root") as
    | { userInfo?: IUsuario }
    | undefined;
  const userInfo = rootData?.userInfo;

  // Verifica autenticação ao carregar a página
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Usa o health check da IA que requer autenticação
        // Se os cookies estão inválidos/ausentes, o interceptor vai lidar com isso
        const response = await typedApiClient.get("/v1/ia");
        
        if (response.success) {
          setIsAuthenticated(true);
          console.log("✅ Usuário autenticado - acesso aos serviços confirmado");
        } else {
          setIsAuthenticated(false);
          console.log("❌ Falha na verificação de autenticação");
        }
      } catch (error) {
        console.log("❌ Verificação de autenticação falhou:", error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  // Mostra loading enquanto verifica autenticação
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-ai-dark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ai-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ai-gray">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Redireciona para login se não estiver autenticado
  if (!isAuthenticated || !userInfo) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: "flex" }}>
      <Menu />
      <div style={{ flex: 1, marginLeft: "120px" }}>
        <Outlet />
      </div>
    </div>
  );
}
