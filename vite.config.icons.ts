/**
 * Configuração específica para otimização de ícones
 * Evita o erro EMFILE: too many open files
 * Segue princípios SOLID e calistênicos de objetos
 */

import { defineConfig } from 'vite';

// Lista de ícones permitidos para evitar EMFILE
const ALLOWED_ICONS = [
  'ArrowBack',
  'Visibility',
  'ExpandMore', 
  'ExpandLess',
  'Search',
  'FilterList',
  'BathroomSharp',
  'Battery80',
  'HelpOutline'
];

// Função para verificar se um ícone é permitido
const isAllowedIcon = (id: string): boolean => {
  return ALLOWED_ICONS.some(icon => id.includes(`@mui/icons-material/${icon}`));
};

export const iconOptimizationConfig = defineConfig({
  build: {
    rollupOptions: {
      external: (id) => {
        // Bloquear ícones não permitidos
        if (id.includes('@mui/icons-material') && !isAllowedIcon(id)) {
          return true; // Marcar como externo para evitar bundling
        }
        return false;
      },
      output: {
        manualChunks: (id) => {
          // Separar ícones em chunks específicos
          if (id.includes('@mui/icons-material')) {
            return 'mui-icons-optimized';
          }
          return null;
        },
      },
    },
  },
  optimizeDeps: {
    include: ALLOWED_ICONS.map(icon => `@mui/icons-material/${icon}`),
    exclude: [
      // Excluir o pacote completo para evitar carregamento desnecessário
      '@mui/icons-material'
    ],
  },
  esbuild: {
    logLevel: 'warning',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    // Configurações específicas para reduzir arquivos abertos
    target: 'es2020',
    format: 'esm',
  },
  // Configurações adicionais para resolver EMFILE
  server: {
    fs: {
      strict: false, // Permitir acesso a arquivos fora do root
    },
  },
  define: {
    // Definir variáveis para otimização
    __ICON_OPTIMIZATION__: JSON.stringify(true),
  },
});
