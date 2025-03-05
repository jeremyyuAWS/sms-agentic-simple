
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SentimentChart } from './SentimentChart';
import { TimeSeriesChart } from './TimeSeriesChart';

interface SentimentAnalysisChartsProps {
  sentimentData: any[];
  sentimentOverTimeData: any[];
}

export const SentimentAnalysisCharts: React.FC<SentimentAnalysisChartsProps> = ({
  sentimentData,
  sentimentOverTimeData
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Response Sentiment</CardTitle>
          <CardDescription>
            Distribution of response sentiment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SentimentChart 
            sentimentData={sentimentData} 
            emptyMessage="No response sentiment data available yet"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Over Time</CardTitle>
          <CardDescription>
            How response sentiment has changed over the campaign duration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeSeriesChart 
            data={sentimentOverTimeData}
            xAxisKey="date"
            lines={[
              { dataKey: "positive", stroke: "#4ade80", name: "Positive" },
              { dataKey: "neutral", stroke: "#a1a1aa", name: "Neutral" },
              { dataKey: "negative", stroke: "#f87171", name: "Negative" }
            ]}
            emptyMessage="No sentiment trend data available yet"
          />
        </CardContent>
      </Card>
    </>
  );
};
