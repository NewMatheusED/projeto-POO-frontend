import { Outlet, Link, useLocation } from 'react-router';
import { useAuthContext } from '~/providers/AuthProvider';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  const { user, logout } = useAuthContext();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.logo}>Projeto POO</h1>
        </div>
        
        <nav className={styles.nav}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>🏠</span>
            Dashboard
          </Link>
          
          <Link 
            to="/dashboard/users" 
            className={`${styles.navLink} ${isActive('/dashboard/users') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>👥</span>
            Usuários
          </Link>
          
          <Link 
            to="/dashboard/profile" 
            className={`${styles.navLink} ${isActive('/dashboard/profile') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>👤</span>
            Perfil
          </Link>
          
          <Link 
            to="/senators" 
            className={`${styles.navLink} ${isActive('/senators') ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>🏛️</span>
            Senadores
          </Link>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user?.name || 'Usuário'}</span>
              <span className={styles.userEmail}>{user?.email || 'user@exemplo.com'}</span>
            </div>
          </div>
          
          <button onClick={logout} className={styles.logoutButton}>
            <span className={styles.navIcon}>🚪</span>
            Sair
          </button>
        </div>
      </aside>
      
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
