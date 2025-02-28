
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarClock, CheckCircle2, Clock, Mail, MessageSquare, MessageSquareDashed, Users } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { CampaignType } from './CampaignTypeSelector';

interface CampaignReviewProps {
  campaignType: CampaignType | null;
  contactCount: number;
  listName?: string;
  messagePreview: string;
  followUpPreview: string;
  scheduledDate?: Date;
  timeWindow: { start: string; end: string };
  avoidWeekends: boolean;
  followUpDelay: number;
}

const CampaignReview: React.FC<CampaignReviewProps> = ({
  campaignType,
  contactCount,
  listName,
  messagePreview,
  followUpPreview,
  scheduledDate,
  timeWindow,
  avoidWeekends,
  followUpDelay
}) => {
  // Helper function to get human-readable label for campaign type
  const getCampaignTypeLabel = (type: CampaignType | null): string => {
    switch (type) {
      case 'event-invitation': return 'Event Invitation';
      case 'sales-outreach': return 'Sales Outreach';
      case 'follow-up-reminder': return 'Follow-Up Reminder';
      case 'meeting-scheduling': return 'Meeting Scheduling';
      case 'announcement': return 'General Announcement';
      default: return 'Campaign';
    }
  };
  
  // Format time window for display
  const formatTimeWindow = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    if (hour === 0) return '12:00 AM';
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return '12:00 PM';
    return `${hour - 12}:00 PM`;
  };
  
  // Format preview text (truncate if too long)
  const formatPreview = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Review Your Campaign</h2>
        <p className="text-muted-foreground mt-2">
          Please review your campaign details before launching
        </p>
      </div>
      
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-600">Ready to launch!</AlertTitle>
        <AlertDescription className="text-green-700">
          Your campaign is ready to be launched. Please review the details below.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Campaign Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Campaign Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {getCampaignTypeLabel(campaignType)}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Audience */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{contactCount} contacts</div>
                {listName && <div className="text-sm text-muted-foreground">List: {listName}</div>}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Schedule */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled Start</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <div className="font-medium">
                {scheduledDate ? format(scheduledDate, 'PPP') : 'Not scheduled'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Message Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Initial Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">
              {formatPreview(messagePreview, 300)}
            </div>
          </CardContent>
        </Card>
        
        {/* Follow-up Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MessageSquareDashed className="mr-2 h-4 w-4" />
              Follow-Up Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">
              {followUpPreview ? formatPreview(followUpPreview, 300) : 'No follow-up message configured'}
            </div>
            {followUpPreview && scheduledDate && (
              <div className="mt-2 text-sm text-muted-foreground">
                Sent after {followUpDelay} {followUpDelay === 1 ? 'day' : 'days'} if no response
                (around {format(addDays(scheduledDate, followUpDelay), 'PPP')})
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Clock className="mr-2 h-4 w-4" /> Sending Window
            </h4>
            <p className="text-sm">
              Messages will be sent between {formatTimeWindow(timeWindow.start)} and {formatTimeWindow(timeWindow.end)}
              {avoidWeekends ? ', excluding weekends' : ''}
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Mail className="mr-2 h-4 w-4" /> Message Delivery
            </h4>
            <p className="text-sm">
              Initial messages will be sent starting on the scheduled date.
              {followUpPreview && ` Follow-ups will be sent ${followUpDelay} ${followUpDelay === 1 ? 'day' : 'days'} after no response.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignReview;
