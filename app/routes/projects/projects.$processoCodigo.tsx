import { useParams, Link } from 'react-router';
import { useProjectDetail, useProjectVotes } from '~/hooks';
import { Loading, VoteCard } from '~/components/ui';
import styles from './project-detail.module.css';

export default function ProjectDetailPage() {
  const { processoCodigo } = useParams();
  const { data: projectData, isLoading: projectLoading, error: projectError } = useProjectDetail(processoCodigo || '');
  const { data: votesData, isLoading: votesLoading, error: votesError } = useProjectVotes(processoCodigo || '');

  const isLoading = projectLoading || votesLoading;
  const hasError = projectError || votesError;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loading size="xl" />
          <p className={styles.loadingText}>Carregando detalhes do projeto...</p>
        </div>
      </div>
    );
  }

  if (hasError || !projectData || !projectData.data || projectData.data.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Erro ao carregar detalhes</h2>
          <p className={styles.errorMessage}>
            Não foi possível carregar os detalhes do projeto. Tente novamente mais tarde.
          </p>
          <Link to="/projects" className={styles.backButton}>
            Voltar para lista de projetos
          </Link>
        </div>
      </div>
    );
  }

  const project = projectData.data[0]; // API returns array with single item
  const votingSessions = votesData?.data || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/projects" className={styles.backLink}>
          ← Voltar para lista de projetos
        </Link>
      </div>

      <div className={styles.content}>
        <div className={styles.projectSection}>
          <h1 className={styles.title}>{project.identificacao}</h1>
          <h2 className={styles.type}>{project.tipoDocumento}</h2>
          
          <div className={styles.basicInfo}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Autor:</span>
                <span className={styles.value}>{project.autoria}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Data de Apresentação:</span>
                <span className={styles.value}>
                  {new Date(project.dataApresentacao).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Tramitando:</span>
                <span className={styles.value}>{project.tramitando}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Casa Identificadora:</span>
                <span className={styles.value}>{project.casaIdentificadora}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Tipo de Conteúdo:</span>
                <span className={styles.value}>{project.tipoConteudo}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Objetivo:</span>
                <span className={styles.value}>{project.objetivo}</span>
              </div>
            </div>
          </div>

          <div className={styles.ementaSection}>
            <h3 className={styles.ementaTitle}>Ementa</h3>
            <p className={styles.ementaText}>{project.ementa}</p>
          </div>

          {project.urlDocumento && (
            <div className={styles.documentSection}>
              <a 
                href={project.urlDocumento} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.documentLink}
              >
                📄 Ver documento completo →
              </a>
            </div>
          )}
        </div>

        <div className={styles.votesSection}>
          <h3 className={styles.votesTitle}>Votações ({votingSessions.length})</h3>
          
          {votingSessions.length === 0 ? (
            <div className={styles.noVotes}>
              <p>Nenhuma votação encontrada para este projeto.</p>
            </div>
          ) : (
            <div className={styles.votesList}>
              {votingSessions.map((session) => (
                <div key={session.codigoSessao} className={styles.votingSession}>
                  <h4 className={styles.sessionTitle}>
                    Sessão {session.codigoSessao}
                  </h4>
                  <div className={styles.votesGrid}>
                    {session.votos.map((vote, index) => (
                      <VoteCard key={`${session.codigoSessao}-${vote.codigoParlamentar}`} vote={vote} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}