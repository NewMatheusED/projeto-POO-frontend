/**
 * Carregador de ícones otimizado seguindo princípios SOLID
 * Responsabilidade única: Gerenciar o carregamento eficiente de ícones
 * Aberto/fechado: Extensível para novos tipos de carregamento
 * Inversão de dependência: Interface abstrata para carregamento
 */

import { type ComponentType } from 'react';
import { type SvgIconProps } from '@mui/material/SvgIcon';

// Interface para carregamento de ícones
export interface IconLoader {
  loadIcon: (iconName: string) => Promise<ComponentType<SvgIconProps>>;
  preloadIcon: (iconName: string) => Promise<void>;
  isIconLoaded: (iconName: string) => boolean;
}

// Cache de ícones carregados
const iconCache = new Map<string, ComponentType<SvgIconProps>>();

/**
 * Implementação do carregador de ícones com cache
 * Segue o princípio da responsabilidade única
 */
export class MaterialUIIconLoader implements IconLoader {
  private loadingPromises = new Map<string, Promise<ComponentType<SvgIconProps>>>();

  async loadIcon(iconName: string): Promise<ComponentType<SvgIconProps>> {
    // Verificar cache primeiro
    if (iconCache.has(iconName)) {
      return iconCache.get(iconName)!;
    }

    // Verificar se já está carregando
    if (this.loadingPromises.has(iconName)) {
      return this.loadingPromises.get(iconName)!;
    }

    // Carregar ícone dinamicamente
    const loadingPromise = this.loadIconDynamically(iconName);
    this.loadingPromises.set(iconName, loadingPromise);

    try {
      const iconComponent = await loadingPromise;
      iconCache.set(iconName, iconComponent);
      this.loadingPromises.delete(iconName);
      return iconComponent;
    } catch (error) {
      this.loadingPromises.delete(iconName);
      throw error;
    }
  }

  async preloadIcon(iconName: string): Promise<void> {
    if (!iconCache.has(iconName) && !this.loadingPromises.has(iconName)) {
      await this.loadIcon(iconName);
    }
  }

  isIconLoaded(iconName: string): boolean {
    return iconCache.has(iconName);
  }

  private async loadIconDynamically(iconName: string): Promise<ComponentType<SvgIconProps>> {
    try {
      const module = await import(`@mui/icons-material/${iconName}`);
      return module.default;
    } catch (error) {
      console.warn(`Ícone ${iconName} não encontrado, usando ícone padrão`);
      // Fallback para um ícone padrão
      const module = await import('@mui/icons-material/HelpOutline');
      return module.default;
    }
  }
}

// Instância singleton do carregador
export const iconLoader = new MaterialUIIconLoader();
