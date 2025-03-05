
import React, { useState, useEffect } from 'react';
import { Message } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
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
  // Initialize useDemoData to true for completed campaigns
  const [useDemoData, setUseDemoData] = useState(false);
  
  // Set useDemoData based on isCompleted or empty data
  useEffect(() => {
    setUseDemoData(isCompleted || campaignMessages.length === 0);
    console.log("Analytics Tab - isCompleted:", isCompleted);
    console.log("Analytics Tab - Setting useDemoData to:", isCompleted || campaignMessages.length === 0);
  }, [isCompleted, campaignMessages.length]);
  
  console.log("Analytics Tab - Current useDemoData:", useDemoData);
  console.log("Analytics Tab - Received data:", {
    timeOfDayData,
    dayOfWeekData,
    sentimentData,
    sentimentOverTimeData,
    messageActivityData
  });
  
  // Function to toggle demo data
  const handleSimulateData = () => {
    setUseDemoData(true);
    console.log("Manually setting useDemoData to true");
  };
  
  // Calculate totals based on data provided or messages
  const totalMessages = useDemoData && messageActivityData
    ? messageActivityData.reduce((sum, day) => sum + (Number(day.outbound) || 0), 0)
    : campaignMessages.filter(m => m.type === 'outbound').length;
  
  const totalResponses = useDemoData && messageActivityData
    ? messageActivityData.reduce((sum, day) => sum + (Number(day.inbound) || 0), 0)
    : campaignMessages.filter(m => m.type === 'inbound').length;
  
  const calculatedResponseRate = totalMessages > 0 
    ? ((totalResponses / totalMessages) * 100).toFixed(1)
    : '0.0';

  // Prepare data for charts - use provided data if available, otherwise generate
  const chartsTimeOfDayData = useDemoData ? (timeOfDayData || generateDemoTimeOfDay()) : timeOfDayData || [];
  const chartsDayOfWeekData = useDemoData ? (dayOfWeekData || generateDemoDayOfWeek()) : dayOfWeekData || [];
  const chartsSentimentData = useDemoData ? (sentimentData || [
    { name: 'Positive', value: 68 },
    { name: 'Neutral', value: 22 },
    { name: 'Negative', value: 10 }
  ]) : sentimentData || [];
  const chartsSentimentOverTimeData = useDemoData ? (sentimentOverTimeData || generateDemoSentimentOverTime()) : sentimentOverTimeData || [];
  const chartsMessageActivityData = useDemoData ? (messageActivityData || generateDemoMessageActivity()) : messageActivityData || [];

  // Format response rate and positive sentiment for display
  const displayResponseRate = useDemoData ? '42.5%' : (responseRate ? `${(responseRate * 100).toFixed(1)}%` : `${calculatedResponseRate}%`);
  const displayPositiveSentiment = useDemoData ? '68.4%' : (positiveSentimentPercentage ? `${positiveSentimentPercentage}%` : '0.0%');

  // Check if we should show the Simulate Data button - only for non-completed campaigns with little data
  const shouldShowSimulateButton = !useDemoData && campaignMessages.length < 5;

  return (
    <div className="space-y-8">
      {/* Simulate Data button - only shown for campaigns with no data and not completed */}
      {shouldShowSimulateButton && (
        <div className="flex justify-center mb-6">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleSimulateData}
            className="shadow-sm hover:shadow border border-dashed"
          >
            <Zap className="h-4 w-4 mr-2 text-amber-500" />
            Generate Simulated Analytics Data
          </Button>
        </div>
      )}
      
      {/* Top analytics overview cards */}
      <AnalyticsOverviewCards 
        totalMessages={totalMessages}
        responseRate={displayResponseRate}
        positiveSentiment={displayPositiveSentiment}
        useDemoData={useDemoData}
      />
      
      {/* Message Activity Over Time */}
      <MessageActivityChart 
        messageActivityData={chartsMessageActivityData}
        useDemoData={useDemoData}
      />
      
      {/* Response Sentiment and Sentiment Over Time */}
      <SentimentAnalysisCharts 
        sentimentData={chartsSentimentData}
        sentimentOverTimeData={chartsSentimentOverTimeData}
      />
      
      {/* Time of Day and Day of Week Distribution */}
      <TimeDistributionCharts 
        timeOfDayData={chartsTimeOfDayData}
        dayOfWeekData={chartsDayOfWeekData}
      />
    </div>
  );
};
