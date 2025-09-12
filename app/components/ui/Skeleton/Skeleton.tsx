import React from 'react';
import { clsx } from 'clsx';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  children,
}) => {
  const skeletonClasses = clsx(
    styles.skeleton,
    styles[variant],
    styles[animation],
    className
  );

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || '1em',
  };

  if (children) {
    return (
      <div className={styles.container}>
        <div className={skeletonClasses} style={style} />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={skeletonClasses}
      style={style}
      aria-label="Carregando conteúdo..."
    />
  );
};

// Componentes específicos para diferentes tipos de conteúdo
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        height="1em"
        width={index === lines - 1 ? '60%' : '100%'}
        className={index > 0 ? 'mt-2' : ''}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx(styles.cardSkeleton, className)}>
    <Skeleton variant="rectangular" height={200} />
    <div className="p-4">
      <Skeleton variant="text" height="1.5em" width="80%" />
      <Skeleton variant="text" height="1em" width="60%" className="mt-2" />
      <Skeleton variant="text" height="1em" width="40%" className="mt-2" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 4,
  className,
}) => (
  <div className={className}>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 mb-2">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            height="1em"
            width={colIndex === 0 ? '20%' : colIndex === columns - 1 ? '15%' : '25%'}
          />
        ))}
      </div>
    ))}
  </div>
);
