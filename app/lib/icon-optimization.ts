/**
 * Configuração de otimização de ícones para evitar EMFILE
 * Segue princípios SOLID e calistênicos de objetos
 */

// Lista de ícones que devem ser carregados de forma otimizada
export const OPTIMIZED_ICONS = [
  'ArrowBack',
  'Visibility', 
  'ExpandMore',
  'ExpandLess',
  'Search',
  'FilterList',
  'BathroomSharp',
  'Battery80',
  'HelpOutline'
] as const;

// Configuração para preload de ícones críticos
export const CRITICAL_ICONS = [
  'Search',
  'FilterList',
  'Visibility'
] as const;

// Interface para configuração de otimização
export interface IconOptimizationConfig {
  enablePreload: boolean;
  enableCache: boolean;
  maxConcurrentLoads: number;
  fallbackIcon: string;
}

// Configuração padrão seguindo princípios SOLID
export const DEFAULT_ICON_CONFIG: IconOptimizationConfig = {
  enablePreload: true,
  enableCache: true,
  maxConcurrentLoads: 3, // Limitar carregamentos simultâneos
  fallbackIcon: 'HelpOutline'
};

/**
 * Classe para gerenciar otimização de ícones
 * Segue o princípio da responsabilidade única
 */
export class IconOptimizer {
  private loadedIcons = new Set<string>();
  private loadingQueue: string[] = [];
  private config: IconOptimizationConfig;

  constructor(config: IconOptimizationConfig = DEFAULT_ICON_CONFIG) {
    this.config = config;
  }

  /**
   * Verifica se um ícone está carregado
   * Método simples com uma responsabilidade
   */
  isIconLoaded(iconName: string): boolean {
    return this.loadedIcons.has(iconName);
  }

  /**
   * Adiciona ícone à fila de carregamento
   * Segue o princípio de uma operação por método
   */
  queueIconLoad(iconName: string): void {
    if (!this.loadedIcons.has(iconName) && !this.loadingQueue.includes(iconName)) {
      this.loadingQueue.push(iconName);
    }
  }

  /**
   * Processa a fila de carregamento respeitando o limite
   * Método focado com responsabilidade única
   */
  async processQueue(): Promise<void> {
    const toLoad = this.loadingQueue.splice(0, this.config.maxConcurrentLoads);
    
    await Promise.all(
      toLoad.map(iconName => this.loadIcon(iconName))
    );
  }

  /**
   * Carrega um ícone específico
   * Método simples e direto
   */
  private async loadIcon(iconName: string): Promise<void> {
    try {
      // Simular carregamento otimizado
      await new Promise(resolve => setTimeout(resolve, 10));
      this.loadedIcons.add(iconName);
    } catch (error) {
      console.warn(`Falha ao carregar ícone ${iconName}:`, error);
    }
  }

  /**
   * Preload de ícones críticos
   * Método focado em uma responsabilidade
   */
  async preloadCriticalIcons(): Promise<void> {
    if (!this.config.enablePreload) return;
    
    CRITICAL_ICONS.forEach(iconName => {
      this.queueIconLoad(iconName);
    });
    
    await this.processQueue();
  }
}

// Instância singleton do otimizador
export const iconOptimizer = new IconOptimizer();
