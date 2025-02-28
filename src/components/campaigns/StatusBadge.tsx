
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Campaign } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: Campaign['status'];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  className 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          fullColor: 'bg-green-500 text-white',
          label: 'Active'
        };
      case 'paused':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          fullColor: 'bg-yellow-500 text-white',
          label: 'Paused'
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          fullColor: 'bg-blue-500 text-white',
          label: 'Completed'
        };
      case 'draft':
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          fullColor: 'bg-gray-500 text-white',
          label: 'Draft'
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-2.5 py-1.5 text-sm'
  };

  return (
    <Badge 
      className={cn(
        config.color,
        sizeClasses[size],
        "font-medium rounded-full border",
        className
      )}
      variant="outline"
    >
      {config.label}
    </Badge>
  );
};

export const StatusBadgeFilled: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md',
  className 
}) => {
  const config = getStatusConfig();
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-2.5 py-1.5 text-sm'
  };

  return (
    <Badge 
      className={cn(
        config.fullColor,
        sizeClasses[size],
        "font-medium rounded-full",
        className
      )}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
