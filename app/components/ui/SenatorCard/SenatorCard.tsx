import { Link } from 'react-router';
import type { Senator } from '~/types';
import styles from './SenatorCard.module.css';

interface SenatorCardProps {
  senator: Senator;
}

export const SenatorCard = ({ senator }: SenatorCardProps) => {
  return (
    <Link 
      to={`/senators/${senator.codigo}`}
      className={styles.card}
    >
      <div className={styles.imageContainer}>
        <img 
          src={senator.urlFoto} 
          alt={`Foto de ${senator.nome}`}
          className={styles.image}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/favicon.ico'; // Fallback para imagem padrão
          }}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{senator.nome}</h3>
        <p className={styles.fullName}>{senator.nomeCompleto}</p>
        
        <div className={styles.info}>
          <span className={styles.party}>{senator.siglaPartido}</span>
          <span className={styles.state}>{senator.uf}</span>
        </div>
        
        <div className={styles.role}>
          <span className={styles.participation}>{senator.descricaoParticipacao}</span>
        </div>
      </div>
    </Link>
  );
};
