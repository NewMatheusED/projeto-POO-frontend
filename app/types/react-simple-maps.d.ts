declare module 'react-simple-maps' {
  import { ReactNode } from 'react';

  export interface ComposableMapProps {
    width?: number;
    height?: number;
    projection?: string;
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
    };
    children?: ReactNode;
  }

  export interface GeographiesProps {
    geography: any;
    children: (props: { geographies: any[] }) => ReactNode;
  }

  export interface GeographyProps {
    geography: any;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    style?: {
      default?: any;
      hover?: any;
      pressed?: any;
    };
  }

  export const ComposableMap: React.FC<ComposableMapProps>;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: React.FC<GeographyProps>;
}
