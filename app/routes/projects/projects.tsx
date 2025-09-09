import { useProjects } from '~/hooks';
import { ProjectCard, Loading, Button } from '~/components/ui';
import { useState } from 'react';
import styles from './projects.module.css';

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { data, isLoading, error } = useProjects(currentPage, itemsPerPage);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loading size="lg" />
          <p className={styles.loadingText}>Carregando projetos...</p>
          <p className={styles.loadingSubtext}>
            ⚠️ O servidor pode estar hibernando. A primeira requisição pode levar até 5 minutos.
          </p>
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
  const totalProjects = data?.total || 0;
  const totalPages = Math.ceil(totalProjects / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projetos em Tramitação</h1>
        <p className={styles.subtitle}>
          Mostrando {projects.length} de {totalProjects} projetos (Página {currentPage} de {totalPages})
        </p>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            ← Anterior
          </Button>

          <div className={styles.pageNumbers}>
            {currentPage > 3 && (
              <>
                <button
                  className={styles.pageNumber}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>
                {currentPage > 4 && <span className={styles.ellipsis}>...</span>}
              </>
            )}

            {getPageNumbers().map((page) => (
              <button
                key={page}
                className={`${styles.pageNumber} ${
                  page === currentPage ? styles.activePage : ''
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <span className={styles.ellipsis}>...</span>}
                <button
                  className={styles.pageNumber}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Próxima →
          </Button>
        </div>
      )}
    </div>
  );
}