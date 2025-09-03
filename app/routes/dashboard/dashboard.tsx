import { Link } from "react-router";
import { Button } from "~/components/ui";
import { useAuthContext } from "~/providers/AuthProvider";
import { withAuth } from "~/providers/AuthProvider";
import styles from "./dashboard.module.css";

function Dashboard() {
  const { user, logout } = useAuthContext();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              Bem-vindo de volta, <span className={styles.userName}>{user?.name}</span>!
            </p>
          </div>
          <div className={styles.headerActions}>
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Perfil do Usuário</h3>
              <p className={styles.cardDescription}>
                Gerencie suas informações pessoais
              </p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.userInfo}>
                <div className={styles.userAvatar}>
                  <span className={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={styles.userDetails}>
                  <p className={styles.userName}>{user?.name}</p>
                  <p className={styles.userEmail}>{user?.email}</p>
                  <p className={styles.userRole}>
                    {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.cardActions}>
              <Link to="/dashboard/profile">
                <Button variant="primary" size="sm">
                  Editar Perfil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
