import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "~/features/auth/redux";
import { typedApiClient } from "~/features/apiClient/client";

/**
 * Hook que verifica autenticação sempre que o usuário navega
 * Deve ser usado no MenuLayout para proteger todas as rotas
 */
export function useAuthGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthOnNavigation = async () => {
      try {
        // Faz uma requisição para verificar se ainda está autenticado
        // Se os tokens estão inválidos, o interceptor vai lidar com isso
        const response = await typedApiClient.get("/v1/ia");
        
        if (!response.success) {
          console.log("❌ Autenticação inválida durante navegação");
          dispatch(logout());
          navigate("/login", { replace: true });
          return;
        }
        
        console.log("✅ Autenticação válida durante navegação");
      } catch (error) {
        console.log("❌ Erro na verificação de autenticação durante navegação:", error);
        // O interceptor já deve ter lidado com o logout se necessário
      }
    };

    // Verifica autenticação sempre que a rota muda
    checkAuthOnNavigation();
  }, [location.pathname, dispatch, navigate]);
}
