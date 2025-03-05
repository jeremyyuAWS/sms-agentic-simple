
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimeDistributionChartProps {
  data: Array<{ [key: string]: string | number }>;
  xAxisKey: string;
  barKey: string;
  barColor: string;
  barName: string;
}

export const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({ 
  data, 
  xAxisKey, 
  barKey, 
  barColor, 
  barName 
}) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={barKey} fill={barColor} name={barName} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
