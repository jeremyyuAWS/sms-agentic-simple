
import React, { useEffect, useState } from 'react';
import { Message } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SentimentChart } from './SentimentChart';
import { TimeDistributionChart } from './TimeDistributionChart';
import { TimeSeriesChart } from './TimeSeriesChart';
import * as analyticsUtils from './analyticsUtils';

interface AnalyticsTabProps {
  campaignMessages: Message[];
  responseRate?: number;
  isCompleted?: boolean;
  campaignName?: string;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  campaignMessages,
  responseRate,
  isCompleted = false,
  campaignName = ''
}) => {
  // Use demo data for completed campaigns or when explicitly requested
  const useDemoData = isCompleted || campaignMessages.length === 0;
  
  // Generate data
  const timeOfDayData = analyticsUtils.generateTimeOfDayData(campaignMessages, useDemoData);
  const dayOfWeekData = analyticsUtils.generateDayOfWeekData(campaignMessages, useDemoData);
  const sentimentData = analyticsUtils.generateSentimentData(campaignMessages, useDemoData);
  const sentimentOverTimeData = analyticsUtils.generateSentimentOverTimeData(campaignMessages, useDemoData);
  const messageActivityData = analyticsUtils.generateMessageActivityData(campaignMessages, useDemoData);
  const positiveSentimentPercentage = analyticsUtils.calculatePositiveSentimentPercentage(campaignMessages, useDemoData);
  
  // Calculate totals for demo or real data
  const totalMessages = useDemoData 
    ? messageActivityData.reduce((sum, day) => sum + (Number(day.outbound) || 0), 0)
    : campaignMessages.filter(m => m.type === 'outbound').length;
  
  const totalResponses = useDemoData
    ? messageActivityData.reduce((sum, day) => sum + (Number(day.inbound) || 0), 0)
    : campaignMessages.filter(m => m.type === 'inbound').length;
  
  const calculatedResponseRate = totalMessages > 0 
    ? ((totalResponses / totalMessages) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8">
      {/* Top analytics overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Message Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMessages}</div>
            <p className="text-xs text-muted-foreground">Total messages sent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {responseRate ? `${(responseRate * 100).toFixed(1)}%` : `${calculatedResponseRate}%`}
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
            emptyMessage="No message activity data available yet"
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
          <SentimentChart 
            sentimentData={sentimentData} 
            emptyMessage="No response sentiment data available yet"
          />
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
            emptyMessage="No sentiment trend data available yet"
          />
        </CardContent>
      </Card>
      
      {/* Time of Day Distribution */}
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
      
      {/* Day of Week Distribution */}
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
    </div>
  );
};
