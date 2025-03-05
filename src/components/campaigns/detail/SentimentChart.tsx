
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SentimentChartProps {
  sentimentData: Array<{ name: string; value: number }>;
  emptyMessage?: string;
}

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'Positive': return '#4ade80'; // green
    case 'Neutral': return '#a1a1aa';  // gray
    case 'Negative': return '#f87171'; // red
    default: return '#8884d8';         // default purple
  }
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show labels for small slices

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ 
  sentimentData,
  emptyMessage = 'No sentiment data available' 
}) => {
  const isEmpty = !sentimentData || sentimentData.length === 0 || 
                 sentimentData.every(item => item.value === 0);

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
        <PieChart>
          <Pie
            data={sentimentData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {sentimentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getSentimentColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => {
            const total = sentimentData.reduce((sum, item) => sum + item.value, 0);
            const percentage = total > 0 ? Math.round((Number(value) / total) * 100) : 0;
            return [`${value} (${percentage}%)`, name];
          }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
