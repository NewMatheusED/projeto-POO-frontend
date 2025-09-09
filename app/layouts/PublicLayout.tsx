import { Outlet, Link } from 'react-router';
import { useAuthContext } from '~/providers/AuthProvider';
import { Button } from '~/components/ui';
import styles from './PublicLayout.module.css';

export default function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuthContext();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>Projeto POO</span>
          </Link>
          
          <nav className={styles.nav}>
            <Link to="/senators" className={styles.navLink}>
              Senadores
            </Link>
            <Link to="/projects" className={styles.navLink}>
              Projetos
            </Link>
            
            {isAuthenticated ? (
              <div className={styles.authSection}>
                <span className={styles.userName}>Olá, {user?.name}</span>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sair
                </Button>
              </div>
            ) : (
              <div className={styles.authSection}>
                <Link to="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="primary" size="sm">
                    Registrar
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      
      <main className={styles.main}>
        <Outlet />
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <Link to="/senators" className={styles.footerLink}>
              Senadores
            </Link>
            <Link to="/projects" className={styles.footerLink}>
              Projetos
            </Link>
            <Link to="/auth/login" className={styles.footerLink}>
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
