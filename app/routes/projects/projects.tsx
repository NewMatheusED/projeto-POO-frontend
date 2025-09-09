import { useProjects } from '~/hooks';
import { ProjectCard, Loading } from '~/components/ui';
import styles from './projects.module.css';

export default function ProjectsPage() {
  const { data, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loading size="lg" />
          <p className={styles.loadingText}>Carregando projetos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Erro ao carregar projetos</h2>
          <p className={styles.errorMessage}>
            Não foi possível carregar a lista de projetos. Tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  const projects = data?.data || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projetos em Tramitação</h1>
        <p className={styles.subtitle}>
          {projects.length} projetos encontrados
        </p>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}