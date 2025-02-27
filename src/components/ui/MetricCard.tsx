
import React from 'react';
import { cn } from '@/lib/utils';
import { MetricItem } from '@/lib/types';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import AnimatedCard from './AnimatedCard';

interface MetricCardProps {
  metric: MetricItem;
  className?: string;
  animationDelay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  metric, 
  className,
  animationDelay = 0
}) => {
  const { label, value, change, changeType, icon: Icon } = metric;

  const getChangeColor = () => {
    if (changeType === 'increase') return 'text-green-500';
    if (changeType === 'decrease') return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <AnimatedCard 
      className={cn('flex flex-col justify-between', className)} 
      animationDelay={animationDelay}
      hoverEffect="glow"
    >
      <div className="flex justify-between items-start">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        {Icon && <div className="text-primary/80">{React.createElement(Icon, { size: 20 })}</div>}
      </div>
      
      <div className="mt-4">
        <div className="metric-value">{value}</div>
        
        {change !== undefined && (
          <div className={cn(
            "flex items-center mt-2 text-sm font-medium transition-all",
            getChangeColor()
          )}>
            {changeType === 'increase' && <ArrowUpIcon className="h-3.5 w-3.5 mr-1" />}
            {changeType === 'decrease' && <ArrowDownIcon className="h-3.5 w-3.5 mr-1" />}
            {change}%
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default MetricCard;
