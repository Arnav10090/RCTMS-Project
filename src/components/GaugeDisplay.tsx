import React from 'react';
import { cn } from '@/lib/utils';

interface GaugeDisplayProps {
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  label: string;
  thresholds?: {
    warning: number;
    danger: number;
  };
  className?: string;
}

export const GaugeDisplay: React.FC<GaugeDisplayProps> = ({
  value,
  min = 0,
  max = 100,
  unit = '%',
  label,
  thresholds,
  className
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const getStatusColor = () => {
    if (thresholds) {
      if (value >= thresholds.danger) return 'danger';
      if (value >= thresholds.warning) return 'warning';
    }
    return 'success';
  };

  const status = getStatusColor();
  
  const statusColors = {
    success: 'bg-gradient-success',
    warning: 'bg-gradient-warning',
    danger: 'bg-gradient-danger'
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-lg font-mono font-bold text-foreground">
          {value.toFixed(1)}{unit}
        </span>
      </div>
      
      <div className="relative">
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full transition-all duration-1000 ease-out rounded-full',
              statusColors[status]
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        {thresholds && (
          <div className="absolute top-0 w-full h-3 flex">
            <div 
              className="border-r-2 border-warning" 
              style={{ width: `${((thresholds.warning - min) / (max - min)) * 100}%` }}
            />
            <div 
              className="border-r-2 border-danger" 
              style={{ width: `${((thresholds.danger - thresholds.warning) / (max - min)) * 100}%` }}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};