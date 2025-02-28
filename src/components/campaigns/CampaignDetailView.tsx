
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

interface CampaignDetailViewProps {
  campaign: Campaign;
  onClose: () => void;
  onStatusChange: (campaignId: string, status: Campaign['status']) => void;
  onEdit: (campaignId: string) => void;
  // onDelete prop removed as it's not in the interface
}

const CampaignDetailView: React.FC<CampaignDetailViewProps> = ({
  campaign,
  onClose,
  onStatusChange,
  onEdit
}) => {
  const { contacts, templates, contactLists } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  
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
                
                {/* We'd normally have a delete option here, but it's been removed since onDelete isn't in the interface */}
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
              <CampaignAnalytics campaign={campaign} />
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

export default CampaignDetailView;
