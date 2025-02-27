
import React from 'react';
import { MetricItem } from '@/lib/types';
import MetricCard from '@/components/ui/MetricCard';

interface DashboardMetricsProps {
  metrics: MetricItem[];
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      {metrics.map((metric, index) => (
        <MetricCard 
          key={metric.label} 
          metric={metric} 
          animationDelay={index * 100}
        />
      ))}
    </div>
  );
};

export default DashboardMetrics;
