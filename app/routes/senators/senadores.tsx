import { useSenators } from '~/hooks';
import { SenatorCard, Loading } from '~/components/ui';
import styles from './senadores.module.css';

export default function SenadoresPage() {
  const { data, isLoading, error } = useSenators();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loading size="lg" />
          <p className={styles.loadingText}>Carregando senadores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Erro ao carregar senadores</h2>
          <p className={styles.errorMessage}>
            Não foi possível carregar a lista de senadores. Tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  const senators = data?.data || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Senadores do Brasil</h1>
        <p className={styles.subtitle}>
          {senators.length} senadores encontrados
        </p>
      </div>

      <div className={styles.grid}>
        {senators.map((senator) => (
          <SenatorCard key={senator.codigo} senator={senator} />
        ))}
      </div>
    </div>
  );
}
