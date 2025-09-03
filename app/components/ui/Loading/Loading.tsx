import React from 'react';
import { clsx } from 'clsx';
import styles from './Loading.module.css';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  fullScreen = false,
  className
}) => {
  const containerClasses = clsx(
    styles.container,
    {
      [styles.fullScreen]: fullScreen
    },
    className
  );

  const spinnerClasses = clsx(
    styles.spinner,
    styles[variant],
    styles[size],
    styles[color]
  );

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={spinnerClasses}>
            <svg
              className={styles.spinnerIcon}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className={styles.spinnerCircle}
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className={styles.spinnerPath}
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        );

      case 'dots':
        return (
          <div className={spinnerClasses}>
            <div className={styles.dots}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>
        );

      case 'pulse':
        return (
          <div className={spinnerClasses}>
            <div className={styles.pulse}></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={containerClasses}>
      {renderSpinner()}
      {text && (
        <p className={styles.text}>
          {text}
        </p>
      )}
    </div>
  );
};
