
import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { Campaign, Template, FollowUp, Contact, KnowledgeBase, TimeWindow } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { 
  Check, 
  Clock, 
  Edit, 
  Trash2, 
  RefreshCw, 
  CalendarClock, 
  BarChart3, 
  Calendar, 
  GlobeIcon 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import FollowUpFlowBuilder from './FollowUpFlowBuilder';
import CampaignAnalytics from './CampaignAnalytics';
import TimeWindowSelector from './TimeWindowSelector';
import TimeZoneSelector from './TimeZoneSelector';

interface CampaignDetailViewProps {
  campaign: Campaign;
  onClose: () => void;
  onStatusChange: (campaignId: string, status: Campaign['status']) => void;
}

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({
  campaign,
  onClose,
  onStatusChange
}) => {
  const { 
    templates, 
    contacts, 
    knowledgeBases, 
    updateFollowUp, 
    conversations 
  } = useApp();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [timeWindow, setTimeWindow] = useState<TimeWindow | undefined>(campaign.sendingWindow);
  const [timeZone, setTimeZone] = useState<string | undefined>(campaign.timeZone);
  
  // Get all messages related to this campaign
  const campaignMessages = conversations
    .flatMap(conv => conv.messages || [])
    .filter(msg => msg.campaignId === campaign.id);
  
  // Function to get template by ID
  const getTemplateById = (templateId: string): Template | undefined => {
    return templates.find(t => t.id === templateId);
  };

  // Function to get contact by ID
  const getContactById = (contactId: string): Contact | undefined => {
    return contacts.find(c => c.id === contactId);
  };

  // Function to get knowledge base by ID
  const getKnowledgeBaseById = (knowledgeBaseId: string): KnowledgeBase | undefined => {
    return knowledgeBases.find(kb => kb.id === knowledgeBaseId);
  };

  // Function to handle follow-up updates from flow builder
  const handleFollowUpsUpdate = (updatedFollowUps: FollowUp[]) => {
    // Update campaign's follow-ups in context
    campaign.followUps = updatedFollowUps;
    
    toast({
      title: "Follow-up Flow Updated",
      description: "Your campaign follow-up sequence has been updated."
    });
  };

  // Function to handle time window updates
  const handleTimeWindowUpdate = (newTimeWindow: TimeWindow | undefined) => {
    setTimeWindow(newTimeWindow);
    campaign.sendingWindow = newTimeWindow;
    
    toast({
      title: "Sending Window Updated",
      description: newTimeWindow 
        ? "Your campaign sending window has been updated." 
        : "Sending window has been removed. Messages will be sent at any time."
    });
  };

  // Function to handle time zone updates
  const handleTimeZoneUpdate = (newTimeZone: string) => {
    setTimeZone(newTimeZone);
    campaign.timeZone = newTimeZone;
    
    toast({
      title: "Time Zone Updated",
      description: `Your campaign time zone has been set to ${newTimeZone.replace('_', ' ')}.`
    });
  };

  // Function to get the color class based on campaign status
  const getStatusColorClass = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Function to get icon based on campaign status
  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4 mr-1" />;
      case 'active':
        return <Check className="h-4 w-4 mr-1" />;
      case 'paused':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'completed':
        return <Check className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{campaign.name}</h2>
          <p className="text-muted-foreground mt-1">
            {campaign.description || 'No description provided.'}
          </p>
        </div>
        <Badge variant="outline" className={getStatusColorClass(campaign.status)}>
          {getStatusIcon(campaign.status)}
          {campaign.status}
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-4"
      >
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="follow-ups">Follow-up Sequence</TabsTrigger>
          <TabsTrigger value="analytics">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="settings">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Timing</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Campaign Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Contacts</p>
                <p className="text-lg font-semibold">{campaign.contactCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Messages Sent</p>
                <p className="text-lg font-semibold">{campaign.messagesSent || 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Response Rate</p>
                <p className="text-lg font-semibold">
                  {campaign.responseRate ? `${campaign.responseRate}%` : 'N/A'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-lg font-semibold">
                  {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Initial Message */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Initial Message</h3>
            {campaign.templateId ? (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">
                      {getTemplateById(campaign.templateId)?.name || 'Unknown Template'}
                    </p>
                    <Badge variant="outline" className="bg-primary/10">Day 0</Badge>
                  </div>
                  <div className="text-sm bg-muted/30 p-3 rounded-md">
                    {getTemplateById(campaign.templateId)?.body ||
                      'Template content not available'}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center text-muted-foreground">
                  No initial message template selected.
                </CardContent>
              </Card>
            )}
          </div>

          {/* Timing & Schedule */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Timing & Schedule</h3>
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Start Date</p>
                    <div className="flex items-center">
                      <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm">
                        {campaign.scheduledStartDate
                          ? format(new Date(campaign.scheduledStartDate), 'PPP')
                          : 'Not scheduled'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Time Zone</p>
                    <div className="flex items-center">
                      <GlobeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm">
                        {campaign.timeZone ? campaign.timeZone.replace('_', ' ') : 'Default (Local)'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {campaign.sendingWindow && (
                  <div className="mt-3 border-t pt-3">
                    <p className="text-sm font-medium mb-1">Sending Window</p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm">
                        {campaign.sendingWindow.startTime} - {campaign.sendingWindow.endTime}
                        {campaign.sendingWindow.daysOfWeek.length > 0 && (
                          <span className="ml-2">
                            on{' '}
                            {campaign.sendingWindow.daysOfWeek
                              .map(day => 
                                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
                              )
                              .join(', ')}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="follow-ups" className="space-y-4">
          {campaign.templateId ? (
            <FollowUpFlowBuilder
              initialTemplateId={campaign.templateId}
              followUps={campaign.followUps || []}
              templates={templates}
              onUpdate={handleFollowUpsUpdate}
            />
          ) : (
            <Card className="bg-muted/30">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-3">
                  Please select an initial message template first.
                </p>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('overview')}>
                  Go to Overview
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <CampaignAnalytics 
            campaign={campaign}
            messages={campaignMessages}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6">
            {/* Time Zone */}
            <Card>
              <CardContent className="p-6">
                <TimeZoneSelector 
                  value={timeZone} 
                  onChange={handleTimeZoneUpdate}
                />
              </CardContent>
            </Card>
            
            {/* Sending Window */}
            <Card>
              <CardContent className="p-6">
                <TimeWindowSelector 
                  value={timeWindow}
                  onChange={handleTimeWindowUpdate}
                />
              </CardContent>
            </Card>
            
            {/* Date Selection (Future Enhancement) */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Campaign Schedule</h3>
                </div>
                
                <div className="bg-muted/20 rounded-md p-4 text-center text-muted-foreground">
                  <p className="mb-2">Date scheduling will be available in a future update.</p>
                  <p className="text-xs">This feature will allow you to set specific start and end dates for your campaign.</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Blackout Dates (Future Enhancement) */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Blackout Dates</h3>
                  </div>
                </div>
                
                <div className="bg-muted/20 rounded-md p-4 text-center text-muted-foreground">
                  <p className="mb-2">Blackout dates will be available in a future update.</p>
                  <p className="text-xs">This feature will allow you to exclude specific dates from your campaign sending schedule, such as holidays or weekends.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Target Contacts</h3>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm mb-3">
                  This campaign targets {campaign.contactCount} contacts.
                </p>
                {campaign.contactIds && campaign.contactIds.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {campaign.contactIds.slice(0, 20).map(contactId => {
                      const contact = getContactById(contactId);
                      return contact ? (
                        <div key={contactId} className="flex items-center p-2 border rounded-md">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                            {contact.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {contact.email || contact.phoneNumber}
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })}
                    {campaign.contactIds.length > 20 && (
                      <p className="text-sm text-center text-muted-foreground pt-2">
                        + {campaign.contactIds.length - 20} more contacts
                      </p>
                    )}
                  </div>
                ) : campaign.segmentId ? (
                  <div className="p-3 border rounded-md bg-muted/20">
                    <p className="font-medium">From Segment</p>
                    <p className="text-sm text-muted-foreground">
                      This campaign targets contacts from a saved segment.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This campaign targets all contacts that match the specified criteria.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t pt-4 flex justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Created: {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
            {campaign.status === 'active' && campaign.startedAt && (
              <> • Started: {format(new Date(campaign.startedAt), 'MMM d, yyyy')}</>
            )}
            {campaign.status === 'completed' && campaign.completedAt && (
              <> • Completed: {format(new Date(campaign.completedAt), 'MMM d, yyyy')}</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {campaign.status === 'draft' && (
            <Button
              onClick={() => onStatusChange(campaign.id, 'active')}
            >
              Activate Campaign
            </Button>
          )}
          {campaign.status === 'active' && (
            <Button 
              variant="outline"
              onClick={() => onStatusChange(campaign.id, 'paused')}
            >
              Pause Campaign
            </Button>
          )}
          {campaign.status === 'paused' && (
            <Button
              onClick={() => onStatusChange(campaign.id, 'active')}
            >
              Resume Campaign
            </Button>
          )}
          {(campaign.status === 'active' || campaign.status === 'paused') && (
            <Button 
              variant="outline"
              onClick={() => onStatusChange(campaign.id, 'completed')}
            >
              Mark as Completed
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailView;
