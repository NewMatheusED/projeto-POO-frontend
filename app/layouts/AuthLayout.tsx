import { Outlet } from 'react-router';
import { Link } from 'react-router';
import styles from './AuthLayout.module.css';

export default function AuthLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Projeto POO</span>
        </Link>
      </div>
      
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
