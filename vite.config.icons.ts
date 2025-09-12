/**
 * Configuração específica para otimização de ícones
 * Evita o erro EMFILE: too many open files
 */

import { defineConfig } from 'vite';

export const iconOptimizationConfig = defineConfig({
  build: {
    rollupOptions: {
      external: (id) => {
        // Evitar bundling de todos os ícones do Material-UI
        if (id.includes('@mui/icons-material') && !id.includes('esm')) {
          return false; // Incluir apenas os ícones necessários
        }
        return false;
      },
      output: {
        manualChunks: {
          // Separar ícones em chunk próprio
          'mui-icons': ['@mui/icons-material'],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      // Incluir apenas os ícones necessários na otimização
      '@mui/icons-material/ArrowBack',
      '@mui/icons-material/Visibility',
      '@mui/icons-material/ExpandMore',
      '@mui/icons-material/ExpandLess',
      '@mui/icons-material/Search',
      '@mui/icons-material/FilterList',
    ],
    exclude: [
      // Excluir todos os outros ícones para evitar EMFILE
      '@mui/icons-material',
    ],
  },
  esbuild: {
    // Configurações específicas para reduzir arquivos abertos
    logLevel: 'warning',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
});
