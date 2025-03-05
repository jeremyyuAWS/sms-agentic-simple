
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface SentimentChartProps {
  sentimentData: Array<{ name: string; value: number }>;
}

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'Positive': return '#4ade80'; // green
    case 'Neutral': return '#a1a1aa';  // gray
    case 'Negative': return '#f87171'; // red
    default: return '#8884d8';         // default purple
  }
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ sentimentData }) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sentimentData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {sentimentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getSentimentColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
