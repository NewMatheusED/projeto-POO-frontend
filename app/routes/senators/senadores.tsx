import { useSenators } from '~/hooks';
import { SenatorCard, Loading, ClickFeedback } from '~/components/ui';
import { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  TablePagination,
  Alert,
  AlertTitle,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import styles from './senadores.module.css';

// Tipos para melhor tipagem
interface SenatorData {
  codigo: string;
  nome: string;
  nomeCompleto: string;
  siglaPartido: string;
  uf: string;
  descricaoParticipacao: string;
  urlFoto: string;
}

export default function SenadoresPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 6 : 12);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [partyFilter, setPartyFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useSenators();

  const allSenators = data?.data || [];

  // Filtros aplicados
  const filteredSenators = useMemo(() => {
    let filtered = allSenators;
    
    if (searchTerm) {
      filtered = filtered.filter(senator => 
        senator.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        senator.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        senator.siglaPartido.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (stateFilter !== 'all') {
      filtered = filtered.filter(senator => 
        senator.uf.toLowerCase() === stateFilter.toLowerCase()
      );
    }
    
    if (partyFilter !== 'all') {
      filtered = filtered.filter(senator => 
        senator.siglaPartido.toLowerCase() === partyFilter.toLowerCase()
      );
    }
    
    return filtered;
  }, [allSenators, searchTerm, stateFilter, partyFilter]);

  // Paginação no frontend
  const totalFilteredSenators = filteredSenators.length;
  const currentPage = Math.min(page, Math.max(0, Math.ceil(totalFilteredSenators / rowsPerPage) - 1));
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedSenators = filteredSenators.slice(startIndex, endIndex);

  // Handlers
  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  }, []);

  const handleStateFilterChange = useCallback((event: any) => {
    setStateFilter(event.target.value);
    setPage(0);
  }, []);

  const handlePartyFilterChange = useCallback((event: any) => {
    setPartyFilter(event.target.value);
    setPage(0);
  }, []);

  // Obter estados e partidos únicos
  const uniqueStates = useMemo(() => {
    return [...new Set(allSenators.map(senator => senator.uf))].sort();
  }, [allSenators]);

  const uniqueParties = useMemo(() => {
    return [...new Set(allSenators.map(senator => senator.siglaPartido))].sort();
  }, [allSenators]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loading size="lg" />
          <p className={styles.loadingText}>Carregando senadores...</p>
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
          <h2 className={styles.errorTitle}>Erro ao carregar senadores</h2>
          <p className={styles.errorMessage}>
            Não foi possível carregar a lista de senadores. Tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Senadores do Brasil</h1>
        <p className={styles.subtitle}>
          Mostrando {paginatedSenators.length} de {totalFilteredSenators} senadores filtrados (de {allSenators.length} total)
        </p>
      </div>

      {/* Filtros */}
      <div className={styles.filtersContainer}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar senadores..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={styles.filterButton}
          >
            🔍
          </button>
        </div>

        {showFilters && (
          <div className={styles.filtersRow}>
            <select
              value={stateFilter}
              onChange={handleStateFilterChange}
              className={styles.filterSelect}
            >
              <option value="all">Todos os Estados</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <select
              value={partyFilter}
              onChange={handlePartyFilterChange}
              className={styles.filterSelect}
            >
              <option value="all">Todos os Partidos</option>
              {uniqueParties.map(party => (
                <option key={party} value={party}>{party}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {paginatedSenators.map((senator) => (
          <ClickFeedback key={senator.codigo} feedbackType="scale">
            <SenatorCard senator={senator} />
          </ClickFeedback>
        ))}
      </div>

      {/* Paginação */}
      {totalFilteredSenators > rowsPerPage && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            <span>
              Página {currentPage + 1} de {Math.ceil(totalFilteredSenators / rowsPerPage)}
            </span>
            <span>
              Mostrando {startIndex + 1}-{Math.min(endIndex, totalFilteredSenators)} de {totalFilteredSenators}
            </span>
          </div>
          
          <div className={styles.paginationControls}>
            <button
              onClick={() => handleChangePage(null, 0)}
              disabled={currentPage === 0}
              className={styles.paginationButton}
            >
              ⏮️
            </button>
            <button
              onClick={() => handleChangePage(null, currentPage - 1)}
              disabled={currentPage === 0}
              className={styles.paginationButton}
            >
              ⏪
            </button>
            
            <span className={styles.pageNumber}>
              {currentPage + 1}
            </span>
            
            <button
              onClick={() => handleChangePage(null, currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalFilteredSenators / rowsPerPage) - 1}
              className={styles.paginationButton}
            >
              ⏩
            </button>
            <button
              onClick={() => handleChangePage(null, Math.ceil(totalFilteredSenators / rowsPerPage) - 1)}
              disabled={currentPage >= Math.ceil(totalFilteredSenators / rowsPerPage) - 1}
              className={styles.paginationButton}
            >
              ⏭️
            </button>
          </div>

          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className={styles.rowsPerPageSelect}
          >
            <option value={6}>6 por página</option>
            <option value={12}>12 por página</option>
            <option value={24}>24 por página</option>
            <option value={48}>48 por página</option>
          </select>
        </div>
      )}

      {/* Empty State */}
      {paginatedSenators.length === 0 && !isLoading && !error && (
        <div className={styles.emptyState}>
          <h3>Nenhum senador encontrado</h3>
          <p>
            {searchTerm || stateFilter !== 'all' || partyFilter !== 'all' 
              ? 'Tente ajustar os filtros de busca.' 
              : 'Tente novamente mais tarde ou verifique sua conexão.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
