
import React from 'react';
import { Message } from '@/lib/types';
import { AnalyticsOverviewCards } from './AnalyticsOverviewCards';
import { MessageActivityChart } from './MessageActivityChart';
import { SentimentAnalysisCharts } from './SentimentAnalysisCharts';
import { TimeDistributionCharts } from './TimeDistributionCharts';
import { 
  generateDemoMessageActivity, 
  generateDemoSentimentOverTime, 
  generateDemoTimeOfDay, 
  generateDemoDayOfWeek 
} from './demoDataGenerators';

interface AnalyticsTabProps {
  campaignMessages: Message[];
  responseRate?: number;
  isCompleted?: boolean;
  campaignName?: string;
  timeOfDayData?: any[];
  dayOfWeekData?: any[];
  sentimentData?: any[];
  sentimentOverTimeData?: any[];
  messageActivityData?: any[];
  positiveSentimentPercentage?: string | number;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  campaignMessages,
  responseRate,
  isCompleted = false,
  campaignName = '',
  timeOfDayData,
  dayOfWeekData,
  sentimentData,
  sentimentOverTimeData,
  messageActivityData,
  positiveSentimentPercentage
}) => {
  // Always use demo data when showing analytics
  const useDemoData = true;
  
  // Calculate totals for demo or real data
  const totalMessages = useDemoData && messageActivityData
    ? messageActivityData.reduce((sum, day) => sum + (Number(day.outbound) || 0), 0)
    : campaignMessages.filter(m => m.type === 'outbound').length;
  
  const totalResponses = useDemoData && messageActivityData
    ? messageActivityData.reduce((sum, day) => sum + (Number(day.inbound) || 0), 0)
    : campaignMessages.filter(m => m.type === 'inbound').length;
  
  const calculatedResponseRate = totalMessages > 0 
    ? ((totalResponses / totalMessages) * 100).toFixed(1)
    : '0.0';

  // Prepare data for charts
  const demoMessageData = useDemoData ? generateDemoMessageActivity() : messageActivityData || [];
  const demoSentimentData = useDemoData ? [
    { name: 'Positive', value: 68 },
    { name: 'Neutral', value: 22 },
    { name: 'Negative', value: 10 }
  ] : sentimentData || [];
  const demoSentimentOverTimeData = useDemoData ? generateDemoSentimentOverTime() : sentimentOverTimeData || [];
  const demoTimeOfDayData = useDemoData ? generateDemoTimeOfDay() : timeOfDayData || [];
  const demoDayOfWeekData = useDemoData ? generateDemoDayOfWeek() : dayOfWeekData || [];

  // Format response rate and positive sentiment for display
  const displayResponseRate = useDemoData ? '42.5%' : (responseRate ? `${(responseRate * 100).toFixed(1)}%` : `${calculatedResponseRate}%`);
  const displayPositiveSentiment = useDemoData ? '68.4%' : (positiveSentimentPercentage ? `${positiveSentimentPercentage}%` : '0.0%');

  return (
    <div className="space-y-8">
      {/* Top analytics overview cards */}
      <AnalyticsOverviewCards 
        totalMessages={totalMessages}
        responseRate={displayResponseRate}
        positiveSentiment={displayPositiveSentiment}
        useDemoData={useDemoData}
      />
      
      {/* Message Activity Over Time */}
      <MessageActivityChart 
        messageActivityData={demoMessageData}
        useDemoData={useDemoData}
      />
      
      {/* Response Sentiment and Sentiment Over Time */}
      <SentimentAnalysisCharts 
        sentimentData={demoSentimentData}
        sentimentOverTimeData={demoSentimentOverTimeData}
      />
      
      {/* Time of Day and Day of Week Distribution */}
      <TimeDistributionCharts 
        timeOfDayData={demoTimeOfDayData}
        dayOfWeekData={demoDayOfWeekData}
      />
    </div>
  );
};
