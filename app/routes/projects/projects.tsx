import { useProjects } from '~/hooks';
import { Loading } from '~/components/ui';
import { useState } from 'react';
import { Link } from 'react-router';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Pagination,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import type { Project } from '~/types';

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { data, isLoading, error, refetch } = useProjects(currentPage, itemsPerPage);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Carregando projetos...
        </Typography>
        <Alert severity="warning" sx={{ maxWidth: 600 }}>
          <AlertTitle>Aguarde um momento</AlertTitle>
          O servidor pode estar hibernando. A primeira requisição pode levar até 5 minutos.
        </Alert>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Erro ao carregar projetos</AlertTitle>
          Não foi possível carregar a lista de projetos. Tente novamente mais tarde.
        </Alert>
      </Box>
    );
  }

  const projects = data?.data || [];
  const totalProjects = data?.total || 0;
  const totalPages = Math.ceil(totalProjects / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    // Scroll to top quando mudar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Projetos em Tramitação
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Mostrando {projects.length} de {totalProjects} projetos (Página {currentPage} de {totalPages})
        </Typography>
      </Box>

      {/* Projects List */}
      <Paper elevation={1} sx={{ mb: 4 }}>
        <List sx={{ width: '100%' }}>
          {projects.map((project: Project, index: number) => (
            <Box key={project.id}>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={`/projects/${project.codigoMateria}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 3,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    {/* Título e Status */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1,
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          lineHeight: 1.3,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {project.identificacao}
                      </Typography>
                      <Chip
                        label={project.tramitando === 'Sim' ? 'Em Tramitação' : 'Arquivado'}
                        color={project.tramitando === 'Sim' ? 'primary' : 'default'}
                        size="small"
                      />
                    </Box>

                    {/* Ementa */}
                    <Typography
                      variant="body1"
                      color="text.primary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                      }}
                    >
                      {project.ementa}
                    </Typography>

                    {/* Metadados */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: { xs: 1, sm: 3 },
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        <strong>Autor:</strong> {project.autoria}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Tipo:</strong> {project.tipoDocumento}
                      </Typography>
                      {project.dataApresentacao && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Data:</strong> {formatDate(project.dataApresentacao)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </ListItemButton>
              </ListItem>
              {index < projects.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPagination-ul': {
                flexWrap: 'wrap',
                justifyContent: 'center',
              },
            }}
          />
        </Box>
      )}

      {/* Empty State */}
      {projects.length === 0 && !isLoading && !error && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum projeto encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente novamente mais tarde ou verifique sua conexão.
          </Typography>
        </Box>
      )}
    </Box>
  );
}