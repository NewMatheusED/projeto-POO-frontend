import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Input, Loading } from "~/components/ui";
import { useAuthContext } from "~/providers/AuthProvider";
import { isValidEmail } from "~/utils/validation";
import styles from "./login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggingIn, loginError, clearError } = useAuthContext();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Limpar erro geral
    if (loginError) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (error) {
      // Erro será tratado pelo hook useAuth
      console.error("Erro no login:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Fazer Login</h1>
          <p className={styles.subtitle}>
            Entre com suas credenciais para acessar sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {loginError && (
            <div className={styles.errorAlert} role="alert">
              <div className={styles.errorIcon}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className={styles.errorContent}>
                <h3 className={styles.errorTitle}>Erro no Login</h3>
                <p className={styles.errorMessage}>
                  {loginError?.message || "Credenciais inválidas"}
                </p>
              </div>
            </div>
          )}

          <div className={styles.field}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="seu@email.com"
              fullWidth
              required
            />
          </div>

          <div className={styles.field}>
            <Input
              label="Senha"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="Sua senha"
              fullWidth
              required
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoggingIn}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Entrando..." : "Entrar"}
            </Button>
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Não tem uma conta?{" "}
                        <Link to="/auth/register" className={styles.link}>
            Criar conta
          </Link>
            </p>
            <Link to="/forgot-password" className={styles.link}>
              Esqueceu sua senha?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
