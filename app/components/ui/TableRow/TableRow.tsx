import React, { useState, useCallback } from 'react';
import { TableRow as MuiTableRow, type TableRowProps as MuiTableRowProps } from '@mui/material';
import { ClickFeedback } from '../ClickFeedback';
import { clsx } from 'clsx';
import styles from './TableRow.module.css';

export interface TableRowProps extends MuiTableRowProps {
  clickable?: boolean;
  feedbackType?: 'ripple' | 'scale' | 'glow';
  onRowClick?: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({
  clickable = false,
  feedbackType = 'ripple',
  onRowClick,
  children,
  className,
  sx,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback((event: React.MouseEvent) => {
    if (clickable && onRowClick) {
      onRowClick(event);
    }
  }, [clickable, onRowClick]);

  const rowClasses = clsx(
    styles.tableRow,
    {
      [styles.clickable]: clickable,
      [styles.hovered]: isHovered,
    },
    className
  );

  const rowSx = {
    transition: 'all 0.2s ease',
    cursor: clickable ? 'pointer' : 'default',
    '&:hover': clickable ? {
      backgroundColor: 'action.hover',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    } : {},
    ...sx,
  };

  if (clickable) {
    return (
      <ClickFeedback feedbackType={feedbackType}>
        <MuiTableRow
          className={rowClasses}
          sx={rowSx}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          {...props}
        >
          {children}
        </MuiTableRow>
      </ClickFeedback>
    );
  }

  return (
    <MuiTableRow
      className={rowClasses}
      sx={rowSx}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </MuiTableRow>
  );
};
