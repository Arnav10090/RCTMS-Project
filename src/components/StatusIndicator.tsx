import React from 'react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'active' | 'warning' | 'danger' | 'idle';
  label: string;
  value?: string | number;
  className?: string;
  animate?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  value,
  className,
  animate = true
}) => {
  const statusConfig = {
    active: {
      color: 'bg-success',
      textColor: 'text-success',
      animation: animate ? 'animate-pulse-glow' : ''
    },
    warning: {
      color: 'bg-warning',
      textColor: 'text-warning',
      animation: animate ? 'animate-status-blink' : ''
    },
    danger: {
      color: 'bg-danger',
      textColor: 'text-danger',
      animation: animate ? 'animate-status-blink' : ''
    },
    idle: {
      color: 'bg-muted-foreground',
      textColor: 'text-muted-foreground',
      animation: ''
    }
  };

  const config = statusConfig[status];

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <div 
        className={cn(
          'w-3 h-3 rounded-full',
          config.color,
          config.animation
        )}
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground">{label}</div>
        {value && (
          <div className={cn('text-lg font-mono font-semibold', config.textColor)}>
            {value}
          </div>
        )}
      </div>
    </div>
  );
};