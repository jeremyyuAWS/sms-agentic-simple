
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TimeDistributionChart } from './TimeDistributionChart';

interface TimeDistributionChartsProps {
  timeOfDayData: any[];
  dayOfWeekData: any[];
}

export const TimeDistributionCharts: React.FC<TimeDistributionChartsProps> = ({
  timeOfDayData,
  dayOfWeekData
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Time of Day Analysis</CardTitle>
          <CardDescription>
            Message activity and response distribution by hour of day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeDistributionChart 
            data={timeOfDayData} 
            xAxisKey="hour" 
            barKey="count" 
            barColor="#8884d8"
            barName="Messages Sent"
            showResponseData={true}
            responseKey="responses"
            responseBarColor="#82ca9d"
            responseName="Responses"
            emptyMessage="No time of day data available yet"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Day of Week Analysis</CardTitle>
          <CardDescription>
            Message activity and response distribution by day of week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeDistributionChart 
            data={dayOfWeekData} 
            xAxisKey="day" 
            barKey="count" 
            barColor="#8884d8"
            barName="Messages Sent"
            showResponseData={true}
            responseKey="positive"
            responseBarColor="#4ade80"
            responseName="Positive Responses"
            emptyMessage="No day of week data available yet"
          />
        </CardContent>
      </Card>
    </>
  );
};
