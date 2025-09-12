import { Link } from "react-router";
import { Button, ClickFeedback } from "~/components/ui";
import { useAuthContext } from "~/providers/AuthProvider";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <h1 className="text-4xl text-center font-bold text-gray-900 sm:text-5xl md:text-6xl">Bem-vindo!</h1>
          <div className="mt-10 flex justify-center">
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <>
                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-4">
                      Olá, <span className="font-semibold text-blue-600">{user?.name}</span>!
                    </p>
                    <div className="flex gap-4 justify-center">
                  <Link to="/senators">
                    <Button variant="primary" size="lg">
                      Ver Senadores
                    </Button>
                  </Link>
                  <Link to="/projects">
                    <Button variant="primary" size="lg">
                      Ver Projetos
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="outline" size="lg">
                      Dashboard
                    </Button>
                  </Link>
                      <Button variant="outline" size="lg" onClick={logout}>
                        Sair
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <ClickFeedback feedbackType="scale">
                    <Link to="/senators">
                      <Button variant="primary" size="lg">
                        Ver Senadores
                      </Button>
                    </Link>
                  </ClickFeedback>
                  <ClickFeedback feedbackType="scale">
                    <Link to="/auth/login">
                      <Button variant="outline" size="lg">
                        Fazer Login
                      </Button>
                    </Link>
                  </ClickFeedback>
                  <ClickFeedback feedbackType="scale">
                    <Link to="/auth/register">
                      <Button variant="outline" size="lg">
                        Criar Conta
                      </Button>
                    </Link>
                  </ClickFeedback>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}