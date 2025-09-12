/**
 * Registry de ícones otimizado seguindo princípios SOLID
 * Responsabilidade única: Gerenciar importações de ícones
 * Aberto/fechado: Extensível para novos ícones
 * Inversão de dependência: Interface abstrata para ícones
 */

import { lazy, type ComponentType } from 'react';
import { type SvgIconProps } from '@mui/material/SvgIcon';

// Tipo para ícones seguindo o princípio da inversão de dependência
export type IconComponent = ComponentType<SvgIconProps>;

// Registry de ícones usando lazy loading para evitar EMFILE
// Usando importações específicas para reduzir o número de arquivos abertos
export const IconRegistry = {
  // Ícones de navegação
  ArrowBack: lazy(() => import('@mui/icons-material/ArrowBack').then(m => ({ default: m.default }))),
  Visibility: lazy(() => import('@mui/icons-material/Visibility').then(m => ({ default: m.default }))),
  
  // Ícones de interface
  ExpandMore: lazy(() => import('@mui/icons-material/ExpandMore').then(m => ({ default: m.default }))),
  ExpandLess: lazy(() => import('@mui/icons-material/ExpandLess').then(m => ({ default: m.default }))),
  Search: lazy(() => import('@mui/icons-material/Search').then(m => ({ default: m.default }))),
  FilterList: lazy(() => import('@mui/icons-material/FilterList').then(m => ({ default: m.default }))),
  BathroomSharp: lazy(() => import('@mui/icons-material/BathroomSharp').then(m => ({ default: m.default }))),
  Battery80: lazy(() => import('@mui/icons-material/Battery80').then(m => ({ default: m.default }))),
  HelpOutline: lazy(() => import('@mui/icons-material/HelpOutline').then(m => ({ default: m.default }))),
} as const;

// Tipo para chaves do registry
export type IconName = keyof typeof IconRegistry;

// Hook para carregar ícones de forma otimizada
export const useIcon = (iconName: IconName): IconComponent => {
  return IconRegistry[iconName];
};
