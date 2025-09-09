import { Link } from 'react-router';
import type { Project } from '~/types';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.codigoMateria}`} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{project.identificacao}</h3>
        <span className={styles.type}>{project.tipoDocumento}</span>
      </div>
      
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Autor:</span>
            <span className={styles.value}>{project.autoria}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Data:</span>
            <span className={styles.value}>
              {new Date(project.dataApresentacao).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Status:</span>
            <span className={`${styles.value} ${project.tramitando === 'Sim' ? styles.active : styles.inactive}`}>
              {project.tramitando === 'Sim' ? 'Tramitando' : 'Parado'}
            </span>
          </div>
        </div>
        
        <div className={styles.ementa}>
          <p className={styles.ementaText}>
            {project.ementa.length > 200 
              ? `${project.ementa.substring(0, 200)}...`
              : project.ementa
            }
          </p>
        </div>
      </div>
      
      <div className={styles.footer}>
        <span className={styles.category}>{project.tipoConteudo}</span>
        <span className={styles.arrow}>→</span>
      </div>
    </Link>
  );
}