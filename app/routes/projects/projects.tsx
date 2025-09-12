import { useProjects } from '~/hooks';
import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { ClickFeedback, LoadingButton } from '~/components/ui';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Collapse,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import type { Project } from '~/types';

export default function ProjectsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  
  // Estados para filtros (preparado para implementação futura)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para expansão de linhas (mobile)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  
  // Estados para ordenação
  const [orderBy, setOrderBy] = useState<keyof Project | ''>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  
  const { data, isLoading, error, refetch } = useProjects();

  const allProjects = data?.data || [];
  const totalProjects = allProjects.length;

  // Filtros e ordenação aplicados
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = allProjects;
    
    // Aplicar filtros
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.identificacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.ementa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.autoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => 
        statusFilter === 'active' ? project.tramitando === 'Sim' : project.tramitando === 'Não'
      );
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(project => 
        project.tipoDocumento.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }
    
    // Aplicar ordenação
    if (orderBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[orderBy];
        let bValue = b[orderBy];
        
        // Tratamento especial para data
        if (orderBy === 'dataApresentacao') {
          aValue = a.dataApresentacao ? new Date(a.dataApresentacao).getTime() : 0;
          bValue = b.dataApresentacao ? new Date(b.dataApresentacao).getTime() : 0;
        }
        
        // Tratamento especial para strings
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue == null || bValue == null) {
          if (aValue == null && bValue == null) return 0;
          return aValue == null ? 1 : -1;
        }
        
        if (aValue < bValue) {
          return order === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [allProjects, searchTerm, statusFilter, typeFilter, orderBy, order]);

  // Paginação no frontend
  const totalFilteredProjects = filteredAndSortedProjects.length;
  const totalPages = Math.ceil(totalFilteredProjects / rowsPerPage);
  
  // Garantir que a página atual não exceda o total de páginas
  const currentPage = Math.min(page, Math.max(0, totalPages - 1));
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProjects = filteredAndSortedProjects.slice(startIndex, endIndex);

  // Handlers para paginação
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setExpandedRows(new Set()); // Reset expanded rows on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setExpandedRows(new Set());
  };

  // Handlers para filtros
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset para primeira página quando filtrar
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0); // Reset para primeira página quando filtrar
  };

  const handleTypeFilterChange = (event: any) => {
    setTypeFilter(event.target.value);
    setPage(0); // Reset para primeira página quando filtrar
  };

  // Handler para expansão de linhas (mobile)
  const toggleRowExpansion = (projectId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(projectId)) {
      newExpandedRows.delete(projectId);
    } else {
      newExpandedRows.add(projectId);
    }
    setExpandedRows(newExpandedRows);
  };

  // Handler para ordenação
  const handleSort = (property: keyof Project) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0); // Reset para primeira página quando ordenar
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

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

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Projetos em Tramitação
        </Typography>
        <Typography variant="body1" color="info">
          Mostrando {paginatedProjects.length} de {totalFilteredProjects} projetos filtrados (de {totalProjects} total)
        </Typography>
      </Box>

      {/* Filtros */}
      <Paper elevation={1} sx={{ mb: 3, p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ flexGrow: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            color={showFilters ? 'primary' : 'default'}
          >
            <FilterListIcon />
          </IconButton>
        </Stack>

        <Collapse in={showFilters}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Em Tramitação</MenuItem>
                <MenuItem value="archived">Arquivados</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={typeFilter}
                label="Tipo"
                onChange={handleTypeFilterChange}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="lei">Lei</MenuItem>
                <MenuItem value="decreto">Decreto</MenuItem>
                <MenuItem value="resolução">Resolução</MenuItem>
                <MenuItem value="projeto">Projeto</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={orderBy}
                label="Ordenar por"
                onChange={(event) => handleSort(event.target.value as keyof Project)}
              >
                <MenuItem value="">Nenhuma ordenação</MenuItem>
                <MenuItem value="identificacao">Identificação</MenuItem>
                <MenuItem value="autoria">Autor</MenuItem>
                <MenuItem value="tipoDocumento">Tipo</MenuItem>
                <MenuItem value="dataApresentacao">Data</MenuItem>
                <MenuItem value="tramitando">Status</MenuItem>
              </Select>
            </FormControl>

            {orderBy && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Direção</InputLabel>
                <Select
                  value={order}
                  label="Direção"
                  onChange={(event) => setOrder(event.target.value as 'asc' | 'desc')}
                >
                  <MenuItem value="asc">Crescente</MenuItem>
                  <MenuItem value="desc">Decrescente</MenuItem>
                </Select>
              </FormControl>
            )}
          </Stack>
        </Collapse>
      </Paper>

      {/* Tabela Desktop */}
      {!isMobile && (
        <Paper elevation={1}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'identificacao'}
                      direction={orderBy === 'identificacao' ? order : 'asc'}
                      onClick={() => handleSort('identificacao')}
                    >
                      Identificação
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ementa</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'autoria'}
                      direction={orderBy === 'autoria' ? order : 'asc'}
                      onClick={() => handleSort('autoria')}
                    >
                      Autor
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'tipoDocumento'}
                      direction={orderBy === 'tipoDocumento' ? order : 'asc'}
                      onClick={() => handleSort('tipoDocumento')}
                    >
                      Tipo
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'dataApresentacao'}
                      direction={orderBy === 'dataApresentacao' ? order : 'asc'}
                      onClick={() => handleSort('dataApresentacao')}
                    >
                      Data
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'tramitando'}
                      direction={orderBy === 'tramitando' ? order : 'asc'}
                      onClick={() => handleSort('tramitando')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProjects.map((project: Project) => (
                  <TableRow
                    key={project.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {project.identificacao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 400,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {project.ementa}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {project.autoria}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {project.tipoDocumento}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {project.dataApresentacao ? formatDate(project.dataApresentacao) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={project.tramitando === 'Sim' ? 'Em Tramitação' : 'Arquivado'}
                        color={project.tramitando === 'Sim' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalhes">
                        <ClickFeedback feedbackType="ripple">
                          <IconButton
                            component={Link}
                            to={`/projects/${project.id}`}
                            size="small"
                            sx={{
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                backgroundColor: 'primary.main',
                                color: 'white',
                              }
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </ClickFeedback>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[10, 20, 50, 100]}
            component="div"
            count={totalFilteredProjects}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
            }
          />
        </Paper>
      )}

      {/* Cards Mobile */}
      {isMobile && (
        <Box>
          {paginatedProjects.map((project: Project) => (
            <Card key={project.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flex: 1, mr: 1 }}>
                    {project.identificacao}
                  </Typography>
                  <Chip
                    label={project.tramitando === 'Sim' ? 'Em Tramitação' : 'Arquivado'}
                    color={project.tramitando === 'Sim' ? 'primary' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: expandedRows.has(project.id) ? 0 : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {project.ementa}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Autor:</strong> {project.autoria}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Tipo:</strong> {project.tipoDocumento}
                  </Typography>
                  {project.dataApresentacao && (
                    <Typography variant="caption" color="text.secondary">
                      <strong>Data:</strong> {formatDate(project.dataApresentacao)}
                    </Typography>
                  )}
                </Box>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <ClickFeedback feedbackType="scale">
                  <Button
                    component={Link}
                    to={`/projects/${project.id}`}
                    variant="contained"
                    size="small"
                    startIcon={<VisibilityIcon />}
                  >
                    Ver Detalhes
                  </Button>
                </ClickFeedback>
                <ClickFeedback feedbackType="ripple">
                  <IconButton
                    onClick={() => toggleRowExpansion(project.id)}
                    size="small"
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: 'primary.main',
                        color: 'white',
                      }
                    }}
                  >
                    {expandedRows.has(project.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </ClickFeedback>
              </CardActions>
            </Card>
          ))}
          
          {/* Paginação Mobile */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <TablePagination
              component="div"
              count={totalFilteredProjects}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 20, 50]}
              labelRowsPerPage="Linhas:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
              }
            />
          </Box>
        </Box>
      )}

      {/* Empty State */}
      {paginatedProjects.length === 0 && !isLoading && !error && (
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
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'Tente ajustar os filtros de busca.' 
              : 'Tente novamente mais tarde ou verifique sua conexão.'
            }
          </Typography>
        </Box>
      )}
    </Box>
  );
}