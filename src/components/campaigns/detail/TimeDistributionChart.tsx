
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TimeDistributionChartProps {
  data: Array<{ [key: string]: string | number }>;
  xAxisKey: string;
  barKey: string;
  barColor: string;
  barName: string;
  showResponseData?: boolean;
  responseKey?: string;
  responseBarColor?: string;
  responseName?: string;
  responseRateKey?: string;
  responseRateColor?: string;
  responseRateName?: string;
  emptyMessage?: string;
}

export const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({ 
  data, 
  xAxisKey, 
  barKey, 
  barColor, 
  barName,
  showResponseData = false,
  responseKey = 'responses',
  responseBarColor = '#82ca9d',
  responseName = 'Responses',
  responseRateKey = 'responseRate',
  responseRateColor = '#ffc658',
  responseRateName = 'Response Rate %',
  emptyMessage = 'No data available'
}) => {
  const isEmpty = !data || data.length === 0 || data.every(item => Number(item[barKey] || 0) === 0);

  if (isEmpty) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip formatter={(value, name) => {
            // Format percentage values
            if (name === responseRateName && responseRateKey) {
              return [`${value}%`, name];
            }
            return [value, name];
          }} />
          <Legend />
          <Bar dataKey={barKey} fill={barColor} name={barName} />
          {showResponseData && responseKey && (
            <Bar dataKey={responseKey} fill={responseBarColor} name={responseName} />
          )}
          {showResponseData && responseRateKey && (
            <Bar dataKey={responseRateKey} fill={responseRateColor} name={responseRateName} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
