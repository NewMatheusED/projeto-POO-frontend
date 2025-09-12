import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import styles from './ClickFeedback.module.css';

export interface ClickFeedbackProps {
  children: React.ReactNode;
  feedbackType?: 'ripple' | 'scale' | 'glow';
  duration?: number;
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

export const ClickFeedback: React.FC<ClickFeedbackProps> = ({
  children,
  feedbackType = 'ripple',
  duration = 300,
  className,
  disabled = false,
  onClick,
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (disabled) return;

    setIsActive(true);

    if (feedbackType === 'ripple') {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
      };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, duration);
    }

    // Reset active state
    setTimeout(() => {
      setIsActive(false);
    }, duration);
  }, [disabled, feedbackType, duration]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    if (disabled) return;
    onClick?.(event);
  }, [disabled, onClick]);

  const containerClasses = clsx(
    styles.container,
    {
      [styles.active]: isActive,
      [styles.disabled]: disabled,
      [styles.ripple]: feedbackType === 'ripple',
      [styles.scale]: feedbackType === 'scale',
      [styles.glow]: feedbackType === 'glow',
    },
    className
  );

  return (
    <div
      className={containerClasses}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      style={{ '--duration': `${duration}ms` } as React.CSSProperties}
      {...props}
    >
      {children}
      
      {feedbackType === 'ripple' && ripples.map(ripple => (
        <span
          key={ripple.id}
          className={styles.rippleEffect}
          style={{
            left: ripple.x,
            top: ripple.y,
            animationDuration: `${duration}ms`,
          }}
        />
      ))}
    </div>
  );
};
