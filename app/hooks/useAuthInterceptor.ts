import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setLogoutCallback } from "~/features/apiClient/interceptors";
import { logout } from "~/features/auth/redux";

/**
 * Hook que configura o callback de logout automático no interceptor
 * Deve ser usado no componente raiz da aplicação
 */
export function useAuthInterceptor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      console.log("🔄 Fazendo logout automático...");
      
      // Atualiza Redux
      dispatch(logout());
      
      // Redireciona para login
      navigate("/login", { replace: true });
      
      // Recarrega a página para garantir que todos os estados sejam limpos
      window.location.reload();
      
      console.log("✅ Logout automático concluído");
    };

    // Configura o callback no interceptor
    setLogoutCallback(handleLogout);

    // Cleanup: remove o callback quando o componente desmonta
    return () => {
      setLogoutCallback(() => {});
    };
  }, [dispatch, navigate]);
}
