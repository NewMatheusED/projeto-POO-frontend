import { useParams, Link } from 'react-router';
import { useSenatorDetail, useSenatorVotes } from '~/hooks';
import { ClickFeedback } from '~/components/ui';
import { useState, useMemo, useCallback } from 'react';
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
  Divider,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import styles from './senador-votacoes.module.css';

// Tipos para melhor tipagem
interface VoteData {
  CodigoSessaoVotacao: string;
  SiglaDescricaoVoto: string;
  DescricaoVotacao: string;
  DescricaoResultado: string;
  TotalVotosSim: number;
  TotalVotosNao: number;
  TotalVotosAbstencao: number;
  Materia: {
    IdentificacaoProcesso: string;
    DescricaoIdentificacao: string;
    Ementa: string;
  };
  SessaoPlenaria: {
    DataSessao: string;
    SiglaTipoSessao: string;
    NumeroSessao: number;
  };
}

interface SenatorData {
  NomeParlamentar: string;
}

export default function SenadorVotacoesPage() {
  const { codigo } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [voteFilter, setVoteFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para expansão de linhas (mobile)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // Estados para ordenação
  const [orderBy, setOrderBy] = useState<keyof VoteData | ''>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const { data: senatorData, isLoading: senatorLoading } = useSenatorDetail(codigo || '');
  const { data: votesData, isLoading: votesLoading, error: votesError } = useSenatorVotes(codigo || '');

  const isLoading = senatorLoading || votesLoading;

  // Extrair dados dos votos
  const allVotes = useMemo(() => {
    if (!votesData?.data?.[0]?.Votacao) return [];
    return votesData.data[0].Votacao as unknown as VoteData[];
  }, [votesData]);

  const senator = senatorData?.data?.IdentificacaoParlamentar as SenatorData | undefined;

  // Filtros e ordenação aplicados
  const filteredAndSortedVotes = useMemo(() => {
    let filtered = allVotes;
    
    // Aplicar filtros
    if (searchTerm) {
      filtered = filtered.filter(vote => 
        vote.Materia.DescricaoIdentificacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vote.DescricaoVotacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vote.Materia.Ementa.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (voteFilter !== 'all') {
      filtered = filtered.filter(vote => {
        const voteType = vote.SiglaDescricaoVoto.toLowerCase();
        switch (voteFilter) {
          case 'sim': return voteType === 'sim';
          case 'nao': return voteType === 'não' || voteType === 'nao';
          case 'abstencao': return voteType === 'abstenção' || voteType === 'abstencao';
          case 'votou': return voteType === 'votou';
          case 'p-nvr': return voteType === 'p-nrv' || voteType === 'p-nvr';
          case 'mis': return voteType === 'mis';
          case 'ap': return voteType === 'ap';
          case 'ls': return voteType === 'ls';
          default: return true;
        }
      });
    }
    
    // Aplicar ordenação
    if (orderBy) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[orderBy as keyof VoteData];
        let bValue = b[orderBy as keyof VoteData];
        
        // Tratamento especial para data
        if (orderBy === 'SessaoPlenaria') {
          aValue = a.SessaoPlenaria.DataSessao;
          bValue = b.SessaoPlenaria.DataSessao;
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
  }, [allVotes, searchTerm, voteFilter, orderBy, order]);

  // Paginação no frontend
  const totalFilteredVotes = filteredAndSortedVotes.length;
  const totalPages = Math.ceil(totalFilteredVotes / rowsPerPage);
  
  // Garantir que a página atual não exceda o total de páginas
  const currentPage = Math.min(page, Math.max(0, totalPages - 1));
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedVotes = filteredAndSortedVotes.slice(startIndex, endIndex);

  // Handlers para paginação
  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
    setExpandedRows(new Set()); // Reset expanded rows on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setExpandedRows(new Set());
  }, []);

  // Handlers para filtros
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset para primeira página quando filtrar
  }, []);

  const handleVoteFilterChange = useCallback((event: any) => {
    setVoteFilter(event.target.value);
    setPage(0); // Reset para primeira página quando filtrar
  }, []);

  // Handler para expansão de linhas (mobile)
  const toggleRowExpansion = useCallback((voteId: string) => {
    setExpandedRows(prev => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(voteId)) {
        newExpandedRows.delete(voteId);
      } else {
        newExpandedRows.add(voteId);
      }
      return newExpandedRows;
    });
  }, []);

  // Handler para ordenação
  const handleSort = useCallback((property: keyof VoteData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0); // Reset para primeira página quando ordenar
  }, [orderBy, order]);

  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  }, []);

  const getVoteColor = useCallback((voteSignature: string) => {
    switch (voteSignature.toLowerCase()) {
      case 'sim':
        return 'success';
      case 'não':
      case 'nao':
        return 'error';
      case 'abstenção':
      case 'abstencao':
        return 'warning';
      case 'votou':
      case 'P-NRV':
      case 'p-nrv':
      case 'MIS':
      case 'mis':
      case 'AP':
      case 'ap':
      case 'LS':
      case 'ls':
        return 'info';
      default:
        return 'default';
    }
  }, []);

  const getVoteTooltip = useCallback((voteSignature: string) => {
    const voteMap: Record<string, string> = {
      'sim': 'Votou SIM - A favor da proposta',
      'não': 'Votou NÃO - Contra a proposta',
      'nao': 'Votou NÃO - Contra a proposta',
      'abstenção': 'Abstenção - Não se posicionou sobre a proposta',
      'abstencao': 'Abstenção - Não se posicionou sobre a proposta',
      'votou': 'Votou - Participou da votação',
      'P-NRV': 'Presente mas não votou',
      'p-nrv': 'Presente mas não votou',
      'MIS': 'Missão da Casa no Pais/exterior',
      'mis': 'Missão da Casa no Pais/exterior',
      'AP': 'Atividade Parlamentar',
      'ap': 'Atividade Parlamentar',
      'LS': 'Licença Saúde',
      'ls': 'Licença Saúde',
    };

    return voteMap[voteSignature.toLowerCase()] || `Voto: ${voteSignature}`;
  }, []);

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
        <Typography variant="h6" color="secondary">
          Carregando histórico de votações...
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 600 }}>
          <AlertTitle>Aguarde um momento</AlertTitle>
          O servidor pode estar hibernando. A primeira requisição pode levar até 5 minutos.
        </Alert>
      </Box>
    );
  }

  if (votesError || !votesData || !votesData.data || votesData.data.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Erro ao carregar votações</AlertTitle>
            Não foi possível carregar o histórico de votações. Tente novamente mais tarde.
        </Alert>
        <Button
          component={Link}
          to={`/senators/${codigo}`}
          variant="contained"
          startIcon={<ArrowBackIcon />}
        >
            Voltar para detalhes do senador
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <ClickFeedback feedbackType="scale">
          <Button
            component={Link}
            to={`/senators/${codigo}`}
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Voltar para detalhes do senador
          </Button>
        </ClickFeedback>
        
        {senator && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Histórico de Votações
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {senator.NomeParlamentar}
            </Typography>
            <Typography variant="body1" color="primary">
              Mostrando {paginatedVotes.length} de {totalFilteredVotes} votações filtradas (de {allVotes.length} total)
            </Typography>
          </Box>
        )}
      </Box>

      {/* Filtros */}
      <Paper elevation={1} sx={{ mb: 3, p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <TextField
            placeholder="Buscar votações..."
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
              <InputLabel>Voto</InputLabel>
              <Select
                value={voteFilter}
                label="Voto"
                onChange={handleVoteFilterChange}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="sim">Sim</MenuItem>
                <MenuItem value="nao">Não</MenuItem>
                <MenuItem value="votou">Votou</MenuItem>
                <MenuItem value="p-nvr">Presente mas não votou</MenuItem>
                <MenuItem value="mis">Missão da Casa no Pais/exterior</MenuItem>
                <MenuItem value="ap">Atividade Parlamentar</MenuItem>
                <MenuItem value="ls">Licença Saúde</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={orderBy}
                label="Ordenar por"
                onChange={(event) => handleSort(event.target.value as keyof VoteData)}
              >
                <MenuItem value="">Nenhuma ordenação</MenuItem>
                <MenuItem value="Materia">Matéria</MenuItem>
                <MenuItem value="SiglaDescricaoVoto">Voto</MenuItem>
                <MenuItem value="SessaoPlenaria">Data</MenuItem>
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
                      active={orderBy === 'Materia'}
                      direction={orderBy === 'Materia' ? order : 'asc'}
                      onClick={() => handleSort('Materia')}
                    >
                      Matéria
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'SiglaDescricaoVoto'}
                      direction={orderBy === 'SiglaDescricaoVoto' ? order : 'asc'}
                      onClick={() => handleSort('SiglaDescricaoVoto')}
                    >
                      Voto
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    <TableSortLabel
                      active={orderBy === 'SessaoPlenaria'}
                      direction={orderBy === 'SessaoPlenaria' ? order : 'asc'}
                      onClick={() => handleSort('SessaoPlenaria')}
                    >
                      Data
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sessão</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Resultado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedVotes.map((vote, index) => (
                  <TableRow
                    key={`${vote.CodigoSessaoVotacao}-${index}`}
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
                          {vote.Materia.DescricaoIdentificacao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 300,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {vote.DescricaoVotacao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={getVoteTooltip(vote.SiglaDescricaoVoto)} arrow>
                        <Chip
                          label={vote.SiglaDescricaoVoto}
                          color={getVoteColor(vote.SiglaDescricaoVoto) as any}
                          size="small"
                          sx={{ cursor: 'help' }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(vote.SessaoPlenaria.DataSessao)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {vote.SessaoPlenaria.SiglaTipoSessao} {vote.SessaoPlenaria.NumeroSessao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Sim: {vote.TotalVotosSim}, Não: {vote.TotalVotosNao}, Abstenção: {vote.TotalVotosAbstencao}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver projeto">
                        <ClickFeedback feedbackType="ripple">
                          <IconButton
                            component={Link}
                            to={`/projects/${vote.Materia.IdentificacaoProcesso}`}
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
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={totalFilteredVotes}
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
          {paginatedVotes.map((vote, index) => {
            const voteId = `${vote.CodigoSessaoVotacao}-${index}`;
            const isExpanded = expandedRows.has(voteId);
            
            return (
              <Card key={voteId} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flex: 1, mr: 1 }}>
                          {vote.Materia.DescricaoIdentificacao}
                    </Typography>
                    <Tooltip title={getVoteTooltip(vote.SiglaDescricaoVoto)} arrow>
                      <Chip
                        label={vote.SiglaDescricaoVoto}
                        color={getVoteColor(vote.SiglaDescricaoVoto) as any}
                        size="small"
                        sx={{ cursor: 'help' }}
                      />
                    </Tooltip>
                  </Box>
                  
                  <Typography
                    variant="body2"
                    color="secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: isExpanded ? 0 : 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {vote.DescricaoVotacao}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Typography variant="caption" color="secondary">
                      <strong>Data:</strong> {formatDate(vote.SessaoPlenaria.DataSessao)}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      <strong>Sessão:</strong> {vote.SessaoPlenaria.SiglaTipoSessao} {vote.SessaoPlenaria.NumeroSessao}
                    </Typography>
                  </Box>

                  {isExpanded && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Resultado da Votação:
                      </Typography>
                      <Typography variant="body2" color="secondary" sx={{ mb: 2 }}>
                        Sim: {vote.TotalVotosSim}, Não: {vote.TotalVotosNao}, Abstenção: {vote.TotalVotosAbstencao}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Ementa:
                      </Typography>
                      <Typography variant="body2" color="secondary">
                        {vote.Materia.Ementa.length > 200 
                          ? `${vote.Materia.Ementa.substring(0, 200)}...`
                        : vote.Materia.Ementa
                      }
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <ClickFeedback feedbackType="scale">
                    <Button
                      component={Link}
                      to={`/projects/${vote.Materia.IdentificacaoProcesso}`}
                      variant="contained"
                      size="small"
                      startIcon={<VisibilityIcon />}
                    >
                      Ver Projeto
                    </Button>
                  </ClickFeedback>
                  <ClickFeedback feedbackType="ripple">
                    <IconButton
                      onClick={() => toggleRowExpansion(voteId)}
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
                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </ClickFeedback>
                </CardActions>
              </Card>
            );
          })}
          
          {/* Paginação Mobile */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <TablePagination
              component="div"
              count={totalFilteredVotes}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20]}
              labelRowsPerPage="Linhas:"
              labelDisplayedRows={({ from, to, count }) => 
                `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
              }
            />
          </Box>
        </Box>
      )}

      {/* Empty State */}
      {paginatedVotes.length === 0 && !isLoading && !votesError && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
          }}
        >
          <Typography variant="h6" color="secondary" gutterBottom>
            Nenhuma votação encontrada
          </Typography>
          <Typography variant="body2" color="secondary">
            {searchTerm || voteFilter !== 'all' 
              ? 'Tente ajustar os filtros de busca.' 
              : 'Este senador não possui votações registradas.'
            }
          </Typography>
        </Box>
      )}
    </Box>
  );
}
