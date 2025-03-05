
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Campaign, Message } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, subDays, differenceInDays, isWithinInterval, parseISO, addDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, ThumbsUp, ThumbsDown, BarChart3, PieChartIcon, ArrowLeft, Zap, Brain, Sparkles, PenSquare, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CampaignAnalyticsProps {
  campaign: Campaign;
  messages?: Message[];
  onBack?: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const RESPONSE_COLORS = {
  positive: '#16a34a',
  negative: '#dc2626',
  neutral: '#6b7280',
};

// AI-powered insights component
const AIInsights = ({ campaign }: { campaign: Campaign }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);

  const generateInsights = () => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      setInsights([
        "Response rates are 32% higher when messages are sent between 10am-11am in recipient's local time.",
        "Your follow-up #2 has a 45% higher response rate than industry average.",
        "Contacts in the Tech Industry segment respond 27% more frequently than other segments.",
        "Messages with 2-3 questions have 38% higher engagement than those with none.",
        "Adding personalized company information increases response rates by 41%."
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card className="mt-6 border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <span>AI-Powered Insights</span>
          <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 border-purple-200">BETA</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-6 space-y-4">
            <p className="text-muted-foreground">Get AI-powered insights based on your campaign performance and industry benchmarks.</p>
            <Button 
              onClick={generateInsights}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Campaign Data...
                </div>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Insights
                </div>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {insights.map((insight, index) => (
                <div key={index} className="p-3 bg-purple-50 border border-purple-100 rounded-md">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Zap className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-sm">{insight}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setInsights([])}>
                Reset
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// AI-powered optimization suggestions component
const AIOptimizations = ({ campaign }: { campaign: Campaign }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [optimizations, setOptimizations] = useState<Array<{title: string, description: string, impact: string}>>([]);

  const generateOptimizations = () => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      setOptimizations([
        {
          title: "Adjust sending time to 10:30 AM",
          description: "Based on your audience's engagement patterns, shifting your sending window to mid-morning could increase open rates by 23%.",
          impact: "High Impact"
        },
        {
          title: "Personalize subject lines with company name",
          description: "Adding the recipient's company name to subject lines has shown a 31% increase in open rates for similar campaigns.",
          impact: "Medium Impact"
        },
        {
          title: "Increase follow-up frequency for Tech segment",
          description: "Tech industry contacts in your audience respond well to more frequent follow-ups (every 2-3 days vs. your current 5 days).",
          impact: "High Impact"
        },
        {
          title: "Simplify message content",
          description: "Your messages average 127 words. Reducing to 80-100 words could improve response rates by 18% based on similar campaigns.",
          impact: "Medium Impact"
        }
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card className="mt-6 border-green-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <PenSquare className="h-5 w-5 text-green-500" />
          <span>AI-Suggested Optimizations</span>
          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">BETA</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {optimizations.length === 0 ? (
          <div className="text-center py-6 space-y-4">
            <p className="text-muted-foreground">Get AI-powered optimization suggestions to improve your campaign performance.</p>
            <Button 
              onClick={generateOptimizations}
              className="bg-green-600 hover:bg-green-700"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Campaign...
                </div>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Optimization Suggestions
                </div>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="divide-y">
              {optimizations.map((opt, index) => (
                <div key={index} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{opt.title}</h4>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${opt.impact === 'High Impact' ? 'bg-green-50 text-green-700 border-green-200' : 
                          opt.impact === 'Medium Impact' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                          'bg-blue-50 text-blue-700 border-blue-200'}
                      `}
                    >
                      {opt.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{opt.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setOptimizations([])}>
                Reset
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Apply All Suggestions
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({ campaign, messages = [], onBack }) => {
  const startDate = campaign.startedAt ? new Date(campaign.startedAt) : new Date();
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState<'7days' | '14days' | '30days' | 'all'>('14days');

  // Calculate time ranges for filtering
  const endDate = campaign.completedAt || new Date();
  const campaignDuration = differenceInDays(endDate, startDate) + 1;
  
  // Memoize filtered messages to avoid recalculation on each render
  const filteredMessages = useMemo(() => {
    let daysToInclude: number;
    
    switch(timeRange) {
      case '7days':
        daysToInclude = 7;
        break;
      case '14days':
        daysToInclude = 14;
        break;
      case '30days':
        daysToInclude = 30;
        break;
      default: // 'all'
        daysToInclude = campaignDuration;
    }
    
    // For completed campaigns, calculate the range based on actual campaign dates
    const rangeStartDate = campaign.status === 'completed'
      ? new Date(Math.max(startDate.getTime(), endDate.getTime() - (daysToInclude * 24 * 60 * 60 * 1000)))
      : subDays(new Date(), daysToInclude - 1);
      
    return messages.filter(msg => {
      const msgDate = new Date(msg.sentAt);
      return msgDate >= rangeStartDate && msgDate <= endDate;
    });
  }, [messages, timeRange, startDate, endDate, campaignDuration, campaign.status]);
  
  // Generate daily message activity data
  const dailyData = useMemo(() => {
    // Determine how many days to show in the chart
    let daysToShow: number;
    switch(timeRange) {
      case '7days':
        daysToShow = 7;
        break;
      case '14days':
        daysToShow = 14;
        break;
      case '30days':
        daysToShow = 30;
        break;
      default: // 'all'
        daysToShow = Math.min(60, campaignDuration); // Cap at 60 days max for readability
    }
    
    // For completed campaigns, use actual campaign duration
    const isCompleted = campaign.status === 'completed';
    const chartStartDate = isCompleted
      ? new Date(Math.max(startDate.getTime(), endDate.getTime() - (daysToShow * 24 * 60 * 60 * 1000)))
      : subDays(new Date(), daysToShow - 1);
    
    // Create array of dates to ensure all dates are represented
    const result = Array.from({ length: daysToShow }).map((_, index) => {
      const date = new Date(chartStartDate);
      date.setDate(date.getDate() + index);
      const formattedDate = format(date, 'MMM d');
      
      // Count messages for this day
      const messagesOnDay = filteredMessages.filter(msg => {
        const msgDate = new Date(msg.sentAt);
        return format(msgDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      });
      
      const messagesSent = messagesOnDay.filter(msg => msg.type === 'outbound').length;
      const messagesReceived = messagesOnDay.filter(msg => msg.type === 'inbound').length;
      
      return {
        date: formattedDate,
        fullDate: format(date, 'yyyy-MM-dd'),
        sent: messagesSent,
        received: messagesReceived,
        responseRate: messagesSent > 0 ? (messagesReceived / messagesSent) * 100 : 0
      };
    });
    
    return result;
  }, [filteredMessages, timeRange, campaignDuration, startDate, endDate, campaign.status]);

  // Response type distribution with enhanced data for completed campaigns
  const responseTypeData = useMemo(() => {
    const responseTypes = filteredMessages
      .filter(msg => msg.type === 'inbound' && msg.responseType)
      .reduce((acc, msg) => {
        const type = msg.responseType || 'neutral';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    // Make sure all types are represented
    const result = [
      { name: 'Positive', value: responseTypes.positive || 0 },
      { name: 'Negative', value: responseTypes.negative || 0 },
      { name: 'Neutral', value: responseTypes.neutral || 0 }
    ];
    
    // Sort by value
    return result.sort((a, b) => b.value - a.value);
  }, [filteredMessages]);
  
  // Daily response sentiment over time
  const dailySentimentData = useMemo(() => {
    return dailyData.map(day => {
      const dayMessages = filteredMessages.filter(msg => {
        const msgDate = new Date(msg.sentAt);
        return format(msgDate, 'yyyy-MM-dd') === day.fullDate;
      });
      
      const inboundMessages = dayMessages.filter(msg => msg.type === 'inbound');
      const positiveCount = inboundMessages.filter(msg => msg.responseType === 'positive').length;
      const negativeCount = inboundMessages.filter(msg => msg.responseType === 'negative').length;
      const neutralCount = inboundMessages.filter(msg => msg.responseType === 'neutral').length;
      
      return {
        date: day.date,
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount,
        total: inboundMessages.length
      };
    });
  }, [dailyData, filteredMessages]);
  
  // Hour of day effectiveness
  const hourlyData = useMemo(() => {
    const hourCounts = Array(24).fill(0).map(() => ({ 
      hour: 0, 
      sent: 0, 
      received: 0, 
      rate: 0,
      positive: 0,
      negative: 0,
      neutral: 0
    }));
    
    filteredMessages.forEach(msg => {
      const msgDate = new Date(msg.sentAt);
      const hour = msgDate.getHours();
      
      if (msg.type === 'outbound') {
        hourCounts[hour].sent++;
      } else {
        hourCounts[hour].received++;
        
        // Add sentiment data
        if (msg.responseType === 'positive') {
          hourCounts[hour].positive++;
        } else if (msg.responseType === 'negative') {
          hourCounts[hour].negative++;
        } else {
          hourCounts[hour].neutral++;
        }
      }
    });
    
    // Calculate response rates and format for display
    return hourCounts.map((data, index) => {
      const hourLabel = `${index.toString().padStart(2, '0')}:00`;
      return {
        hour: hourLabel,
        sent: data.sent,
        received: data.received,
        rate: data.sent > 0 ? (data.received / data.sent) * 100 : 0,
        positive: data.positive,
        negative: data.negative,
        neutral: data.neutral
      };
    });
  }, [filteredMessages]);
  
  // Group hourly data into time blocks for better visualization
  const timeOfDayData = useMemo(() => {
    const timeBlocks = [
      { name: 'Early Morning (5-8)', hours: [5, 6, 7, 8] },
      { name: 'Morning (9-11)', hours: [9, 10, 11] },
      { name: 'Midday (12-14)', hours: [12, 13, 14] },
      { name: 'Afternoon (15-17)', hours: [15, 16, 17] },
      { name: 'Evening (18-20)', hours: [18, 19, 20] },
      { name: 'Night (21-4)', hours: [21, 22, 23, 0, 1, 2, 3, 4] }
    ];
    
    return timeBlocks.map(block => {
      const relevantHours = block.hours.map(h => hourlyData[h]);
      const sent = relevantHours.reduce((sum, h) => sum + h.sent, 0);
      const received = relevantHours.reduce((sum, h) => sum + h.received, 0);
      const positive = relevantHours.reduce((sum, h) => sum + h.positive, 0);
      const negative = relevantHours.reduce((sum, h) => sum + h.negative, 0);
      const neutral = relevantHours.reduce((sum, h) => sum + h.neutral, 0);
      
      return {
        time: block.name,
        sent,
        received,
        rate: sent > 0 ? (received / sent) * 100 : 0,
        positive,
        negative,
        neutral
      };
    });
  }, [hourlyData]);
  
  // Follow-up effectiveness
  const followUpEffectiveness = useMemo(() => {
    return campaign.followUps?.map((followUp, index) => {
      // In a real app, you would calculate this based on actual data
      // Here we'll simulate data based on the filtered messages
      const followUpName = followUp.name || `Follow-up ${index + 1}`;
      
      // Simulate sent count and responses for this follow-up
      const sentCount = Math.floor(Math.random() * filteredMessages.length * 0.4) + 5;
      const responseCount = Math.floor(Math.random() * sentCount * 0.6);
      const positiveCount = Math.floor(responseCount * (Math.random() * 0.4 + 0.3)); // 30-70% positive
      const negativeCount = Math.floor(responseCount * (Math.random() * 0.2 + 0.1)); // 10-30% negative
      const neutralCount = responseCount - positiveCount - negativeCount;
      
      return {
        name: followUpName,
        sent: sentCount,
        responses: responseCount,
        rate: sentCount > 0 ? (responseCount / sentCount) * 100 : 0,
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount
      };
    }) || [];
  }, [campaign.followUps, filteredMessages.length]);
  
  // Day of week effectiveness
  const dayOfWeekData = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts = days.map(day => ({ 
      day, 
      sent: 0, 
      received: 0, 
      rate: 0,
      positive: 0,
      negative: 0,
      neutral: 0
    }));
    
    filteredMessages.forEach(msg => {
      const msgDate = new Date(msg.sentAt);
      const dayIndex = msgDate.getDay();
      
      if (msg.type === 'outbound') {
        dayCounts[dayIndex].sent++;
      } else {
        dayCounts[dayIndex].received++;
        
        // Add sentiment data
        if (msg.responseType === 'positive') {
          dayCounts[dayIndex].positive++;
        } else if (msg.responseType === 'negative') {
          dayCounts[dayIndex].negative++;
        } else {
          dayCounts[dayIndex].neutral++;
        }
      }
    });
    
    // Calculate response rates
    return dayCounts.map(data => ({
      ...data,
      rate: data.sent > 0 ? (data.received / data.sent) * 100 : 0
    }));
  }, [filteredMessages]);

  // Calculate overall stats
  const totalSent = filteredMessages.filter(msg => msg.type === 'outbound').length;
  const totalResponses = filteredMessages.filter(msg => msg.type === 'inbound').length;
  const overallResponseRate = totalSent > 0 ? (totalResponses / totalSent) * 100 : 0;
  const positiveResponses = filteredMessages.filter(msg => msg.type === 'inbound' && msg.responseType === 'positive').length;
  const negativeResponses = filteredMessages.filter(msg => msg.type === 'inbound' && msg.responseType === 'negative').length;
  const neutralResponses = filteredMessages.filter(msg => msg.type === 'inbound' && msg.responseType === 'neutral').length;
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
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="overview">Campaign Overview</TabsTrigger>
          <TabsTrigger value="ai-insights">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Insights</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{campaign.name} Analytics</h2>
            <div className="flex gap-2">
              <Button 
                variant={timeRange === '7days' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('7days')}
              >
                7 Days
              </Button>
              <Button 
                variant={timeRange === '14days' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('14days')}
              >
                14 Days
              </Button>
              <Button 
                variant={timeRange === '30days' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('30days')}
              >
                30 Days
              </Button>
              <Button 
                variant={timeRange === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('all')}
              >
                All Time
              </Button>
            </div>
          </div>
          
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
                  {responseTypeData.length > 0 && responseTypeData.some(item => item.value > 0) ? (
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
                    <span className="text-sm">Positive ({positiveResponses})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span className="text-sm">Negative ({negativeResponses})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm">Neutral ({neutralResponses})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Sentiment Over Time */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Sentiment Over Time</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {dailySentimentData.some(day => day.total > 0) ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={dailySentimentData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          interval={Math.ceil(dailySentimentData.length / 10)} // Show fewer labels on x-axis for better readability
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="positive" name="Positive" stroke="#16a34a" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="negative" name="Negative" stroke="#dc2626" />
                        <Line type="monotone" dataKey="neutral" name="Neutral" stroke="#6b7280" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No sentiment data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Effectiveness */}
            <Card className="col-span-1 lg:col-span-2">
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
            <Card>
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
                      <Bar yAxisId="left" dataKey="received" name="Responses" fill="#16a34a" />
                      <Bar yAxisId="right" dataKey="rate" name="Response Rate %" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Day of Week Analysis */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>Day of Week Analysis</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dayOfWeekData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" unit="%" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="sent" name="Sent" fill="#9333ea" />
                      <Bar yAxisId="left" dataKey="positive" name="Positive" fill="#16a34a" />
                      <Bar yAxisId="left" dataKey="negative" name="Negative" fill="#dc2626" />
                      <Bar yAxisId="right" dataKey="rate" name="Response Rate" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ai-insights" className="mt-0 space-y-6">
          <AIInsights campaign={campaign} />
          <AIOptimizations campaign={campaign} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignAnalytics;
