import type { Vote } from '~/types';
import styles from './VoteCard.module.css';

interface VoteCardProps {
  vote: Vote;
}

export function VoteCard({ vote }: VoteCardProps) {
  const getVoteColor = (sigla: string) => {
    switch (sigla) {
      case 'Sim':
        return styles.voteYes;
      case 'Não':
      case 'Nao':
        return styles.voteNo;
      case 'Abstenção':
      case 'Abstencao':
        return styles.voteAbstention;
      default:
        return styles.voteOther;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.name}>{vote.nomeParlamentar}</h4>
        <div className={styles.tags}>
          <span className={styles.party}>{vote.siglaPartidoParlamentar}</span>
          <span className={styles.uf}>{vote.siglaUFParlamentar}</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={`${styles.vote} ${getVoteColor(vote.siglaVotoParlamentar)}`}>
          <span className={styles.voteSymbol}>{vote.siglaVotoParlamentar}</span>
          <span className={styles.voteDescription}>{vote.descricaoVotoParlamentar}</span>
        </div>
      </div>
    </div>
  );
}