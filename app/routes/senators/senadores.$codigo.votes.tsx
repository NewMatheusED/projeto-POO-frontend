import { useParams, Link } from 'react-router';
import { useSenatorDetail, useSenatorVotes } from '~/hooks';
import { Loading } from '~/components/ui';
import styles from './senador-votacoes.module.css';

export default function SenadorVotacoesPage() {
  const { codigo } = useParams();
  const { data: senatorData, isLoading: senatorLoading } = useSenatorDetail(codigo || '');
  const { data: votesData, isLoading: votesLoading, error: votesError } = useSenatorVotes(codigo || '');

  const isLoading = senatorLoading || votesLoading;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loading size="xl" />
          <p className={styles.loadingText}>Carregando histórico de votações...</p>
        </div>
      </div>
    );
  }

  if (votesError || !votesData || !votesData.data || votesData.data.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Erro ao carregar votações</h2>
          <p className={styles.errorMessage}>
            Não foi possível carregar o histórico de votações. Tente novamente mais tarde.
          </p>
          <Link to={`/senators/${codigo}`} className={styles.backButton}>
            Voltar para detalhes do senador
          </Link>
        </div>
      </div>
    );
  }

  const senator = senatorData?.data?.IdentificacaoParlamentar;
  const votingHistory = votesData.data[0]; // API returns array with single item
  const votes = votingHistory?.Votacao || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to={`/senators/${codigo}`} className={styles.backLink}>
          ← Voltar para detalhes do senador
        </Link>
      </div>

      <div className={styles.content}>
        {senator && (
          <div className={styles.senatorSection}>
            <h1 className={styles.title}>Histórico de Votações</h1>
            <h2 className={styles.senatorName}>{senator.NomeParlamentar}</h2>
            <p className={styles.subtitle}>
              {votes.length} votações encontradas
            </p>
          </div>
        )}

        <div className={styles.votesSection}>
          {votes.length === 0 ? (
            <div className={styles.noVotes}>
              <p>Nenhuma votação encontrada para este senador.</p>
            </div>
          ) : (
            <div className={styles.votesList}>
              {votes.map((vote, index) => (
                <div key={`${vote.CodigoSessaoVotacao}-${index}`} className={styles.voteCard}>
                  <div className={styles.voteHeader}>
                    <div className={styles.voteInfo}>
                      <h3 className={styles.voteTitle}>
                        <Link 
                          to={`/projects/${vote.Materia.IdentificacaoProcesso}`}
                          className={styles.projectLink}
                        >
                          {vote.Materia.DescricaoIdentificacao}
                        </Link>
                      </h3>
                      <p className={styles.voteDescription}>{vote.DescricaoVotacao}</p>
                    </div>
                    <div className={styles.voteResult}>
                      <span className={`${styles.voteValue} ${getVoteClass(vote.SiglaDescricaoVoto)}`}>
                        {vote.SiglaDescricaoVoto}
                      </span>
                      <span className={styles.voteResultText}>{vote.DescricaoResultado}</span>
                    </div>
                  </div>
                  
                  <div className={styles.voteDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Data da Sessão:</span>
                      <span className={styles.detailValue}>
                        {new Date(vote.SessaoPlenaria.DataSessao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Sessão:</span>
                      <span className={styles.detailValue}>
                        {vote.SessaoPlenaria.SiglaTipoSessao} {vote.SessaoPlenaria.NumeroSessao}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Resultado:</span>
                      <span className={styles.detailValue}>
                        Sim: {vote.TotalVotosSim}, Não: {vote.TotalVotosNao}, Abstenção: {vote.TotalVotosAbstencao}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.ementaSection}>
                    <h4 className={styles.ementaTitle}>Ementa</h4>
                    <p className={styles.ementaText}>
                      {vote.Materia.Ementa.length > 300 
                        ? `${vote.Materia.Ementa.substring(0, 300)}...`
                        : vote.Materia.Ementa
                      }
                    </p>
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

function getVoteClass(voteSignature: string) {
  switch (voteSignature) {
    case 'Sim':
      return 'voteYes';
    case 'Não':
    case 'Nao':
      return 'voteNo';
    case 'Abstenção':
    case 'Abstencao':
      return 'voteAbstention';
    default:
      return 'voteOther';
  }
}