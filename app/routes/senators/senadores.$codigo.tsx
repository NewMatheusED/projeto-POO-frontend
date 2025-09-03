import { useParams, Link } from 'react-router';
import { useSenatorDetail } from '~/hooks';
import { Loading } from '~/components/ui';
import styles from './senador-detalhe.module.css';

export default function SenadorDetalhePage() {
  const { codigo } = useParams();
  const { data, isLoading, error } = useSenatorDetail(codigo || '');

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loading size="xl" />
          <p className={styles.loadingText}>Carregando detalhes do senador...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !data.data) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Erro ao carregar detalhes</h2>
          <p className={styles.errorMessage}>
            Não foi possível carregar os detalhes do senador. Tente novamente mais tarde.
          </p>
          <Link to="/senators" className={styles.backButton}>
            Voltar para lista de senadores
          </Link>
        </div>
      </div>
    );
  }

  const senator = data.data;
  
  // Validação das propriedades aninhadas
  if (!senator.IdentificacaoParlamentar) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Dados incompletos</h2>
          <p className={styles.errorMessage}>
            Os dados do senador estão incompletos. Tente novamente mais tarde.
          </p>
          <Link to="/senators" className={styles.backButton}>
            Voltar para lista de senadores
          </Link>
        </div>
      </div>
    );
  }

  const { 
    IdentificacaoParlamentar, 
    DadosBasicosParlamentar = {}, 
    Telefones = { Telefone: [] }, 
    OutrasInformacoes = { Servico: [] } 
  } = senator;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link to="/senators" className={styles.backLink}>
          ← Voltar para lista de senadores
        </Link>
      </div>

      <div className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.imageContainer}>
            <img 
              src={IdentificacaoParlamentar.UrlFotoParlamentar} 
              alt={`Foto de ${IdentificacaoParlamentar.NomeParlamentar}`}
              className={styles.profileImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/favicon.ico';
              }}
            />
          </div>
          
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{IdentificacaoParlamentar.NomeParlamentar}</h1>
            <h2 className={styles.fullName}>{IdentificacaoParlamentar.NomeCompletoParlamentar}</h2>
            
            <div className={styles.basicInfo}>
              {IdentificacaoParlamentar.SiglaPartidoParlamentar && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Partido:</span>
                  <span className={styles.value}>{IdentificacaoParlamentar.SiglaPartidoParlamentar}</span>
                </div>
              )}
              {IdentificacaoParlamentar.UfParlamentar && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>UF:</span>
                  <span className={styles.value}>{IdentificacaoParlamentar.UfParlamentar}</span>
                </div>
              )}
              {IdentificacaoParlamentar.SexoParlamentar && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Sexo:</span>
                  <span className={styles.value}>{IdentificacaoParlamentar.SexoParlamentar}</span>
                </div>
              )}
              {IdentificacaoParlamentar.EmailParlamentar && (
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email:</span>
                  <a 
                    href={`mailto:${IdentificacaoParlamentar.EmailParlamentar}`}
                    className={styles.emailLink}
                  >
                    {IdentificacaoParlamentar.EmailParlamentar}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <h3 className={styles.cardTitle}>Dados Básicos</h3>
            <div className={styles.detailContent}>
              {(DadosBasicosParlamentar as any).DataNascimento && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Data de Nascimento:</span>
                  <span className={styles.detailValue}>
                    {new Date((DadosBasicosParlamentar as any).DataNascimento).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              {((DadosBasicosParlamentar as any).Naturalidade || (DadosBasicosParlamentar as any).UfNaturalidade) && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Naturalidade:</span>
                  <span className={styles.detailValue}>
                    {[(DadosBasicosParlamentar as any).Naturalidade, (DadosBasicosParlamentar as any).UfNaturalidade]
                      .filter(Boolean)
                      .join(' - ')}
                  </span>
                </div>
              )}
              {(DadosBasicosParlamentar as any).EnderecoParlamentar && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Endereço:</span>
                  <span className={styles.detailValue}>
                    {(DadosBasicosParlamentar as any).EnderecoParlamentar}
                  </span>
                </div>
              )}
            </div>
          </div>

          {Telefones.Telefone && Telefones.Telefone.length > 0 && (
            <div className={styles.detailCard}>
              <h3 className={styles.cardTitle}>Telefones</h3>
              <div className={styles.detailContent}>
                {Telefones.Telefone.map((telefone, index) => (
                  <div key={index} className={styles.detailItem}>
                    <span className={styles.detailLabel}>Telefone {telefone.OrdemPublicacao}:</span>
                    <span className={styles.detailValue}>
                      {telefone.NumeroTelefone}
                      {telefone.IndicadorFax === 'Sim' && ' (Fax)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {OutrasInformacoes.Servico && OutrasInformacoes.Servico.length > 0 && (
            <div className={styles.detailCard}>
              <h3 className={styles.cardTitle}>Serviços Disponíveis</h3>
              <div className={styles.servicesList}>
                {OutrasInformacoes.Servico.map((servico, index) => (
                  <div key={index} className={styles.serviceItem}>
                    <h4 className={styles.serviceName}>{servico.NomeServico}</h4>
                    {servico.DescricaoServico && (
                      <p className={styles.serviceDescription}>{servico.DescricaoServico}</p>
                    )}
                    {servico.UrlServico && (
                      <a 
                        href={servico.UrlServico} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.serviceLink}
                      >
                        Acessar serviço →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
