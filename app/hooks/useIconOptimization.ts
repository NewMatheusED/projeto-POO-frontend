/**
 * Hook para otimização de ícones
 * Segue princípios SOLID e calistênicos de objetos
 */

import { useEffect } from 'react';
import { iconOptimizer } from '~/lib/icon-optimization';

/**
 * Hook para inicializar otimização de ícones
 * Responsabilidade única: Gerenciar inicialização da otimização
 */
export const useIconOptimization = () => {
  useEffect(() => {
    // Preload de ícones críticos na inicialização
    iconOptimizer.preloadCriticalIcons();
  }, []);
};

export default useIconOptimization;
