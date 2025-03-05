import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Campaign } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, CheckCircle, Clock, Edit, MoreVertical, PauseCircle, PlayCircle, User } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from '@/components/ui/separator';
import CampaignAnalytics from './CampaignAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface CampaignDetailViewProps {
  campaign: Campaign;
  onClose: () => void;
  onStatusChange: (campaignId: string, status: Campaign['status']) => void;
  onEdit: (campaignId: string) => void;
}

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({
  campaign,
  onClose,
  onStatusChange,
  onEdit
}) => {
  const { contacts, templates, contactLists, messages } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get campaign-specific messages for analytics
  const campaignMessages = messages.filter(m => m.campaignId === campaign.id);
  
  // Generate time of day data
  const timeOfDayData = generateTimeOfDayData(campaignMessages);
  
  // Generate day of week data
  const dayOfWeekData = generateDayOfWeekData(campaignMessages);
  
  // Generate sentiment data
  const sentimentData = generateSentimentData(campaignMessages);
  
  // Generate sentiment over time data
  const sentimentOverTimeData = generateSentimentOverTimeData(campaignMessages);
  
  // Generate message activity data
  const messageActivityData = generateMessageActivityData(campaignMessages);
  
  const handleStatusChange = (status: Campaign['status']) => {
    onStatusChange(campaign.id, status);
  };
  
  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'draft':
        return <Badge className="bg-amber-500">Draft</Badge>;
      case 'paused':
        return <Badge className="bg-gray-500">Paused</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      default:
        return null;
    }
  };
  
  const getTemplate = () => {
    if (!campaign.templateId) return 'No template selected';
    const template = templates.find(t => t.id === campaign.templateId);
    return template ? template.name : 'Unknown template';
  };
  
  const getContacts = () => {
    if (campaign.contactIds && campaign.contactIds.length > 0) {
      return `${campaign.contactIds.length} individual contacts`;
    } else if (campaign.contactListId) {
      const list = contactLists.find(l => l.id === campaign.contactListId);
      return list ? `List: ${list.name} (${list.contactIds.length} contacts)` : 'Unknown list';
    } else if (campaign.segmentId) {
      return `Segment: ${campaign.segmentId}`;
    }
    return 'No contacts selected';
  };
  
  const formatDate = (date?: Date) => {
    if (!date) return 'Not scheduled';
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">{campaign.name}</CardTitle>
              {getStatusBadge(campaign.status)}
            </div>
            <CardDescription className="mt-2">{campaign.description || 'No description provided'}</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(campaign.id)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {campaign.status === 'active' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('paused')}>
                    <PauseCircle className="h-4 w-4 mr-2" />
                    Pause Campaign
                  </DropdownMenuItem>
                )}
                
                {campaign.status === 'paused' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Resume Campaign
                  </DropdownMenuItem>
                )}
                
                {campaign.status === 'draft' && (
                  <DropdownMenuItem onClick={() => handleStatusChange('active')}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Campaign
                  </DropdownMenuItem>
                )}
                
                {(campaign.status === 'active' || campaign.status === 'paused') && (
                  <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Campaign
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="followups">Follow-ups</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                      Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Start Date:</dt>
                        <dd className="font-medium">{formatDate(campaign.scheduledStartDate)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Status:</dt>
                        <dd>{getStatusBadge(campaign.status)}</dd>
                      </div>
                      {campaign.startedAt && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Started:</dt>
                          <dd className="font-medium">{formatDate(campaign.startedAt)}</dd>
                        </div>
                      )}
                      {campaign.completedAt && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Completed:</dt>
                          <dd className="font-medium">{formatDate(campaign.completedAt)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Time Zone:</dt>
                        <dd className="font-medium">{campaign.timeZone || 'Default'}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      Audience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Recipients:</dt>
                        <dd className="font-medium">{getContacts()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Template:</dt>
                        <dd className="font-medium">{getTemplate()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Follow-ups:</dt>
                        <dd className="font-medium">{campaign.followUps?.length || 0} configured</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
              
              {campaign.status === 'active' && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800">Campaign Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-blue-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Campaign is running</span>
                      </div>
                      <Button size="sm" variant="outline" 
                              className="bg-white border-blue-300 text-blue-700 hover:bg-blue-100"
                              onClick={() => handleStatusChange('paused')}>
                        Pause Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {campaign.status === 'draft' && (
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-amber-800">Campaign Draft</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-amber-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Campaign is in draft mode</span>
                      </div>
                      <Button size="sm" 
                              className="bg-amber-500 hover:bg-amber-600 text-white"
                              onClick={() => handleStatusChange('active')}>
                        Start Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {campaign.status === 'paused' && (
                <Card className="bg-gray-100 border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-800">Campaign Paused</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <PauseCircle className="h-4 w-4 mr-2" />
                        <span>Campaign is currently paused</span>
                      </div>
                      <Button size="sm" 
                              className="bg-gray-600 hover:bg-gray-700 text-white"
                              onClick={() => handleStatusChange('active')}>
                        Resume Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {campaign.status === 'completed' && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-800">Campaign Completed</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-green-700">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Campaign has been completed</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="analytics">
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
                        {campaign.responseRate 
                          ? `${(campaign.responseRate * 100).toFixed(1)}%` 
                          : '0.0%'}
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
                        {calculatePositiveSentimentPercentage(campaignMessages)}%
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
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeOfDayData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" name="Messages" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
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
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dayOfWeekData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#82ca9d" name="Messages" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
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
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sentimentData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {sentimentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getSentimentColor(entry.name)} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
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
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sentimentOverTimeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="positive" 
                            stroke="#4ade80" 
                            strokeWidth={2} 
                            dot={{ r: 4 }}
                            name="Positive"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="neutral" 
                            stroke="#a1a1aa" 
                            strokeWidth={2} 
                            dot={{ r: 4 }}
                            name="Neutral"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="negative" 
                            stroke="#f87171" 
                            strokeWidth={2} 
                            dot={{ r: 4 }}
                            name="Negative"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
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
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={messageActivityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="outbound" 
                            stroke="#8884d8" 
                            strokeWidth={2} 
                            dot={{ r: 4 }}
                            name="Outbound"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="inbound" 
                            stroke="#82ca9d" 
                            strokeWidth={2} 
                            dot={{ r: 4 }}
                            name="Inbound"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campaign Contacts</CardTitle>
                  <CardDescription>
                    {getContacts()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Contact list would go here */}
                  <p className="text-muted-foreground">Contact list details...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="followups">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Follow-up Messages</CardTitle>
                  <CardDescription>
                    {campaign.followUps && campaign.followUps.length > 0 
                      ? `${campaign.followUps.length} follow-ups configured` 
                      : 'No follow-ups configured'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {campaign.followUps && campaign.followUps.length > 0 ? (
                    <div className="space-y-4">
                      {campaign.followUps.map((followUp, index) => (
                        <div key={followUp.id} className="p-4 border rounded">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Follow-up {index + 1}</div>
                            <Badge variant="outline">
                              {followUp.delayDays} days after
                            </Badge>
                          </div>
                          <Separator className="my-2" />
                          <div className="text-sm text-muted-foreground">
                            {followUp.condition === 'no-response' 
                              ? 'Sent only if no response received' 
                              : 'Sent to all contacts'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No follow-up messages configured for this campaign.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <Button variant="outline" onClick={onClose}>
            Back to Campaigns
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Analytics data generation functions
function generateTimeOfDayData(messages: any[]) {
  const hourCounts = Array(24).fill(0).map((_, i) => ({ hour: i.toString().padStart(2, '0'), count: 0 }));
  
  messages.forEach(message => {
    if (message.sentAt) {
      const hour = new Date(message.sentAt).getHours();
      hourCounts[hour].count += 1;
    }
  });
  
  return hourCounts;
}

function generateDayOfWeekData(messages: any[]) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = days.map(day => ({ day, count: 0 }));
  
  messages.forEach(message => {
    if (message.sentAt) {
      const dayOfWeek = new Date(message.sentAt).getDay();
      dayCounts[dayOfWeek].count += 1;
    }
  });
  
  return dayCounts;
}

function generateSentimentData(messages: any[]) {
  let positive = 0;
  let neutral = 0;
  let negative = 0;
  
  messages.forEach(message => {
    if (message.type === 'inbound' && message.responseType) {
      if (message.responseType === 'positive') positive++;
      else if (message.responseType === 'negative') negative++;
      else neutral++;
    }
  });
  
  return [
    { name: 'Positive', value: positive },
    { name: 'Neutral', value: neutral },
    { name: 'Negative', value: negative }
  ];
}

function generateSentimentOverTimeData(messages: any[]) {
  if (messages.length === 0) return [];
  
  // Sort messages by date
  const sortedMessages = [...messages].filter(m => m.type === 'inbound' && m.responseType)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  
  if (sortedMessages.length === 0) return [];
  
  // Group by date (using day-level granularity)
  const dataByDate: Record<string, { date: string, positive: number, neutral: number, negative: number }> = {};
  
  sortedMessages.forEach(message => {
    const date = new Date(message.sentAt);
    const dateStr = format(date, 'MMM d');
    
    if (!dataByDate[dateStr]) {
      dataByDate[dateStr] = { date: dateStr, positive: 0, neutral: 0, negative: 0 };
    }
    
    if (message.responseType === 'positive') dataByDate[dateStr].positive++;
    else if (message.responseType === 'negative') dataByDate[dateStr].negative++;
    else dataByDate[dateStr].neutral++;
  });
  
  return Object.values(dataByDate);
}

function generateMessageActivityData(messages: any[]) {
  if (messages.length === 0) return [];
  
  // Sort messages by date
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );
  
  // Group by date (using day-level granularity)
  const dataByDate: Record<string, { date: string, outbound: number, inbound: number }> = {};
  
  sortedMessages.forEach(message => {
    const date = new Date(message.sentAt);
    const dateStr = format(date, 'MMM d');
    
    if (!dataByDate[dateStr]) {
      dataByDate[dateStr] = { date: dateStr, outbound: 0, inbound: 0 };
    }
    
    if (message.type === 'outbound') dataByDate[dateStr].outbound++;
    else dataByDate[dateStr].inbound++;
  });
  
  return Object.values(dataByDate);
}

function calculatePositiveSentimentPercentage(messages: any[]) {
  const inboundMessages = messages.filter(m => m.type === 'inbound' && m.responseType);
  if (inboundMessages.length === 0) return '0.0';
  
  const positiveCount = inboundMessages.filter(m => m.responseType === 'positive').length;
  return ((positiveCount / inboundMessages.length) * 100).toFixed(1);
}

function getSentimentColor(sentiment: string) {
  switch (sentiment) {
    case 'Positive': return '#4ade80'; // green
    case 'Neutral': return '#a1a1aa';  // gray
    case 'Negative': return '#f87171'; // red
    default: return '#8884d8';         // default purple
  }
}

export default CampaignDetailView;
