import { Link } from 'react-router';
import { Button } from '~/components/ui';
import styles from './users.module.css';

export default function UsersPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gerenciar Usuários</h1>
        <p className={styles.subtitle}>
          Administre os usuários do sistema
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Usuários Ativos</h2>
          <p className={styles.cardDescription}>
            Visualize e gerencie todos os usuários cadastrados no sistema.
          </p>
          <Button variant="primary" size="lg">
            Ver Usuários
          </Button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Permissões</h2>
          <p className={styles.cardDescription}>
            Configure permissões e roles dos usuários.
          </p>
          <Button variant="outline" size="lg">
            Gerenciar Permissões
          </Button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Relatórios</h2>
          <p className={styles.cardDescription}>
            Gere relatórios de atividade dos usuários.
          </p>
          <Button variant="outline" size="lg">
            Gerar Relatórios
          </Button>
        </div>
      </div>

      <div className={styles.footer}>
        <Link to="/dashboard" className={styles.backLink}>
          ← Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
