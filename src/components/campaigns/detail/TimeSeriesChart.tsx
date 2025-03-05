
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TimeSeriesChartProps {
  data: Array<{ [key: string]: string | number }>;
  xAxisKey: string;
  lines: Array<{
    dataKey: string;
    stroke: string;
    name: string;
  }>;
  emptyMessage?: string;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ 
  data, 
  xAxisKey, 
  lines,
  emptyMessage = 'No data available' 
}) => {
  const isEmpty = !data || data.length === 0 || lines.every(line => 
    data.every(item => Number(item[line.dataKey] || 0) === 0)
  );

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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={2}
              dot={{ r: 4 }}
              name={line.name}
              activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
