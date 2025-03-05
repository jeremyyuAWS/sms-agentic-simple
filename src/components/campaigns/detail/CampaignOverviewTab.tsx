
import React from 'react';
import { Campaign } from '@/lib/types';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, User } from 'lucide-react';
import { StatusCard } from './StatusCard';

interface CampaignOverviewTabProps {
  campaign: Campaign;
  getTemplate: () => string;
  getContacts: () => string;
  onStatusChange: (campaignId: string, status: Campaign['status']) => void;
}

const formatDate = (date?: Date) => {
  if (!date) return 'Not scheduled';
  return format(new Date(date), 'MMM d, yyyy h:mm a');
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

export const CampaignOverviewTab: React.FC<CampaignOverviewTabProps> = ({
  campaign,
  getTemplate,
  getContacts,
  onStatusChange
}) => {
  return (
    <div className="space-y-6">
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
      
      <StatusCard campaign={campaign} onStatusChange={onStatusChange} />
    </div>
  );
};
