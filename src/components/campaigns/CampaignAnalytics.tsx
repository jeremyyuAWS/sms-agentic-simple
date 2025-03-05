
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Campaign, Message } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, differenceInDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Clock, MessageSquare, ThumbsUp, ThumbsDown, BarChart3, PieChartIcon, ArrowLeft, Zap, Brain, Sparkles, PenSquare } from 'lucide-react';
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
