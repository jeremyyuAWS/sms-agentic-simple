
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AnalyticsOverviewCardsProps {
  totalMessages: number;
  responseRate: string;
  positiveSentiment: string;
  useDemoData: boolean;
}

export const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({
  totalMessages,
  responseRate,
  positiveSentiment,
  useDemoData
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Message Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{useDemoData ? 245 : totalMessages}</div>
          <p className="text-xs text-muted-foreground">Total messages sent</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{responseRate}</div>
          <p className="text-xs text-muted-foreground">Of messages received a reply</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{positiveSentiment}</div>
          <p className="text-xs text-muted-foreground">Of responses were positive</p>
        </CardContent>
      </Card>
    </div>
  );
};
