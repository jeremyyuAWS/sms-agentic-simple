
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TimeSeriesChart } from './TimeSeriesChart';

interface MessageActivityChartProps {
  messageActivityData: any[];
  useDemoData: boolean;
}

export const MessageActivityChart: React.FC<MessageActivityChartProps> = ({
  messageActivityData,
  useDemoData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Activity</CardTitle>
        <CardDescription>
          Message volume over the campaign duration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TimeSeriesChart 
          data={messageActivityData}
          xAxisKey="date"
          lines={[
            { dataKey: "outbound", stroke: "#8884d8", name: "Outbound" },
            { dataKey: "inbound", stroke: "#82ca9d", name: "Inbound" }
          ]}
          emptyMessage="No message activity data available yet"
        />
      </CardContent>
    </Card>
  );
};
