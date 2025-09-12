/**
 * Wrapper para ícones seguindo princípios SOLID
 * Responsabilidade única: Renderizar ícones com fallback
 * Aberto/fechado: Extensível para novos tipos de ícones
 * Substituição de Liskov: Mantém compatibilidade com SvgIconProps
 */

import React, { Suspense } from 'react';
import { type SvgIconProps, CircularProgress, Box } from '@mui/material';
import { IconRegistry, type IconName } from './IconRegistry';

interface IconWrapperProps extends SvgIconProps {
  name: IconName;
  fallback?: React.ReactNode;
}

/**
 * Componente wrapper para ícones com lazy loading e fallback
 * Segue o princípio da responsabilidade única
 */
export const IconWrapper: React.FC<IconWrapperProps> = ({ 
  name, 
  fallback = <CircularProgress size={20} />,
  ...props 
}) => {
  const IconComponent = IconRegistry[name];

  return (
    <Suspense 
      fallback={
        <Box 
          display="inline-flex"
          alignItems="center" 
          justifyContent="center"
          sx={{ width: 24, height: 24 }}
        >
          {fallback}
        </Box>
      }
    >
      <IconComponent {...props} />
    </Suspense>
  );
};

export default IconWrapper;
