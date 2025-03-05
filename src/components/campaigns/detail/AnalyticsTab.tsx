
import React from 'react';
import { Message } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SentimentChart } from './SentimentChart';
import { TimeDistributionChart } from './TimeDistributionChart';
import { TimeSeriesChart } from './TimeSeriesChart';

interface AnalyticsTabProps {
  campaignMessages: Message[];
  responseRate?: number;
  timeOfDayData: Array<{ hour: string; count: number }>;
  dayOfWeekData: Array<{ day: string; count: number }>;
  sentimentData: Array<{ name: string; value: number }>;
  sentimentOverTimeData: Array<{ 
    date: string; 
    positive: number;
    neutral: number;
    negative: number;
  }>;
  messageActivityData: Array<{ 
    date: string; 
    outbound: number;
    inbound: number;
  }>;
  positiveSentimentPercentage: string;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  campaignMessages,
  responseRate,
  timeOfDayData,
  dayOfWeekData,
  sentimentData,
  sentimentOverTimeData,
  messageActivityData,
  positiveSentimentPercentage
}) => {
  return (
    <div className="space-y-8">
      {/* Top analytics overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Message Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignMessages.length}</div>
            <p className="text-xs text-muted-foreground">Total messages sent and received</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {responseRate ? `${(responseRate * 100).toFixed(1)}%` : '0.0%'}
            </div>
            <p className="text-xs text-muted-foreground">Of messages received a reply</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {positiveSentimentPercentage}%
            </div>
            <p className="text-xs text-muted-foreground">Of responses were positive</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Time of Day Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Time of Day Analysis</CardTitle>
          <CardDescription>
            Message activity distribution by hour of day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeDistributionChart 
            data={timeOfDayData} 
            xAxisKey="hour" 
            barKey="count" 
            barColor="#8884d8"
            barName="Messages"
          />
        </CardContent>
      </Card>
      
      {/* Day of Week Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Day of Week Analysis</CardTitle>
          <CardDescription>
            Message activity distribution by day of week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeDistributionChart 
            data={dayOfWeekData} 
            xAxisKey="day" 
            barKey="count" 
            barColor="#82ca9d"
            barName="Messages"
          />
        </CardContent>
      </Card>
      
      {/* Response Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle>Response Sentiment</CardTitle>
          <CardDescription>
            Distribution of response sentiment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SentimentChart sentimentData={sentimentData} />
        </CardContent>
      </Card>
      
      {/* Sentiment Over Time */}
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
          />
        </CardContent>
      </Card>
      
      {/* Message Activity Over Time */}
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
          />
        </CardContent>
      </Card>
    </div>
  );
};
