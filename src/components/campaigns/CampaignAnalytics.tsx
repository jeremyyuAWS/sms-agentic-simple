
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Campaign, Message } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, ThumbsUp, ThumbsDown, BarChart3, PieChart as PieChartIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CampaignAnalyticsProps {
  campaign: Campaign;
  messages?: Message[];
  onBack?: () => void; // Add the onBack prop to fix the error
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const RESPONSE_COLORS = {
  positive: '#16a34a',
  negative: '#dc2626',
  neutral: '#6b7280',
};

const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ campaign, messages = [], onBack }) => {
  const startDate = campaign.startedAt ? new Date(campaign.startedAt) : new Date();

  // Calculate days since campaign started
  const daysSinceStart = campaign.startedAt 
    ? differenceInDays(new Date(), new Date(campaign.startedAt))
    : 0;
  
  // Generate daily data for the past 14 days or since campaign start
  const dailyData = Array.from({ length: Math.min(14, daysSinceStart + 1) }).map((_, i) => {
    const date = subDays(new Date(), i);
    const formattedDate = format(date, 'MMM d');
    
    // Count messages for this day
    const messagesOnDay = messages.filter(msg => {
      const msgDate = new Date(msg.sentAt);
      return format(msgDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
    
    const messagesSent = messagesOnDay.filter(msg => msg.type === 'outbound').length;
    const messagesReceived = messagesOnDay.filter(msg => msg.type === 'inbound').length;
    
    return {
      date: formattedDate,
      sent: messagesSent,
      received: messagesReceived,
      responseRate: messagesSent > 0 ? (messagesReceived / messagesSent) * 100 : 0
    };
  }).reverse();

  // Response type distribution
  const responseTypes = messages
    .filter(msg => msg.type === 'inbound' && msg.responseType)
    .reduce((acc, msg) => {
      const type = msg.responseType || 'neutral';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  const responseTypeData = Object.entries(responseTypes).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Follow-up effectiveness
  const followUpEffectiveness = campaign.followUps?.map((followUp, index) => {
    // In a real app, you would calculate this based on actual data
    // For now, we'll simulate some data
    const sentCount = Math.floor(Math.random() * 50) + 10;
    const responseCount = Math.floor(Math.random() * sentCount);
    const responseRate = sentCount > 0 ? (responseCount / sentCount) * 100 : 0;
    
    return {
      name: `Follow-up ${index + 1}`,
      sent: sentCount,
      responses: responseCount,
      rate: responseRate.toFixed(1)
    };
  }) || [];

  // Time of day effectiveness (mock data - in a real app, this would come from actual message timestamps)
  const timeOfDayData = [
    { time: 'Morning (6-10)', sent: 45, responses: 18, rate: 40 },
    { time: 'Midday (10-14)', sent: 67, responses: 32, rate: 48 },
    { time: 'Afternoon (14-18)', sent: 52, responses: 21, rate: 40 },
    { time: 'Evening (18-22)', sent: 38, responses: 19, rate: 50 },
    { time: 'Night (22-6)', sent: 12, responses: 3, rate: 25 },
  ];

  // Calculate overall stats
  const totalSent = messages.filter(msg => msg.type === 'outbound').length;
  const totalResponses = messages.filter(msg => msg.type === 'inbound').length;
  const overallResponseRate = totalSent > 0 ? (totalResponses / totalSent) * 100 : 0;
  const positiveResponses = messages.filter(msg => msg.type === 'inbound' && msg.responseType === 'positive').length;
  const positiveRate = totalResponses > 0 ? (positiveResponses / totalResponses) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Add a back button if onBack is provided */}
      {onBack && (
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaign
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">Messages Sent</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{totalSent}</p>
                {campaign.messagesSent !== undefined && campaign.messagesSent !== totalSent && (
                  <Badge variant="outline" className="bg-yellow-100">Tracking {totalSent - (campaign.messagesSent || 0)} New</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">Responses Received</p>
              <p className="text-2xl font-bold">{totalResponses}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">Response Rate</p>
              <p className="text-2xl font-bold">{overallResponseRate.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">Positive Response Rate</p>
              <p className="text-2xl font-bold">{positiveRate.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Activity */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Message Activity</span>
                </div>
              </CardTitle>
              <Badge variant="outline">{dailyData.length} Days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sent" name="Messages Sent" fill="#9333ea" />
                  <Bar yAxisId="left" dataKey="received" name="Responses" fill="#16a34a" />
                  <Bar yAxisId="right" dataKey="responseRate" name="Response Rate %" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Response Type Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                <span>Response Sentiment</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              {responseTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={responseTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {responseTypeData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.name.toLowerCase() === 'positive' ? RESPONSE_COLORS.positive :
                            entry.name.toLowerCase() === 'negative' ? RESPONSE_COLORS.negative :
                            RESPONSE_COLORS.neutral
                          } 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground">
                  No response data available
                </div>
              )}
            </div>
            <div className="flex justify-center items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-sm">Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span className="text-sm">Negative</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-sm">Neutral</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Follow-up Effectiveness */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <span>Follow-up Effectiveness</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {followUpEffectiveness.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={followUpEffectiveness}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" unit="%" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sent" name="Sent" fill="#6366f1" />
                    <Bar yAxisId="left" dataKey="responses" name="Responses" fill="#10b981" />
                    <Bar yAxisId="right" dataKey="rate" name="Response Rate" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No follow-ups configured yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Time of Day Effectiveness */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Time of Day Effectiveness</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeOfDayData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" unit="%" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sent" name="Messages Sent" fill="#9333ea" />
                  <Bar yAxisId="left" dataKey="responses" name="Responses" fill="#16a34a" />
                  <Bar yAxisId="right" dataKey="rate" name="Response Rate %" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignAnalytics;
