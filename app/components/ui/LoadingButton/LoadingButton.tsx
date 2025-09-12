import React, { useState, useCallback } from 'react';
import { Button, ClickFeedback } from '~/components/ui';
import { Loading } from '~/components/ui';
import { clsx } from 'clsx';
import styles from './LoadingButton.module.css';

export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  feedbackType?: 'ripple' | 'scale' | 'glow';
  disabled?: boolean;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  feedbackType = 'ripple',
  disabled = false,
  className,
  onClick,
  ...props
}) => {
  const [isClicking, setIsClicking] = useState(false);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    setIsClicking(true);
    
    // Simular feedback visual imediato
    setTimeout(() => {
      setIsClicking(false);
    }, 150);

    onClick?.(event);
  }, [disabled, isLoading, onClick]);

  const buttonClasses = clsx(
    styles.button,
    {
      [styles.clicking]: isClicking,
      [styles.fullWidth]: fullWidth,
    },
    className
  );

  const displayText = isLoading ? (loadingText || 'Carregando...') : children;
  const isDisabled = disabled || isLoading;

  return (
    <ClickFeedback
      feedbackType={feedbackType}
      disabled={isDisabled}
      className={buttonClasses}
    >
      <Button
        variant={variant}
        size={size}
        disabled={isDisabled}
        fullWidth={fullWidth}
        className={styles.buttonContent}
        {...props}
      >
        {isLoading && (
          <div className={styles.loadingContainer}>
            <Loading size="sm" variant="spinner" color="white" />
          </div>
        )}
        
        {!isLoading && leftIcon && (
          <span className={styles.leftIcon} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        <span className={styles.content}>
          {displayText}
        </span>
        
        {!isLoading && rightIcon && (
          <span className={styles.rightIcon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Button>
    </ClickFeedback>
  );
};
